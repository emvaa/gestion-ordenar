# Script para subir el proyecto a Git
# Ejecuta este script desde la carpeta visualizador-reportes

Write-Host "🚀 Configurando Git para Visualizador de Reportes" -ForegroundColor Cyan
Write-Host ""

# Verificar si ya existe .git
if (Test-Path .git) {
    Write-Host "⚠️  Ya existe un repositorio Git aquí" -ForegroundColor Yellow
    $respuesta = Read-Host "¿Quieres eliminar el origin anterior? (s/n)"
    if ($respuesta -eq "s" -or $respuesta -eq "S") {
        git remote remove origin 2>$null
        Write-Host "✅ Origin anterior eliminado" -ForegroundColor Green
    }
} else {
    Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Repositorio inicializado" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 Agregando archivos..." -ForegroundColor Cyan
git add .
Write-Host "✅ Archivos agregados" -ForegroundColor Green

Write-Host ""
Write-Host "💾 Creando commit inicial..." -ForegroundColor Cyan
git commit -m "Initial commit: Visualizador de Reportes CSV"
Write-Host "✅ Commit creado" -ForegroundColor Green

Write-Host ""
Write-Host "🔗 Configurando repositorio remoto..." -ForegroundColor Cyan
Write-Host ""
$repoUrl = Read-Host "Ingresa la URL de tu repositorio (ej: https://github.com/usuario/repo.git)"

if ($repoUrl) {
    # Verificar si origin ya existe
    $originExists = git remote -v 2>$null | Select-String "origin"
    if ($originExists) {
        Write-Host "⚠️  Origin ya existe, eliminando..." -ForegroundColor Yellow
        git remote remove origin
    }
    
    git remote add origin $repoUrl
    Write-Host "✅ Origin configurado: $repoUrl" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🌿 Configurando rama main..." -ForegroundColor Cyan
    git branch -M main
    
    Write-Host ""
    Write-Host "⬆️  Subiendo archivos a GitHub..." -ForegroundColor Cyan
    Write-Host ""
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ ¡Proyecto subido exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
        Write-Host "1. Ve a tu repositorio en GitHub" -ForegroundColor White
        Write-Host "2. Settings > Pages > Selecciona 'main' branch" -ForegroundColor White
        Write-Host "3. Tu sitio estará disponible en unos minutos" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ Error al subir. Verifica:" -ForegroundColor Red
        Write-Host "- Que la URL del repositorio sea correcta" -ForegroundColor Yellow
        Write-Host "- Que tengas permisos de escritura" -ForegroundColor Yellow
        Write-Host "- Que hayas configurado autenticación (token o SSH)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ No se ingresó URL. Ejecuta manualmente:" -ForegroundColor Red
    Write-Host "git remote add origin TU_URL" -ForegroundColor Yellow
    Write-Host "git push -u origin main" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
