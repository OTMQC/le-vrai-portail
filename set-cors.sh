#!/bin/bash

JSON_PATH="/Users/julz/Desktop/portail-artiste-otmqc/le-vrai-portail/corps.json"
BUCKET_NAME="otmqc-docs-storage"

echo "Bucket : gs://${BUCKET_NAME}"
gsutil cors set "$JSON_PATH" gs://$BUCKET_NAME
echo "✅ CORS appliqué à gs://${BUCKET_NAME}"
