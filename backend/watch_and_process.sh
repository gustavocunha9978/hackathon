#!/bin/bash

UPLOAD_DIR="./uploads"
MINIO_BUCKET="documentos"
MINIO_ALIAS="local"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_URL="http://localhost:9000"
API_ANALYZE_URL="http://localhost:3000/api/pdf/analyze"

# Adiciona alias do MinIO
mc alias set $MINIO_ALIAS $MINIO_URL $MINIO_ACCESS_KEY $MINIO_SECRET_KEY 2>/dev/null

# Cria o bucket se não existir
mc ls $MINIO_ALIAS/$MINIO_BUCKET > /dev/null 2>&1
if [ $? -ne 0 ]; then
  mc mb $MINIO_ALIAS/$MINIO_BUCKET
fi

echo "👀 Aguardando novos PDFs na pasta '$UPLOAD_DIR'..."

inotifywait -m -e close_write --format '%w%f' "$UPLOAD_DIR" | while read file; do
  if [[ "$file" == *.pdf ]]; then
    filename=$(basename "$file")
    echo "📥 Novo arquivo detectado: $filename"

    echo "🔁 Enviando $filename para MinIO..."
    mc cp "$file" $MINIO_ALIAS/$MINIO_BUCKET/

    echo "🤖 Enviando para IA para análise..."
    curl -s -X POST "$API_ANALYZE_URL" -F "file=@$file" | jq

    echo "✅ Processado: $filename"
    echo "------------------------------------------"
  fi
done
