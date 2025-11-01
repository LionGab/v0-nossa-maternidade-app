@echo off
REM Nossa Maternidade - Script de Início Rápido (Windows)
REM Automatiza todo o processo de setup e verificação

echo.
echo ===================================
echo Nossa Maternidade - Quick Start
echo ===================================
echo.

REM Verificar Node.js
echo Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado. Por favor, instale Node.js 18+
    exit /b 1
)
node -v
echo [OK] Node.js instalado
echo.

REM Verificar pnpm
echo Verificando pnpm...
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] pnpm nao encontrado. Instalando...
    npm install -g pnpm
)
pnpm -v
echo [OK] pnpm instalado
echo.

REM Instalar dependências
echo.
echo Instalando dependencias...
call pnpm install
echo.

REM Verificar variáveis de ambiente
echo Verificando variaveis de ambiente...
if not exist .env.local (
    echo [AVISO] Arquivo .env.local nao encontrado
    echo Copiando .env.example para .env.local...
    copy .env.example .env.local
    echo [AVISO] Por favor, edite .env.local com suas credenciais
)
echo.

REM Executar testes
echo Executando testes...
call pnpm test
echo.

REM Build de verificação
echo Executando build de verificacao...
call pnpm build
echo.

echo.
echo [OK] Setup completo!
echo.
echo Proximos passos:
echo 1. Configure suas variaveis de ambiente em .env.local
echo 2. Execute 'pnpm dev' para iniciar o servidor de desenvolvimento
echo 3. Execute 'pnpm check' antes de fazer commit
echo.
echo Documentacao completa:
echo - README.md
echo - AUTOMATION.md
echo - ARCHITECTURE.md
echo.

pause
