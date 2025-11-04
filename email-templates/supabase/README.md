# 📧 Templates de Email - Nossa Maternidade

Templates de email bonitos e empáticos para o Supabase Auth, alinhados com os princípios de design de maternidade.

## 🎨 Design

- **Paleta de cores**: Terracota (#E07A5F), Verde sage (#81B29A), Coral (#F2A287), Azul dusk (#6B9AC4)
- **Tipografia**: System fonts para máxima compatibilidade
- **Layout**: Mobile-first, responsivo
- **Tom**: Empático, acolhedor, celebrativo (não clínico)

## 📋 Templates Disponíveis

1. **confirm-signup.html** - Confirmação de cadastro
2. **invite-user.html** - Convite para usuário
3. **magic-link.html** - Link mágico (login sem senha)
4. **change-email.html** - Mudança de email
5. **reset-password.html** - Recuperação de senha
6. **reauthentication.html** - Reautenticação

Cada template possui um arquivo `.txt` correspondente com o subject line.

## 🚀 Como Configurar no Supabase

### Passo 1: Acessar Email Templates

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Authentication** → **Email Templates**

### Passo 2: Configurar Cada Template

Para cada tipo de email:

1. Selecione o template (ex: "Confirm signup")
2. Copie o conteúdo HTML do arquivo correspondente
3. Cole no campo **Message body (HTML)**
4. Copie o conteúdo do arquivo `-subject.txt`
5. Cole no campo **Subject heading**
6. Clique em **Save**

### Passo 3: Variáveis Disponíveis

O Supabase fornece estas variáveis que são substituídas automaticamente:

- `{{ .ConfirmationURL }}` - Link de confirmação/ação
- `{{ .Email }}` - Email do usuário (quando disponível)
- `{{ .Token }}` - Token de confirmação (quando disponível)
- `{{ .TokenHash }}` - Hash do token (quando disponível)
- `{{ .SiteURL }}` - URL do site configurada
- `{{ .RedirectTo }}` - URL de redirecionamento

## 📱 Testando os Templates

### Preview no Supabase

1. No Supabase Dashboard → Authentication → Email Templates
2. Clique em "Preview" para ver como o email ficará

### Teste Real

1. Configure o template no Supabase
2. Faça um signup de teste ou solicite reset de senha
3. Verifique o email recebido
4. Ajuste conforme necessário

## 🎯 Princípios Aplicados

- ✅ **Empathy over efficiency**: Tom acolhedor e compreensivo
- ✅ **Celebrate, don't medicalize**: Linguagem positiva e celebrativa
- ✅ **Privacy is power**: Informações claras sobre segurança
- ✅ **Delight in details**: Design cuidadoso e detalhado

## 🔧 Personalização

Para personalizar ainda mais:

1. **Cores**: Edite os valores hex no HTML (`#E07A5F`, `#81B29A`, etc.)
2. **Textos**: Ajuste as mensagens conforme necessário
3. **Logo**: Adicione uma tag `<img>` no header se tiver logo hospedado
4. **Footer**: Customize informações de contato/suporte

## ⚠️ Notas Importantes

- Os templates são **mobile-responsive** por padrão
- Compatíveis com **Gmail, Outlook, Apple Mail** e outros clientes principais
- Links de confirmação expiram automaticamente (configurado no Supabase)
- Sempre teste em diferentes clientes de email antes de usar em produção

## 📚 Referências

- [Supabase Email Templates Documentation](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email HTML Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding/)
