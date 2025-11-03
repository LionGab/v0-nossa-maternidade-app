@echo off
REM Script para instalar dependências com --legacy-peer-deps
REM Resolve conflitos de peer dependencies

echo ========================================
echo  Instalando Dependencias
echo  (Resolvendo conflitos de peer deps)
echo ========================================
echo.

echo Executando: npm install --legacy-peer-deps
echo.
echo Isso pode levar alguns minutos...
echo.

npm install --legacy-peer-deps

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  ✓ Instalacao concluida com sucesso!
    echo ========================================
    echo.
    echo Agora voce pode executar:
    echo   npm test
    echo   npm run test:all
    echo.
) else (
    echo.
    echo ========================================
    echo  ✗ Erro na instalacao
    echo ========================================
    echo.
    echo Tente:
    echo   1. Limpar cache: npm cache clean --force
    echo   2. Executar novamente este script
    echo.
)

pause
