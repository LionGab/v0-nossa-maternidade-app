# ⚡ QUICK START - Validações Finais

**Tempo estimado:** 15-20 minutos

---

## 🚀 COMANDOS RÁPIDOS

### 1. Instalar Sentry (Opcional)
```bash
npm install --save @sentry/nextjs --legacy-peer-deps
```
**Nota:** Usa `--legacy-peer-deps` devido ao conflito de peer dependencies com React 19 (vaul requer React 18, mas funciona com 19).

### 2. Rodar Build
```bash
npm run build
```
**Se houver erros:** Corrigir TypeScript conforme `BUILD_FIXES.md`

### 3. Testar Dev
```bash
npm run dev
```
**Verificar:** Site carrega em http://localhost:3000

### 4. Otimizar Imagens
```bash
npm install -g sharp-cli
npm run optimize:images
```
**Resultado:** WebP criados, relatório gerado

### 5. Rodar Testes
```bash
npm test                    # Testes unitários
npm run test:coverage       # Coverage
npm run test:e2e            # Testes E2E
```

---

## ✅ VALIDAÇÃO RÁPIDA

- [ ] Build passa sem erros
- [ ] Dev server inicia
- [ ] Testes passam
- [ ] Imagens otimizadas

---

**Tempo total:** ~20 minutos
