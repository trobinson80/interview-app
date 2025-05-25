FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire project (including credentials if written during CI)
COPY . .

# Set environment variable so firebase.py can find the credentials
ENV FIREBASE_ADMIN_CREDENTIALS=./credentials/firebaseServiceAccount.json
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Start the FastAPI server
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]