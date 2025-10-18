# Script PowerShell d'automatisation des tests Newman pour HelpDesk
# Usage: .\run-newman-tests.ps1

Write-Host "🚀 Démarrage des tests automatisés HelpDesk avec Newman" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Vérifier que Newman est installé
try {
    $newmanVersion = newman --version
    Write-Host "✅ Newman détecté: $newmanVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Newman n'est pas installé. Installation en cours..." -ForegroundColor Red
    npm install -g newman
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Échec de l'installation de Newman" -ForegroundColor Red
        exit 1
    }
}

# Vérifier que le serveur est démarré
Write-Host "🔍 Vérification que le serveur est démarré..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/getAllTicketsASC" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Serveur détecté et accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Le serveur HelpDesk n'est pas démarré sur localhost:3000" -ForegroundColor Red
    Write-Host "💡 Veuillez démarrer le serveur avec: npm start" -ForegroundColor Yellow
    exit 1
}

# Créer le dossier de rapports s'il n'existe pas
if (!(Test-Path "reports")) {
    New-Item -ItemType Directory -Name "reports"
}

# Exécuter les tests avec Newman
Write-Host "🧪 Exécution des tests..." -ForegroundColor Yellow
newman run HelpDesk_Tests_Corrected.postman_collection.json `
    -e HelpDesk_Environment.postman_environment.json `
    -d data.json `
    -r cli,html,json `
    --reporter-html-export reports/newman-report.html `
    --reporter-json-export reports/newman-results.json `
    --delay-request 1000 `
    --timeout-request 10000

# Vérifier le résultat
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Tous les tests sont passés avec succès!" -ForegroundColor Green
    Write-Host "📊 Rapport HTML généré: reports/newman-report.html" -ForegroundColor Cyan
    Write-Host "📄 Résultats JSON: reports/newman-results.json" -ForegroundColor Cyan
} else {
    Write-Host "❌ Certains tests ont échoué" -ForegroundColor Red
    Write-Host "📊 Consultez le rapport pour plus de détails: reports/newman-report.html" -ForegroundColor Yellow
    exit 1
}

Write-Host "🎉 Tests terminés!" -ForegroundColor Green
