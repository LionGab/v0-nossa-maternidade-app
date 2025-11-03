@echo off
REM Scripts alternativos usando npm (se pnpm não estiver instalado)
REM Execute este arquivo ou use os comandos diretamente no terminal

echo ==========================================
echo Scripts de Teste - Nossa Maternidade
echo ==========================================
echo.

echo Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERRO: Node.js não está instalado!
    echo Por favor, instale Node.js de https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Verificando npm...
npm --version
if %errorlevel% neq 0 (
    echo ERRO: npm não está instalado!
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Escolha uma opção:
echo ==========================================
echo 1. Instalar dependências
echo 2. Executar todos os testes
echo 3. Executar testes unitários
echo 4. Executar testes E2E
echo 5. Verificar código (lint + test + build)
echo 6. Instalar pnpm
echo.
set /p choice="Digite o número da opção: "

if "%choice%"=="1" (
    echo Instalando dependências...
    npm install
)

if "%choice%"=="2" (
    echo Executando todos os testes...
    npm run test
    npm run test:e2e
)

if "%choice%"=="3" (
    echo Executando testes unitários...
    npm run test
)

if "%choice%"=="4" (
    echo Executando testes E2E...
    npm run test:e2e
)

if "%choice%"=="5" (
    echo Verificando código...
    npm run type-check
    npm run lint
    npm run test
    npm run build
)

if "%choice%"=="6" (
    echo Instalando pnpm...
    npm install -g pnpm
    echo.
    echo pnpm instalado! Reinicie o terminal e tente novamente.
)

echo.
echo ==========================================
echo Concluído!
echo ==========================================
pause
