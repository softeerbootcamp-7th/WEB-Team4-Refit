output "n8n_url" {
  description = "The URL of the deployed n8n, Cloud Run service"
  value       = google_cloud_run_v2_service.n8n_service.uri
}
