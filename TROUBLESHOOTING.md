# Nossa Maternidade - Guia de Troubleshooting

## Problemas Comuns e Soluções

### Autenticação

#### Erro: "Unauthorized" ao acessar APIs

**Causa:** Sessão expirada ou token inválido.

**Solução:**
1. Verificar se usuário está logado
2. Limpar cookies e fazer login novamente
3. Verificar variáveis de ambiente do Supabase

---

#### Middleware redirecionando incorretamente

**Causa:** Configuração de rotas no middleware.

**Solução:**
1. Verificar `middleware.ts`
2. Confirmar rotas públicas vs protegidas
3. Checar cookies do Supabase

---

### Banco de Dados

#### Erro: "relation does not exist"

**Causa:** Tabelas não criadas no Supabase.

**Solução:**
1. Executar scripts SQL em ordem no Supabase SQL Editor

---

#### Trigger não executando

**Causa:** Trigger `handle_new_user()` não configurado.

**Solução:**
1. Executar `scripts/fix_handle_new_user.sql`
2. Verificar trigger no Supabase

---

### APIs

#### Erro: "Invalid input data"

**Causa:** Validação Zod falhou.

**Solução:**
1. Verificar formato do payload
2. Checar `lib/validations/schemas.ts`

---

### Performance

#### Consultas lentas

**Causa:** Falta de indexes no banco.

**Solução:**
1. Executar `scripts/014_add_performance_indexes.sql`

---

## Comandos Úteis

```bash
npm run dev              # Desenvolvimento
npm run build            # Build
npm run test             # Testes unitários
npm run test:e2e         # Testes E2E
```

