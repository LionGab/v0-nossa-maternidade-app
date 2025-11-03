#!/bin/bash
# Script para limpar histórico Git de arquivos .env
# ⚠️ ATENÇÃO: Este script reescreve o histórico Git e requer force push
# Use apenas se arquivos .env foram commitados acidentalmente

set -e

echo "🔒 Script de Limpeza de Histórico Git - Arquivos .env"
echo "=================================================="
echo ""
echo "⚠️  ATENÇÃO: Este script irá:"
echo "   1. Reescrever TODO o histórico Git"
echo "   2. Remover arquivos .env* de todos os commits"
echo "   3. Requer force push para sincronizar"
echo ""
read -p "Tem certeza que deseja continuar? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Operação cancelada."
    exit 1
fi

echo ""
echo "📋 Verificando se há arquivos .env no histórico..."
echo ""

# Verificar se há arquivos .env no histórico
if git log --all --full-history --source --remotes -- ".env*" | grep -q ".env"; then
    echo "⚠️  Arquivos .env encontrados no histórico!"
    echo ""
    echo "Escolha o método de limpeza:"
    echo "1) git filter-branch (built-in, mais lento)"
    echo "2) BFG Repo-Cleaner (recomendado, mais rápido)"
    echo ""
    read -p "Escolha (1 ou 2): " method

    case $method in
        1)
            echo ""
            echo "🔧 Usando git filter-branch..."
            echo ""

            # Criar backup da branch atual
            BACKUP_BRANCH="backup-before-env-cleanup-$(date +%Y%m%d-%H%M%S)"
            git branch "$BACKUP_BRANCH"
            echo "✅ Backup criado: $BACKUP_BRANCH"
            echo ""

            # Remover .env* de todo o histórico
            git filter-branch --force --index-filter \
                "git rm --cached --ignore-unmatch .env .env.local .env.development .env.production .env.test" \
                --prune-empty --tag-name-filter cat -- --all

            echo ""
            echo "✅ Histórico limpo com git filter-branch"
            ;;
        2)
            echo ""
            echo "📦 Verificando se BFG está instalado..."

            if ! command -v bfg &> /dev/null; then
                echo "❌ BFG Repo-Cleaner não está instalado."
                echo "   Instale com: brew install bfg (macOS) ou baixe de:"
                echo "   https://rtyley.github.io/bfg-repo-cleaner/"
                exit 1
            fi

            # Criar backup
            BACKUP_BRANCH="backup-before-env-cleanup-$(date +%Y%m%d-%H%M%S)"
            git branch "$BACKUP_BRANCH"
            echo "✅ Backup criado: $BACKUP_BRANCH"
            echo ""

            # Usar BFG para remover .env
            echo "🔧 Usando BFG Repo-Cleaner..."
            bfg --delete-files .env
            bfg --delete-files .env.local
            bfg --delete-files .env.development
            bfg --delete-files .env.production
            bfg --delete-files .env.test

            # Limpar referências
            git reflog expire --expire=now --all
            git gc --prune=now --aggressive

            echo ""
            echo "✅ Histórico limpo com BFG Repo-Cleaner"
            ;;
        *)
            echo "❌ Opção inválida. Cancelando."
            exit 1
            ;;
    esac

    echo ""
    echo "📊 Estatísticas do repositório:"
    git count-objects -vH

    echo ""
    echo "⚠️  PRÓXIMOS PASSOS:"
    echo "   1. Revise o histórico: git log --all --oneline"
    echo "   2. Se estiver satisfeito, force push:"
    echo "      git push origin --force --all"
    echo "      git push origin --force --tags"
    echo "   3. ⚠️  AVISE sua equipe antes do force push!"
    echo "   4. Depois do push, todos devem fazer:"
    echo "      git fetch origin"
    echo "      git reset --hard origin/main"
    echo ""
    echo "💡 DICA: Se algo der errado, restaure o backup:"
    echo "   git checkout $BACKUP_BRANCH"

else
    echo "✅ Nenhum arquivo .env encontrado no histórico!"
    echo "   Não é necessária limpeza."
fi

echo ""
echo "✅ Script concluído."
