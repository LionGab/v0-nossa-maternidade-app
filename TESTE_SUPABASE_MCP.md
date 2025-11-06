# 🧪 Teste do Supabase MCP no Cursor

## ✅ Status da Configuração

### Configuração do MCP

O Supabase MCP está configurado no arquivo `cursor-mcp-config.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "supabase-mcp"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY}",
        "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

## 🔍 Como Usar o Supabase MCP no Cursor

### 1. No Chat do Cursor

Abra o chat do Cursor (`Ctrl + L`) e use comandos como:

```
Use o Supabase MCP para consultar a tabela profiles
```

Ou:

```
Liste todas as tabelas do Supabase usando o MCP
```

### 2. Verificar Configuração

O Supabase MCP usa as variáveis de ambiente do arquivo `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Testar Conexão

Execute o script de teste:

```bash
node scripts/test-supabase-mcp.mjs
```

Ou use o teste existente:

```bash
node test-supabase-credentials.mjs
```

## 📊 Comandos Disponíveis no Supabase MCP

Quando o Supabase MCP está configurado no Cursor, você pode pedir:

1. **Listar tabelas**:
   ```
   Use o Supabase MCP para listar todas as tabelas
   ```

2. **Consultar dados**:
   ```
   Use o Supabase MCP para consultar os primeiros 10 registros da tabela profiles
   ```

3. **Verificar schema**:
   ```
   Use o Supabase MCP para mostrar o schema da tabela profiles
   ```

4. **Executar queries**:
   ```
   Use o Supabase MCP para executar: SELECT COUNT(*) FROM profiles
   ```

5. **Criar migrations**:
   ```
   Use o Supabase MCP para criar uma migration que adiciona uma coluna email na tabela profiles
   ```

## 🔧 Troubleshooting

### Problema: MCP não está funcionando

1. **Verifique se o MCP está instalado**:
   ```bash
   npm list -g supabase-mcp
   ```

2. **Instale o Supabase MCP**:
   ```bash
   npm install -g supabase-mcp
   ```

3. **Verifique as variáveis de ambiente**:
   - Certifique-se de que `.env.local` existe
   - Verifique se as variáveis estão configuradas corretamente

4. **Reinicie o Cursor**:
   - Feche completamente o Cursor
   - Reabra o Cursor
   - Aguarde alguns segundos para o MCP carregar

### Problema: Erro de conexão

1. **Verifique a URL do Supabase**:
   - Deve ser: `https://[seu-projeto].supabase.co`
   - Sem barra no final

2. **Verifique as credenciais**:
   - `SUPABASE_ANON_KEY` deve estar completa
   - `SUPABASE_SERVICE_ROLE_KEY` deve estar completa

3. **Teste a conexão**:
   ```bash
   node test-supabase-credentials.mjs
   ```

## ✅ Checklist de Verificação

- [ ] Supabase MCP configurado no `cursor-mcp-config.json`
- [ ] Variáveis de ambiente configuradas no `.env.local`
- [ ] Supabase MCP instalado globalmente (ou via npx)
- [ ] Cursor reiniciado após configuração
- [ ] Teste de conexão passou

## 📝 Próximos Passos

Após verificar que tudo está funcionando:

1. **Use o MCP no Cursor** para consultas rápidas
2. **Integre com workflows** para automação
3. **Use para criar migrations** automaticamente
4. **Use para analisar schema** e otimizar queries

## 🚀 Exemplos Práticos

### Exemplo 1: Consultar Tabela

```
No Cursor Chat:
"Use o Supabase MCP para consultar os primeiros 5 registros da tabela profiles"
```

### Exemplo 2: Verificar Schema

```
No Cursor Chat:
"Use o Supabase MCP para mostrar todas as colunas da tabela baby_profiles"
```

### Exemplo 3: Criar Migration

```
No Cursor Chat:
"Use o Supabase MCP para criar uma migration que adiciona a coluna phone_number na tabela profiles"
```

---

**Pronto para usar! Teste no Cursor Chat agora! 🚀**
