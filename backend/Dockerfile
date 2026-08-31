FROM python:3.12-slim

WORKDIR /app

# psycopg2-binary needs libpq at runtime; build tools only needed transiently
# for the pip install step below and aren't kept in the final layer since
# this is a single-stage but slim base with no dev headers baked in beyond
# what pip install pulls in for the wheel build.
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
