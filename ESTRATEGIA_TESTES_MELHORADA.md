# 🎯 Estratégia de Teste Melhorada - Nossa Maternidade

## ✅ Análise da Estratégia

**Pontos Fortes:**
- ✅ Estrutura clara por fases e prioridades
- ✅ Cobre todos os aspectos críticos (PWA, Mobile-First, Performance, Acessibilidade)
- ✅ Métricas de sucesso bem definidas
- ✅ Ordem lógica de execução
- ✅ Foco em mobile-first desde o início

**Melhorias Sugeridas:**
- 🔧 Adicionar scripts de execução automatizados
- 🔧 Detalhar passos manuais específicos
- 🔧 Criar checklist executável
- 🔧 Adicionar troubleshooting para falhas comuns

## 📋 Estratégia Completa com Execução

### Fase 1: Fundação Mobile-First (15 min - CRÍTICO)

#### 1.1 Setup e Performance Baseline

**Passos Automatizados:**
```bash
# Executar testes de performance
npm run test:performance
```

**Passos Manuais:**
1. Abrir Chrome DevTools (F12)
2. Ir em **Lighthouse** → Selecionar "Mobile" → "Performance"
3. Configurar **Network throttling**: DevTools → Network → Throttling → "Slow 3G"
4. Executar Lighthouse e verificar:
   - LCP < 2.5s
   - FID < 100ms
   - CLS < 0.1
   - Performance Score > 90

**Teste de Viewport Mobile:**
- DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
- Selecionar "iPhone SE" (375x667)
- Verificar layout não quebra

**Teste de Touch Targets:**
- DevTools → Elements → Selecionar elemento
- Verificar no Computed: `width >= 44px` e `height >= 44px`
- Usar DevTools → Console: `document.querySelector('button').getBoundingClientRect()`

**Script de Verificação:**
```javascript
// Cole no Console do DevTools
document.querySelectorAll('button, a, [role="button"]').forEach(el => {
  const box = el.getBoundingClientRect();
  if (box.width < 44 || box.height < 44) {
    console.warn('Touch target muito pequeno:', el, box);
  }
});
```

#### 1.2 PWA Installation Flow

**Passos Automatizados:**
```bash
# Executar testes de PWA
npm run test:pwa
```

**Passos Manuais:**
1. Abrir Chrome DevTools → **Application** → **Manifest**
2. Verificar:
   - ✅ Name, short_name presentes
   - ✅ Icons (192x192 e 512x512) presentes
   - ✅ Display: "standalone"
   - ✅ Start URL: "/"

3. **Testar Instalação:**
   - Abrir app no Chrome mobile
   - Aguardar 5 segundos
   - Verificar prompt de instalação aparece
   - Clicar em "Instalar"
   - Verificar app aparece na home screen

4. **Testar Modo Standalone:**
   - Abrir app instalado
   - Verificar não tem barra de endereço
   - Verificar está em modo standalone

5. **Testar Shortcuts:**
   - DevTools → Application → Manifest → Shortcuts
   - Verificar shortcuts presentes
   - Clicar longo no ícone do app → Verificar shortcuts aparecem

6. **Verificar Ícones:**
   - DevTools → Application → Manifest → Icons
   - Verificar todos os tamanhos presentes
   - Verificar ícones carregam corretamente

#### 1.3 Service Worker

**Passos Automatizados:**
```bash
# Executar testes de Service Worker
npm run test:pwa
```

**Passos Manuais:**
1. DevTools → **Application** → **Service Workers**
2. Verificar:
   - ✅ Service Worker registrado
   - ✅ Status: "activated and is running"
   - ✅ Scope: "/"

3. **Testar Cache Strategy:**
   - DevTools → Application → Cache Storage
   - Verificar caches presentes:
     - `nossa-maternidade-v1` (precache)
     - `runtime-cache` (runtime)

4. **Testar Precache:**
   - Verificar arquivos em precache:
     - `/`
     - `/manifest.json`
     - `/icons/icon-192x192.png`
     - `/icons/icon-512x512.png`

5. **Testar Atualização de SW:**
   - Modificar `public/sw.js`
   - Recarregar página (Ctrl+Shift+R)
   - Verificar novo SW ativa
   - Verificar caches antigos limpados

### Fase 2: Fluxo Crítico do Usuário (20 min - PRIORIDADE)

#### 2.1 Autenticação Mobile-First

**Passos Automatizados:**
```bash
# Executar testes de autenticação
npm run test:e2e e2e/browser-auth.spec.ts
```

**Passos Manuais:**
1. Abrir app em mobile (375px viewport)
2. Navegar para `/login`
3. **Testar Campos Touch:**
   - Verificar altura mínima de 44px
   - Testar com dedo (não cursor)
   - Verificar fácil de clicar

4. **Testar Validação em Tempo Real:**
   - Digitar email inválido → Verificar erro aparece
   - Digitar senha curta → Verificar erro aparece
   - Corrigir → Verificar erro desaparece

5. **Testar Feedback Visual:**
   - Preencher form incorretamente → Verificar mensagens de erro claras
   - Preencher form corretamente → Verificar feedback de sucesso
   - Verificar cores de erro/sucesso visíveis

6. **Testar Login:**
   - Preencher credenciais válidas
   - Clicar em "Entrar"
   - Verificar redirect para `/dashboard`

#### 2.2 Onboarding

**Passos Manuais:**
1. Navegar para `/onboarding`
2. **Testar Navegação:**
   - Avançar para próximo step
   - Voltar para step anterior
   - Verificar botão voltar funciona em todos os steps

3. **Testar Validação:**
   - Tentar avançar sem preencher campos obrigatórios
   - Verificar mensagens de erro

4. **Testar Salvamento:**
   - Preencher dados
   - Fechar app
   - Reabrir app
   - Verificar dados salvos

5. **Testar Skip:**
   - Clicar em "Pular" ou "Cancelar"
   - Verificar comportamento correto

#### 2.3 Dashboard - Primeira Impressão

**Passos Manuais:**
1. Abrir `/dashboard` em mobile
2. **Medir LCP:**
   - DevTools → Performance → Gravar
   - Recarregar página
   - Parar gravação
   - Verificar LCP < 2.5s

3. **Verificar Cards Responsivos:**
   - Verificar cards em mobile (1 coluna)
   - Mudar para tablet (768px) → Verificar 2 colunas
   - Mudar para desktop (1920px) → Verificar 3+ colunas

4. **Testar Bottom Navigation:**
   - Verificar sempre visível
   - Verificar touch targets ≥ 44px
   - Clicar em cada item → Verificar navegação funciona

5. **Verificar Gamificação Widget:**
   - Verificar carrega corretamente
   - Verificar animações funcionam
   - Verificar não bloqueia conteúdo

6. **Testar Navegação Rápida:**
   - Navegar entre seções rapidamente
   - Verificar transições suaves
   - Verificar não há lag

### Fase 3: Features Core com IA (25 min - IMPORTANTE)

#### 3.1 Chat (NathAI)

**Passos Automatizados:**
```bash
# Executar testes de chat
npm run test:e2e e2e/mobile-first-pwa.spec.ts --grep "Chat"
```

**Passos Manuais:**
1. Abrir `/chat`
2. **Testar Envio:**
   - Digitar mensagem
   - Clicar em "Enviar"
   - Verificar mensagem aparece

3. **Medir Tempo de Resposta:**
   - DevTools → Network → Filtrar por "chat" ou "api"
   - Enviar mensagem
   - Verificar TTFB < 1s

4. **Testar Streaming:**
   - Enviar mensagem
   - Verificar resposta aparece progressivamente (streaming)
   - Verificar não espera resposta completa

5. **Testar Contexto:**
   - Enviar mensagem 1
   - Enviar mensagem 2 referenciando mensagem 1
   - Verificar IA entende contexto

6. **Verificar Limite de Histórico:**
   - Enviar 15+ mensagens
   - Verificar apenas últimas 8-10 mantidas
   - Verificar performance não degrada

7. **Testar Timeout:**
   - Simular rede lenta (DevTools → Network → Throttling → "Slow 3G")
   - Enviar mensagem
   - Verificar timeout após 20s
   - Verificar mensagem de erro clara

8. **Verificar Respostas Concisas:**
   - Enviar perguntas variadas
   - Verificar respostas são concisas (2-3 parágrafos)
   - Verificar não há respostas muito longas

#### 3.2 Receitas com IA

**Passos Manuais:**
1. Abrir `/receitas`
2. **Testar Geração:**
   - Clicar em "Gerar Receita"
   - Verificar receita gerada
   - Verificar receita faz sentido

3. **Testar Personalização:**
   - Selecionar humor diferente
   - Gerar receita
   - Verificar receita adaptada ao humor

4. **Testar Filtros:**
   - Aplicar filtro "Vegetariana"
   - Gerar receita
   - Verificar receita é vegetariana
   - Repetir com outros filtros

5. **Testar Salvamento:**
   - Gerar receita
   - Clicar em "Salvar"
   - Verificar receita salva
   - Verificar aparece em "Receitas Salvas"

#### 3.3 Rotina Semanal

**Passos Automatizados:**
```bash
# Executar testes de rotina
npm run test:e2e e2e/rotina-mobile-first.spec.ts
```

**Passos Manuais:**
1. Abrir `/rotina`
2. **Verificar Categorias Responsivas:**
   - Mobile (375px): 2 colunas
   - Tablet (768px): 4 colunas
   - Desktop (1920px): 4+ colunas

3. **Testar Botões de Categoria:**
   - Clicar em cada categoria
   - Verificar atividades filtradas
   - Verificar feedback visual

4. **Testar Day Selector:**
   - Verificar scroll horizontal funciona
   - Clicar em cada dia
   - Verificar atividades do dia aparecem

5. **Testar Filtros:**
   - Aplicar filtro por categoria
   - Verificar atividades filtradas
   - Remover filtro
   - Verificar todas atividades aparecem

6. **Verificar Seção de Dicas:**
   - Verificar dicas mobile-first
   - Verificar texto legível
   - Verificar não há overflow

### Fase 4: Features Secundárias (15 min - DESEJÁVEL)

#### 4.1 Mundo Nath

**Passos Manuais:**
1. Abrir `/mundo-nath`
2. **Verificar Grid Responsivo:**
   - Mobile: 1 coluna
   - Tablet: 2 colunas
   - Desktop: 3+ colunas

3. **Testar Busca:**
   - Digitar termo de busca
   - Verificar resultados filtrados
   - Limpar busca
   - Verificar todos vídeos aparecem

4. **Testar Filtros:**
   - Filtrar por "TikTok"
   - Verificar apenas vídeos TikTok aparecem
   - Filtrar por "Instagram"
   - Verificar apenas vídeos Instagram aparecem

5. **Testar Clicar em Vídeo:**
   - Clicar em vídeo
   - Verificar abre URL específica (não perfil)
   - Verificar URL é de vídeo específico

6. **Verificar Miniaturas:**
   - Verificar miniaturas carregam (Unsplash)
   - Verificar imagens otimizadas
   - Verificar lazy loading funciona

7. **Testar Modal:**
   - Clicar em vídeo
   - Verificar modal abre
   - Verificar botão "Assistir" funciona
   - Fechar modal
   - Verificar volta para lista

#### 4.2 Autocuidado

**Passos Manuais:**
1. Abrir `/autocuidado`
2. **Testar Botão "Agendar":**
   - Clicar em "Agendar"
   - Verificar Web Share API funciona OU copia para clipboard
   - Verificar feedback visual

3. **Testar Botão "Fazer Agora":**
   - Clicar em "Fazer Agora"
   - Verificar timer inicia
   - Verificar contagem regressiva funciona
   - Verificar timer para corretamente

4. **Testar Filtros:**
   - Filtrar por categoria
   - Verificar sugestões filtradas
   - Verificar favoritas funciona

5. **Testar Favoritar:**
   - Clicar em favoritar
   - Verificar item marcado como favorito
   - Filtrar por favoritas
   - Verificar item aparece

#### 4.3 Histórias de Sono

**Passos Manuais:**
1. Abrir `/historias-sono`
2. **Testar Player de Áudio:**
   - Clicar em "Reproduzir"
   - Verificar Web Speech API funciona
   - Verificar áudio reproduz

3. **Testar Controles:**
   - Pausar
   - Retomar
   - Parar
   - Verificar todos funcionam

4. **Testar Velocidade:**
   - Ajustar velocidade
   - Verificar reprodução ajustada

5. **Testar Volume:**
   - Ajustar volume
   - Verificar volume ajustado

### Fase 5: PWA Avançado (10 min - ESSENCIAL)

#### 5.1 Offline Functionality

**Passos Automatizados:**
```bash
# Executar testes offline
npm run test:e2e e2e/mobile-first-pwa.spec.ts --grep "Offline"
```

**Passos Manuais:**
1. Abrir app
2. Aguardar carregar completamente
3. **Desconectar Internet:**
   - DevTools → Network → Throttling → "Offline"
   - OU: Desligar Wi-Fi/Dados

4. **Verificar Página Carrega do Cache:**
   - Recarregar página
   - Verificar página carrega do cache
   - Verificar não há erro de rede

5. **Testar Navegação Offline:**
   - Navegar entre páginas
   - Verificar páginas em cache carregam
   - Verificar páginas não em cache mostram página offline

6. **Verificar Página Offline Customizada:**
   - Navegar para página não em cache
   - Verificar página offline customizada aparece
   - Verificar mensagem clara

7. **Reconectar e Verificar Sync:**
   - Reconectar internet
   - Verificar dados sincronizam
   - Verificar não há perda de dados

#### 5.2 Background Sync (se implementado)

**Passos Manuais:**
1. Desconectar internet
2. Fazer ação que requer internet (ex: enviar mensagem)
3. Reconectar internet
4. Verificar ação sincroniza automaticamente

#### 5.3 Performance em Condições Reais

**Passos Manuais:**
1. **Testar em 3G Throttling:**
   - DevTools → Network → Throttling → "Fast 3G"
   - Recarregar página
   - Medir LCP, FID, CLS
   - Verificar ainda dentro dos limites

2. **Medir em Condições Ruins:**
   - Throttling → "Slow 3G"
   - Recarregar página
   - Verificar métricas ainda aceitáveis

3. **Verificar Lazy Loading:**
   - DevTools → Network
   - Scroll página
   - Verificar imagens carregam sob demanda

4. **Testar Code Splitting:**
   - DevTools → Network → Filtrar por "JS"
   - Recarregar página
   - Navegar para outra página
   - Verificar apenas JS necessário carrega

### Fase 6: Acessibilidade e UX (10 min - OBRIGATÓRIO)

#### 6.1 Acessibilidade Mobile

**Passos Manuais:**
1. **Testar com Screen Reader:**
   - Android: Ativar TalkBack
   - iOS: Ativar VoiceOver
   - Navegar pelo app
   - Verificar elementos são anunciados corretamente

2. **Verificar Contraste:**
   - DevTools → Lighthouse → Acessibilidade
   - Executar auditoria
   - Verificar contraste WCAG AA
   - OU: Usar ferramenta online (WebAIM Contrast Checker)

3. **Testar Navegação por Teclado:**
   - Conectar teclado (ou usar DevTools)
   - Navegar com Tab
   - Verificar foco visível
   - Verificar ordem lógica

4. **Verificar ARIA Labels:**
   - DevTools → Elements
   - Verificar elementos interativos têm aria-label
   - Verificar formulários têm labels associados

5. **Testar Zoom 200%:**
   - DevTools → Toggle Device Toolbar
   - Zoom 200%
   - Verificar layout não quebra
   - Verificar conteúdo acessível

#### 6.2 UX Mobile-First

**Passos Manuais:**
1. **Verificar Safe Areas:**
   - Abrir em iPhone com notch
   - Verificar conteúdo não cortado pelo notch
   - Verificar bottom navigation não cortado pela barra

2. **Testar Bottom Navigation:**
   - Verificar não sobrepõe conteúdo
   - Verificar sempre acessível
   - Verificar não interfere com scroll

3. **Verificar Scroll Suave:**
   - Scroll página
   - Verificar animação suave (60fps)
   - DevTools → Performance → Gravar scroll
   - Verificar FPS estável

4. **Testar Pull-to-Refresh:**
   - Se implementado, testar pull-to-refresh
   - Verificar funciona corretamente
   - Verificar feedback visual

### Fase 7: Edge Cases e Robustez (10 min - CRÍTICO)

#### 7.1 Error Handling

**Passos Manuais:**
1. **Testar API Offline:**
   - DevTools → Network → Throttling → "Offline"
   - Fazer ação que requer API
   - Verificar mensagem de erro clara
   - Verificar não quebra app

2. **Testar Timeout:**
   - Network → Throttling → "Slow 3G"
   - Fazer requisição que demora
   - Verificar timeout funciona
   - Verificar mensagem de erro clara

3. **Verificar Fallbacks:**
   - Simular erro de API
   - Verificar fallback funciona
   - Verificar app não quebra

#### 7.2 Navegação e Estado

**Passos Manuais:**
1. **Testar Botão Voltar:**
   - Navegar para todas as páginas
   - Verificar botão voltar presente
   - Testar botão voltar funciona

2. **Verificar Estado Mantido:**
   - Preencher formulário
   - Navegar para outra página
   - Voltar
   - Verificar dados mantidos (se aplicável)

3. **Testar Deep Links:**
   - Abrir deep link (ex: `/chat?message=hello`)
   - Verificar página carrega corretamente
   - Verificar parâmetros processados

4. **Verificar Histórico:**
   - Navegar múltiplas páginas
   - Usar botão voltar do navegador
   - Verificar navegação funciona

#### 7.3 Dados e Cache

**Passos Manuais:**
1. **Testar Limpeza de Cache:**
   - DevTools → Application → Clear Storage
   - Limpar cache
   - Recarregar página
   - Verificar app funciona

2. **Verificar Dados Não Se Perdem:**
   - Fazer ações importantes
   - Fechar app
   - Reabrir app
   - Verificar dados mantidos

3. **Testar Logout:**
   - Fazer logout
   - Verificar dados sensíveis limpos
   - Verificar cache limpo
   - Verificar redireciona para login

## 📊 Métricas de Sucesso

### Performance (Core Web Vitals)
- ✅ LCP < 2.5s (mobile)
- ✅ FID < 100ms
- ✅ CLS < 0.1
- ✅ TTI < 3.5s

### PWA
- ✅ Service Worker registrado
- ✅ Instalação funciona
- ✅ Offline funciona
- ✅ Manifest válido

### Mobile-First
- ✅ Touch targets ≥ 44px
- ✅ Layout responsivo em 375px, 768px, 1920px
- ✅ Bottom nav sempre acessível
- ✅ Sem horizontal scroll

### Funcionalidade
- ✅ 100% das features core funcionam
- ✅ 0 erros críticos no console
- ✅ Navegação fluida entre páginas

## ✅ Checklist Final

- [ ] Performance: Core Web Vitals passando
- [ ] PWA: Instalação e offline funcionam
- [ ] Mobile-First: Layout perfeito em 375px
- [ ] Funcionalidade: Todas features core funcionam
- [ ] Acessibilidade: WCAG AA mínimo
- [ ] Robustez: Edge cases tratados
- [ ] UX: Feedback visual e navegação fluida

## 🚀 Ordem de Execução Recomendada

**Sessão 1 (30 min):** Fase 1 + Fase 2 (Fundação + Fluxo Crítico)
**Sessão 2 (30 min):** Fase 3 + Fase 4 (Features Core + Secundárias)
**Sessão 3 (20 min):** Fase 5 + Fase 6 + Fase 7 (PWA + Acessibilidade + Edge Cases)

## 🛠️ Ferramentas Necessárias

- Chrome DevTools (Lighthouse, Performance, Network)
- Playwright (testes automatizados já configurados)
- Screen Reader (TalkBack Android / VoiceOver iOS)
- Network Throttling (Slow 3G, Fast 3G)
- Device Emulation (iPhone SE, iPhone 12, iPad)
