#!/bin/bash

# Configuration
DB_USER="postgres"         # Default PostgreSQL username
DB_NAME="valorant_tracker_db"
DB_PASSWORD="1"            # Your password
DB_HOST="localhost"
DB_PORT="5432"

# Function to check command success
check_success() {
  if [ $? -eq 0 ]; then
    echo "✅ $1"
  else
    echo "❌ $1 failed"
    exit 1
  fi
}

echo "🔍 Checking if PostgreSQL is installed..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it and try again."
    exit 1
fi
check_success "PostgreSQL installation check"

echo "🔍 Checking if PostgreSQL service is running..."
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo "❌ PostgreSQL service is not running. Starting it now..."
    sudo systemctl start postgresql
    check_success "PostgreSQL service started"
else
    echo "✅ PostgreSQL service is running."
fi

echo "🔍 Checking if database '$DB_NAME' already exists..."
DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" | xargs)

if [ "$DB_EXISTS" == "1" ]; then
    echo "✅ Database '$DB_NAME' already exists. Skipping creation."
else
    echo "🚀 Creating database '$DB_NAME'..."
    PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d postgres -c "CREATE DATABASE $DB_NAME;"
    check_success "Database created"
fi

echo "🔍 Checking if user '$DB_USER' has privileges..."
USER_HAS_PRIV=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER' AND rolcreatedb = true;" | xargs)

if [ "$USER_HAS_PRIV" != "1" ]; then
    echo "⚠️ Granting CREATEDB privilege to '$DB_USER'..."
    PGPASSWORD=$DB_PASSWORD psql -U postgres -h $DB_HOST -d postgres -c "ALTER USER $DB_USER CREATEDB;"
    check_success "CREATEDB privilege granted"
fi

echo "🔍 Running Sequelize migrations..."
cd "$(dirname "$0")" # Move to script directory (server/)
npx sequelize-cli db:migrate
check_success "Sequelize migrations completed"

echo "✅ Database setup complete! Ready to start your project."
