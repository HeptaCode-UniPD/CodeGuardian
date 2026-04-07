#!/bin/bash

# --- CONFIGURAZIONE ---
BUCKET_NAME="frontend-codeguardian"
IMAGE_NAME="frontend-builder-temp"
CONTAINER_NAME="extract-container"

# 1. Pulizia locale e aggiornamento
echo "Inizio deploy: Aggiornamento codice..."
git pull

# 2. Build dell'immagine Docker
# Questo comando compila il progetto "dentro" Docker
echo "Building dell'immagine Docker..."
docker build -t $IMAGE_NAME .

# 3. Estrazione dei file compilati
# Rimuoviamo la vecchia cartella dist se esiste e la ricreiamo
echo "Estrazione dei file dalla build..."
rm -rf ./dist
docker create --name $CONTAINER_NAME $IMAGE_NAME
docker cp $CONTAINER_NAME:/usr/share/nginx/html ./dist
docker rm $CONTAINER_NAME

# 4. Sincronizzazione su S3
# --delete rimuove i file sul bucket che non esistono più in locale (pulisce i "casini")
# --exclude "*.DS_Store" evita di caricare file spazzatura del sistema operativo
echo "Sincronizzazione su S3 (Bucket: $BUCKET_NAME)..."
aws s3 sync ./dist s3://$BUCKET_NAME --delete --exclude "*.DS_Store"

echo "Deploy completato con successo!"