# Use official Python runtime as the base image
FROM python:3.9-slim

# Set environment variables
ENV APP_PORT=5000
ENV APP_ENV=development

# Set working directory in container
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Make port 5000 available to the world outside the container
EXPOSE $APP_PORT

# Command to run the application
CMD ["python", "app.py"]
