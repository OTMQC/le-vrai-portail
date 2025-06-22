#!/bin/bash
JSON_PATH="/Users/julz/Desktop/portail-artiste-otmqc/le-vrai-portail/corps.json"
PROJECT_ID=$(gcloud config get-value project)
BUCKET_NAME="${PROJECT_ID}.appspot.com"
echo "Projet : $PROJECT_ID"
echo "Bucket : gs://$BUCKET_NAME"
gsutil cors set "$JSON_PATH" "gs://$BUCKET_NAME"
echo "CORS appliqué à gs://$BUCKET_NAME"
