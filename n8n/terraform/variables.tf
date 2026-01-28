variable "project_id" {
  description = "The Google Cloud project ID"
  type        = string
}

variable "region" {
  description = "The Google Cloud region to deploy resources"
  type        = string
  default     = "asia-northeast3"
}

# --- Cloud SQL ---
variable "db_instance_name" {
  description = "The name of the Cloud SQL instance"
  type        = string
  default     = "n8n-db"
}

variable "db_version" {
  description = "The database version for Cloud SQL"
  type        = string
  default     = "POSTGRES_13"
}

variable "db_tier" {
  description = "The machine type for Cloud SQL"
  type        = string
  default     = "db-f1-micro"
}

variable "db_disk_size" {
  description = "The disk size for Cloud SQL in GB"
  type        = number
  default     = 10
}

variable "db_disk_type" {
  description = "The disk type for Cloud SQL"
  type        = string
  default     = "PD_HDD"
}

variable "db_name" {
  description = "The name of the database to create"
  type        = string
  default     = "n8n"
}

variable "db_user_name" {
  description = "The name of the database user"
  type        = string
  default     = "n8n-user"
}

# --- Cloud Run ---
variable "service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "n8n"
}

variable "container_image" {
  description = "The container image to deploy"
  type        = string
  default     = "n8nio/n8n:latest"
}

variable "container_port" {
  description = "The port the container listens on"
  type        = number
  default     = 5678
}

variable "service_account_id" {
  description = "The ID of the service account"
  type        = string
  default     = "n8n-service-account"
}

variable "service_memory_limit" {
  description = "Memory limit for the Cloud Run service"
  type        = string
  default     = "2Gi"
}

variable "n8n_domain" {
  description = "The domain name for n8n (e.g., n8n.example.com)"
  type        = string
}
