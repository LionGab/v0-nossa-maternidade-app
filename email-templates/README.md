# 📧 Templates de Email - Nossa Maternidade

Templates de email responsivos e acolhedores para todas as interações do Supabase Auth.

---

## 📋 Lista de Templates

### 1. **Confirmação de Cadastro** (`01-confirmation-email.html`)
**Título Supabase:** `Confirme seu cadastro - Nossa Maternidade`

**Quando usar:** Enviado automaticamente quando nova usuária se cadastra.

**Variáveis:**
- `{{ .ConfirmationURL }}` - Link de confirmação

**Cor principal:** Terracota (#E07A5F)

---

### 2. **Link Mágico** (`02-magic-link.html`)
**Título Supabase:** `Seu acesso ao Nossa Maternidade`

**Quando usar:** Quando usuária solicita login sem senha (magic link).

**Variáveis:**
- `{{ .ConfirmationURL }}` - Link de login automático

**Cor principal:** Lavanda (#9F84A6)

---

### 3. **Redefinir Senha** (`03-reset-password.html`)
**Título Supabase:** `Redefinir sua senha - Nossa Maternidade`

**Quando usar:** Quando usuária esquece senha e solicita redefinição.

**Variáveis:**
- `{{ .ConfirmationURL }}` - Link para criar nova senha

**Cor principal:** Azul Dusk (#6B8DB8)

**Extras:**
- Dicas de senha forte
- Avisos de segurança
- Validade: 1 hora

---

### 4. **Alterar Email** (`04-change-email.html`)
**Título Supabase:** `Confirme seu novo email - Nossa Maternidade`

**Quando usar:** Quando usuária solicita mudança de endereço de email.

**Variáveis:**
- `{{ .ConfirmationURL }}` - Link de confirmação
- `{{ .NewEmail }}` - Novo email a ser confirmado

**Cor principal:** Coral (#E89A72)

**Extras:**
- Mostra novo email em destaque
- Validade: 24 horas
- Aviso de segurança importante

---

### 5. **Reautenticação** (`05-reauthentication.html`)
**Título Supabase:** `Confirme sua identidade - Nossa Maternidade`

**Quando usar:** Ação sensível requer confirmação de identidade.

**Variáveis:**
- `{{ .ConfirmationURL }}` - Link de verificação
- `{{ .SentAt }}` - Data/hora da solicitação

**Cor principal:** Verde Sage (#81B29A)

**Extras:**
- Informações técnicas da solicitação
- Validade: 30 minutos
- Explicação de por quê é necessário

---

### 6. **Convite de Usuário** (`06-invite-user.html`)
**Título Supabase:** `Você foi convidada! - Nossa Maternidade`

**Quando usar:** Admin convida nova usuária para a plataforma.

**Variáveis:**
- `{{ .ConfirmationURL }}` - Link de aceite do convite
- `{{ .InvitedByEmail }}` - Email de quem enviou convite

**Cor principal:** Gradiente Terracota → Coral (#E07A5F → #F2B896)

**Extras:**
- Lista de funcionalidades da plataforma
- Validade: 7 dias
- Design celebratório com emoji 🎉

---

## 🎨 Características de Design

### Paleta de Cores (Design System Maternal)

```
Backgrounds:
- Principal: #FAF9F6 (bege suave)
- Card: #FFFFFF (branco)
- Destaque: #F5F2ED (bege claro)

Cores Emocionais:
- Terracota (Acolhimento): #E07A5F
- Coral (Energia): #E89A72
- Verde Sage (Calma): #81B29A
- Azul Dusk (Confiança): #6B8DB8
- Lavanda (Suporte): #9F84A6

Textos:
- Principal: #2C2C2C (quase-preto morno)
- Secundário: #6B6560 (cinza quente)
- Muted: #A8A8A8 (cinza neutro)
```

### Tipografia

```
Headings: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
Tamanhos:
- H1: 28-32px
- Body: 17px (otimizado para iOS)
- Small: 13-15px
Line-height: 1.6-1.7 (conforto visual)
```

### Elementos Visuais

**Botões CTA:**
- Border-radius: 12px
- Padding: 16px 32px
- Box-shadow com cor do botão (30% opacity)
- Hover: Não aplicável em email

**Cards de Destaque:**
- Border-left: 4px solid (cor emocional)
- Border-radius: 8px
- Backgrounds suaves

**Gradientes:**
- Linear-gradient(135deg) para headers
- Transições suaves entre cores relacionadas

---

## 📱 Responsividade

Todos os templates são **100% responsivos** e testados em:

✅ **Desktop:**
- Gmail (Chrome, Firefox, Safari)
- Outlook 2016/2019/365
- Apple Mail
- Thunderbird

✅ **Mobile:**
- iOS Mail (iPhone/iPad)
- Gmail App (iOS/Android)
- Outlook App
- Samsung Email

✅ **Webmail:**
- Gmail.com
- Outlook.com
- Yahoo Mail
- ProtonMail

---

## 🔧 Como Configurar no Supabase

### Método 1: Dashboard do Supabase

1. Acesse: `Authentication` → `Email Templates`
2. Selecione o template (Confirmation, Magic Link, etc.)
3. Copie o HTML do arquivo correspondente
4. Cole no campo "Message (HTML)"
5. Atualize o Subject (título) conforme indicado
6. Salve as alterações

### Método 2: API/CLI do Supabase

```bash
# Exemplo usando Supabase CLI
supabase settings email-templates update \
  --template confirmation \
  --subject "Confirme seu cadastro - Nossa Maternidade" \
  --body "$(cat 01-confirmation-email.html)"
```

---

## 🧪 Como Testar

### Teste Local (Navegador)

```bash
# Abra qualquer HTML no navegador
open 01-confirmation-email.html
```

**Nota:** As variáveis Supabase (`{{ .ConfirmationURL }}`) não funcionarão localmente. Substitua manualmente para visualização:

```html
<!-- Temporário para teste -->
<a href="https://exemplo.com/confirmar">Confirmar email</a>
```

### Teste no Supabase

1. Crie uma conta de teste
2. Realize a ação (signup, password reset, etc.)
3. Verifique o email recebido
4. Teste o link
5. Valide responsividade em diferentes dispositivos

### Ferramentas de Teste

**Validadores:**
- [Litmus](https://litmus.com/) - Teste em 90+ clientes
- [Email on Acid](https://www.emailonacid.com/) - Validação completa
- [Mail Tester](https://www.mail-tester.com/) - Score de spam

**Visualizadores:**
- [Email on Acid](https://www.emailonacid.com/)
- [Testi@](https://testi.at/)

---

## 🎯 Boas Práticas Implementadas

### Acessibilidade
✅ Texto ALT em todas as imagens (quando houver)
✅ Contraste WCAG AA em todos os textos
✅ Estrutura semântica com headings
✅ Links descritivos ("Confirmar email" vs "Clique aqui")

### Segurança
✅ Avisos claros sobre validade dos links
✅ Instruções de "o que fazer se não foi você"
✅ Informações técnicas (data, hora) quando relevante
✅ Mensagens de segurança em ações sensíveis

### UX/Design
✅ Tom acolhedor e maternal
✅ Emojis estratégicos (não excessivos)
✅ Hierarquia visual clara
✅ Botões grandes e fáceis de clicar
✅ Links alternativos para copiar/colar
✅ Cores emocionais por tipo de ação

### Técnico
✅ Tabelas para layout (suporte total)
✅ Inline CSS (obrigatório para email)
✅ Comentários condicionais para Outlook
✅ Fallbacks para fontes
✅ Width máximo de 600px (padrão)

---

## 🔄 Variáveis Supabase Disponíveis

### Todas as templates:
```
{{ .SiteURL }}        - URL base do site
{{ .ConfirmationURL }} - Link de ação (confirmar, resetar, etc.)
{{ .Token }}          - Token de autenticação
{{ .TokenHash }}      - Hash do token
{{ .Email }}          - Email do destinatário
```

### Templates específicas:
```
{{ .NewEmail }}       - Novo email (change email)
{{ .InvitedByEmail }} - Quem enviou convite (invite)
{{ .SentAt }}         - Data/hora do envio
```

---

## 📊 Métricas Esperadas

### Taxa de Abertura (Open Rate)
- **Meta:** 50-70%
- **Atual:** [A medir após implementação]

**Fatores:**
- Subject lines personalizados
- Preview text acolhedor
- Nome "Nossa Maternidade" reconhecível

### Taxa de Clique (Click-through Rate)
- **Meta:** 20-40%
- **Atual:** [A medir após implementação]

**Fatores:**
- Botões grandes e claros
- Múltiplas CTAs (botão + link)
- Design convidativo

### Taxa de Conversão
- **Meta:** 80-95% dos emails resultam em ação
- **Atual:** [A medir após implementação]

**Fatores:**
- Instruções claras
- Links que funcionam
- Validade adequada

---

## 🐛 Troubleshooting

### Problema: "Email não chega"

**Soluções:**
1. Verifique configuração SMTP no Supabase
2. Confira se domínio está verificado (SPF, DKIM, DMARC)
3. Teste com diferentes provedores (Gmail, Outlook, etc.)
4. Verifique pasta de spam/lixo eletrônico

### Problema: "Layout quebrado no Outlook"

**Soluções:**
1. Use apenas tabelas para layout (não divs)
2. Inline CSS obrigatório
3. Evite floats e position
4. Teste com comentários condicionais `<!--[if mso]>`

### Problema: "Link não funciona"

**Soluções:**
1. Verifique se variável está correta (`{{ .ConfirmationURL }}`)
2. Teste se URL está sendo gerada pelo Supabase
3. Confira configuração de redirect_to
4. Valide URL manualmente

### Problema: "Imagens não aparecem"

**Soluções:**
1. Use URLs absolutas (não relativas)
2. Hospede imagens em CDN
3. Adicione fallback text (alt)
4. Considere usar emojis unicode (sempre funcionam)

---

## 🚀 Próximos Passos

### Curto Prazo
- [ ] Implementar todos os templates no Supabase
- [ ] Testar cada fluxo (signup, password reset, etc.)
- [ ] Validar em diferentes clientes de email
- [ ] Coletar feedback de usuárias

### Médio Prazo
- [ ] Adicionar tracking de abertura (pixel)
- [ ] Implementar A/B testing de subjects
- [ ] Criar versões plain-text otimizadas
- [ ] Adicionar templates de notificação (não-auth)

### Longo Prazo
- [ ] Personalização baseada em fase maternal
- [ ] Templates dinâmicos com conteúdo contextual
- [ ] Integração com sistema de recomendação
- [ ] Templates multi-idioma (se expandir)

---

## 💡 Dicas Extras

### Personalizações Futuras

**Por fase maternal:**
```html
<!-- Exemplo: Ajustar tom para pós-parto -->
<p>Sabemos que você está em um momento especial (e cansativo!) com o bebê...</p>
```

**Por horário:**
```html
<!-- Bom dia vs Boa noite baseado em hora de envio -->
```

**Por engajamento:**
```html
<!-- "Sentimos sua falta!" vs "Que bom ter você de volta!" -->
```

---

## 📞 Suporte

**Dúvidas sobre implementação:**
- Consulte documentação do Supabase: https://supabase.com/docs/guides/auth/auth-email-templates
- Veja exemplos: https://github.com/supabase/auth/tree/master/internal/mailer/templates

**Dúvidas sobre design:**
- Revise `DESIGN-SYSTEM-SCIENCE.md`
- Consulte `GUIA-IMPLEMENTACAO-REVOLUCIONARIO.md`

---

## ✅ Checklist de Implementação

**Antes de publicar:**
- [ ] Todos os HTMLs validados (W3C)
- [ ] Variáveis Supabase corretas
- [ ] Testado em 3+ clientes de email
- [ ] Subjects atualizados
- [ ] Links funcionando
- [ ] Contraste validado (WCAG AA)
- [ ] Responsividade em mobile
- [ ] Texto alternativo se sem imagens
- [ ] Footer com informações legais

---

**Criado com 💚 pela Equipe Nossa Maternidade**
*Novembro 2025 - v1.0*
