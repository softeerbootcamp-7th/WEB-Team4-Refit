# Terraform script for deploying n8n in "Durable mode" on Google Cloud Run
#
# This script is based on the instructions in the n8n documentation:
# https://docs.n8n.io/hosting/installation/server-setups/google-cloud-run.html#durable-mode

# Configure the Google Cloud provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable necessary APIs
resource "google_project_service" "run" {
  service = "run.googleapis.com"
}

resource "google_project_service" "sqladmin" {
  service = "sqladmin.googleapis.com"
}

resource "google_project_service" "secretmanager" {
  service = "secretmanager.googleapis.com"
}

# Create a random password for the database user
resource "random_password" "db_password" {
  length  = 16
  special = true
}

# Create a random encryption key
resource "random_password" "encryption_key" {
  length  = 42
  special = true
}

# Create the Cloud SQL for PostgreSQL instance
resource "google_sql_database_instance" "n8n_db_instance" {
  name             = var.db_instance_name
  database_version = var.db_version
  region           = var.region

  settings {
    tier              = var.db_tier
    availability_type = "ZONAL"
    disk_size         = var.db_disk_size
    disk_type         = var.db_disk_type
    backup_configuration {
      enabled = false
    }
  }

  deletion_protection = false
}

# Create the n8n database
resource "google_sql_database" "n8n_database" {
  name     = var.db_name
  instance = google_sql_database_instance.n8n_db_instance.name
}

# Create the n8n database user
resource "google_sql_user" "n8n_user" {
  name     = var.db_user_name
  instance = google_sql_database_instance.n8n_db_instance.name
  password = random_password.db_password.result
}

# Store the database password in Secret Manager
resource "google_secret_manager_secret" "n8n_db_password_secret" {
  secret_id = "n8n-db-password"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "n8n_db_password_secret_version" {
  secret      = google_secret_manager_secret.n8n_db_password_secret.id
  secret_data = random_password.db_password.result
}

# Store the encryption key in Secret Manager
resource "google_secret_manager_secret" "n8n_encryption_key_secret" {
  secret_id = "n8n-encryption-key"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "n8n_encryption_key_secret_version" {
  secret      = google_secret_manager_secret.n8n_encryption_key_secret.id
  secret_data = random_password.encryption_key.result
}

# Create a service account for the Cloud Run service
resource "google_service_account" "n8n_service_account" {
  account_id   = var.service_account_id
  display_name = "n8n Service Account"
}

# Grant the service account access to the database password secret
resource "google_secret_manager_secret_iam_member" "n8n_db_password_secret_accessor" {
  secret_id = google_secret_manager_secret.n8n_db_password_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.n8n_service_account.email}"
}

# Grant the service account access to the encryption key secret
resource "google_secret_manager_secret_iam_member" "n8n_encryption_key_secret_accessor" {
  secret_id = google_secret_manager_secret.n8n_encryption_key_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.n8n_service_account.email}"
}

# Grant the service account the Cloud SQL Client role
resource "google_project_iam_member" "n8n_cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.n8n_service_account.email}"
}

# Enable Vertex AI API
resource "google_project_service" "aiplatform" {
  service = "aiplatform.googleapis.com"
  disable_on_destroy = false
}

# Grant the service account access to Vertex AI
resource "google_project_iam_member" "n8n_vertex_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.n8n_service_account.email}"
}

# Deploy the n8n Cloud Run service
resource "google_cloud_run_v2_service" "n8n_service" {
  name                = var.service_name
  location            = var.region
  ingress             = "INGRESS_TRAFFIC_ALL"
  deletion_protection = false

  template {
    service_account = google_service_account.n8n_service_account.email

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.n8n_db_instance.connection_name]
      }
    }

    containers {
      image   = var.container_image
      command = ["/bin/sh"]
      args    = ["-c", "sleep 5; n8n start"]

      ports {
        container_port = var.container_port
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }

      resources {
        limits = {
          memory = var.service_memory_limit
        }
        cpu_idle = false
      }

      env {
        name  = "N8N_PORT"
        value = tostring(var.container_port)
      }
      env {
        name  = "N8N_PROTOCOL"
        value = "https"
      }
      env {
        name  = "DB_TYPE"
        value = "postgresdb"
      }
      env {
        name  = "DB_POSTGRESDB_DATABASE"
        value = google_sql_database.n8n_database.name
      }
      env {
        name  = "DB_POSTGRESDB_USER"
        value = google_sql_user.n8n_user.name
      }
      env {
        name  = "DB_POSTGRESDB_HOST"
        value = "/cloudsql/${google_sql_database_instance.n8n_db_instance.connection_name}"
      }
      env {
        name  = "DB_POSTGRESDB_PORT"
        value = "5432"
      }
      env {
        name  = "DB_POSTGRESDB_SCHEMA"
        value = "public"
      }
      env {
        name  = "GENERIC_TIMEZONE"
        value = "UTC"
      }
      env {
        name  = "QUEUE_HEALTH_CHECK_ACTIVE"
        value = "true"
      }
      env {
        name  = "N8N_HOST"
        value = var.n8n_domain
      }
      env {
        name  = "N8N_EDITOR_BASE_URL"
        value = "https://${var.n8n_domain}/"
      }
      env {
        name  = "WEBHOOK_URL"
        value = "https://${var.n8n_domain}/"
      }
      env {
        name = "DB_POSTGRESDB_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.n8n_db_password_secret.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "N8N_ENCRYPTION_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.n8n_encryption_key_secret.secret_id
            version = "latest"
          }
        }
      }
    }
  }

  depends_on = [
    google_project_service.run,
    google_project_service.sqladmin,
    google_project_service.secretmanager,
    google_secret_manager_secret_iam_member.n8n_db_password_secret_accessor,
    google_secret_manager_secret_iam_member.n8n_encryption_key_secret_accessor,
    google_project_iam_member.n8n_cloudsql_client,
  ]
}

resource "google_cloud_run_v2_service_iam_member" "n8n_public_invoker" {
  project  = google_cloud_run_v2_service.n8n_service.project
  location = google_cloud_run_v2_service.n8n_service.location
  name     = google_cloud_run_v2_service.n8n_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
