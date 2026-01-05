# Smart Helpdesk Setup Script

Write-Host "🚀 Smart Helpdesk - Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host "Checking for MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB is not running. Please start MongoDB or update .env with Atlas URI" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

# Install server dependencies
Write-Host "📦 Installing server dependencies..." -ForegroundColor Cyan
Set-Location -Path "server"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Server dependency installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Server dependencies installed" -ForegroundColor Green

# Create .env if not exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created. Please update it with your credentials" -ForegroundColor Green
}

# Seed database
Write-Host ""
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Cyan
npm run seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Database seeding failed. Make sure MongoDB is running" -ForegroundColor Yellow
} else {
    Write-Host "✓ Database seeded successfully" -ForegroundColor Green
}

# Install client dependencies
Write-Host ""
Write-Host "📦 Installing client dependencies..." -ForegroundColor Cyan
Set-Location -Path "../client"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Client dependency installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Client dependencies installed" -ForegroundColor Green

Set-Location -Path ".."

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Start the backend server:" -ForegroundColor White
Write-Host "   cd server" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. In a new terminal, start the frontend:" -ForegroundColor White
Write-Host "   cd client" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open browser at: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "📧 Demo Credentials:" -ForegroundColor Cyan
Write-Host "   Employee: employee@test.com / password123" -ForegroundColor Gray
Write-Host "   Agent:    agent@test.com / password123" -ForegroundColor Gray
Write-Host "   Admin:    admin@test.com / password123" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠ Don't forget to update server/.env with your email credentials!" -ForegroundColor Yellow
Write-Host ""
