# Documentação robots.txt - Nossa Maternidade PWA

## 📋 Visão Geral

Este documento explica a estratégia SEO implementada no arquivo `public/robots.txt` da aplicação Nossa Maternidade PWA.

## 📁 Localização

```
public/robots.txt
```

## 🔍 Estrutura do Arquivo

### 1. Regras Gerais (User-agent: *)

**Proposito:** Aplicar regras padrão para todos os crawlers não especificados.

- **Allow: /** - Permite indexação completa do site público
- **Disallow: /api/** - Bloqueia endpoints de API (não devem ser indexados)
- **Disallow: /admin/** - Bloqueia rotas administrativas (segurança)
- **Disallow: /internal/** - Bloqueia rotas internas do sistema
- **Disallow: /node_modules/, /.next/, /build/** - Bloqueia diretórios técnicos
- **Crawl-delay: 1** - Limita velocidade de crawling (protege servidor)

### 2. Regras Específicas - Googlebot

**Propósito:** Otimizar indexação no Google (principal buscador).

- Permite indexação completa com `Allow: /`
- Bloqueia mesmas rotas protegidas que nas regras gerais
- Crawl-delay de 1 segundo para não sobrecarregar

### 3. Regras Específicas - Bingbot

**Propósito:** Otimizar indexação no Bing (segundo maior buscador).

- Mesma estratégia do Googlebot
- Crawl-delay específico para controle do Bing

### 4. Outros Bots Populares

**Yandex e Baiduspider:**
- Permitem indexação mas com crawl-delay maior (2 segundos)
- Importante para mercados internacionais

### 5. Bloqueio de Bots Maliciosos

**Bots bloqueados:**
- `AhrefsBot` - Ferramenta de SEO scraping
- `SemrushBot` - Ferramenta de SEO scraping
- `MJ12bot` - Bot de coleta de dados
- `DotBot` - Bot de scraping

**Por quê?** Esses bots consomem recursos sem benefício real para SEO orgânico.

### 6. Sitemap URL

**Domínio Configurado:** https://nossamaternidade.netlify.app

**Sitemap:** https://nossamaternidade.netlify.app/sitemap.xml

**Status:** ✅ Sitemap dinâmico criado em `app/sitemap.ts` com todas as rotas públicas do app

## ✅ Checklist de Configuração

### Antes de Deploy

- [x] ✅ Domínio real configurado: https://nossamaternidade.netlify.app
- [x] ✅ Verificado que todas as rotas `/api/` estão bloqueadas
- [x] ✅ Sitemap.xml dinâmico criado e referenciado corretamente
- [ ] ⏳ Testar robots.txt em: https://www.google.com/webmasters/tools/robots-testing-tool
- [ ] ⏳ Verificar acesso: `https://nossamaternidade.netlify.app/robots.txt`

### Após Deploy

- [ ] ⏳ Registrar no Google Search Console
- [ ] ⏳ Submeter sitemap no Google Search Console
- [ ] ⏳ Monitorar indexação no Google Search Console
- [ ] ⏳ Verificar logs do servidor para bots acessando

## 🔧 Configuração no Google Search Console

### Passo 1: Acessar Google Search Console
1. Acesse: https://search.google.com/search-console
2. Faça login com conta Google

### Passo 2: Adicionar Propriedade
1. Clique em "Adicionar propriedade"
2. Escolha "Prefixo do URL" ou "Domínio"
3. Insira seu domínio completo
4. Siga instruções de verificação (DNS, arquivo HTML, etc.)

### Passo 3: Submeter Sitemap
1. No menu lateral, clique em "Sitemaps"
2. Insira o caminho: `sitemap.xml` ou `/sitemap.xml`
3. Clique em "Enviar"
4. Aguarde processamento (pode levar alguns dias)

### Passo 4: Testar robots.txt
1. No menu lateral, clique em "robots.txt Tester"
2. Digite uma URL para testar
3. Verifique se as regras estão sendo aplicadas corretamente

### Passo 5: Monitoramento
1. Verifique "Cobertura" para ver páginas indexadas
2. Monitore "Performance" para ver queries de busca
3. Configure alertas por email para problemas de indexação

## 📊 Interpretando Resultados

### Páginas Indexadas Aumentando
✅ **Bom sinal:** O Google está descobrindo e indexando suas páginas.

### Páginas Indexadas Estagnadas
⚠️ **Verificar:**
- Sitemap está atualizado?
- Conteúdo é único e valioso?
- Há erros de crawling no Search Console?

### Páginas Removidas
⚠️ **Possíveis causas:**
- Conteúdo duplicado
- Páginas de baixa qualidade
- Problemas técnicos (404, 500, etc.)

## 🚨 Troubleshooting

### robots.txt não é encontrado
- Verifique se arquivo está em `public/robots.txt` no Next.js
- Teste acesso direto: `https://seu-dominio.com/robots.txt`
- Verifique configuração do servidor (Netlify/Vercel)

### Google não está indexando
- Verifique se `Allow: /` está presente
- Confirme que sitemap foi submetido
- Aguarde alguns dias (Google leva tempo para processar)

### Muitos crawlers acessando /api/
- Verifique se `Disallow: /api/` está correto
- Adicione rate limiting no servidor
- Considere usar Cloudflare para bloquear bots

## 📝 Notas Importantes

1. **Sempre use HTTPS** na URL do sitemap
2. **Mantenha robots.txt atualizado** quando adicionar novas rotas protegidas
3. **Monitore logs** para identificar bots não listados
4. **Atualize sitemap.xml** regularmente com novo conteúdo
5. **Teste mudanças** antes de fazer deploy em produção

## 🔗 Recursos Úteis

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [robots.txt Tester](https://www.google.com/webmasters/tools/robots-testing-tool)
- [Next.js Sitemap Documentation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

## 📅 Próximos Passos

1. ✅ Criar arquivo robots.txt (FEITO)
2. ✅ Criar sitemap.xml dinâmico com rotas reais (FEITO)
3. ✅ Configurar domínio real no robots.txt (FEITO)
4. ⏳ Testar robots.txt e sitemap após deploy
5. ⏳ Configurar Google Search Console
6. ⏳ Monitorar indexação inicial
7. ⏳ Otimizar baseado em dados do Search Console

## ✅ Status Atual

- **Domínio:** https://nossamaternidade.netlify.app
- **robots.txt:** ✅ Configurado e pronto
- **sitemap.xml:** ✅ Dinâmico via app/sitemap.ts com 13 rotas públicas
- **Rotas no sitemap:** /, /chat, /dashboard, /maternidade-hoje, /receitas, /mundo-nath, /onboarding, /perfil-bebe, /rotina, /autocuidado, /brincadeiras, /historias-sono, /birras
- **Rotas excluídas:** /login, /signup, /signup-success, /offline, /code-agents (privadas/temporárias)
