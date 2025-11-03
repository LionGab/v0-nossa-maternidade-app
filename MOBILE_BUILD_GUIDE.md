# 📱 GUIA COMPLETO DE BUILD E DEPLOY MOBILE

## 🎯 Visão Geral

Este guia contém instruções detalhadas para build e deploy do aplicativo **Nossa Maternidade** para iOS e Android.

---

## 📋 Pré-requisitos

### Ferramentas Necessárias

#### Para Todos (Obrigatório)
- ✅ Node.js 20+
- ✅ npm 10+
- ✅ Conta no Expo (gratuita): https://expo.dev

#### Para iOS (Opcional - apenas se quiser testar localmente)
- 🍎 macOS com Xcode instalado
- 🍎 Conta Apple Developer (USD $99/ano para publicar na App Store)

#### Para Android (Opcional - apenas se quiser testar localmente)
- 🤖 Android Studio
- 🤖 Emulador Android ou dispositivo físico

---

## 🚀 MÉTODO 1: Testar no Celular (MAIS RÁPIDO)

### Passo 1: Instalar Expo Go no seu celular

- **iPhone**: https://apps.apple.com/app/expo-go/id982107779
- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

### Passo 2: Iniciar o servidor

```bash
cd mobile
npm install
npm start
```

### Passo 3: Escanear QR Code

- **iPhone**: Abra a câmera e aponte para o QR code na tela
- **Android**: Abra o app Expo Go e toque em "Scan QR Code"

✅ **Pronto!** O app abrirá no seu celular e você verá as mudanças em tempo real.

---

## 🏗️ MÉTODO 2: Build de Produção (Apps Independentes)

### Configuração Inicial

#### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

#### 2. Fazer Login no Expo

```bash
eas login
```

Use seu email e senha do Expo (crie conta em expo.dev se necessário)

#### 3. Configurar Projeto

```bash
cd mobile
eas build:configure
```

Isso criará/atualizará o arquivo `eas.json` com as configurações de build.

---

## 🤖 BUILD PARA ANDROID

### APK de Teste (Para Distribuição Interna)

```bash
npm run build:android
# ou
eas build --platform android --profile preview
```

**O que acontece:**
- ✅ Build na nuvem (EAS)
- ✅ Gera arquivo APK
- ✅ Pode instalar diretamente no celular
- ✅ Não precisa de conta Google Developer

**Tempo estimado:** 10-15 minutos

**Download:** O link do APK aparecerá no terminal e no seu dashboard do Expo

### AAB para Play Store (Produção)

```bash
npm run build:production:android
# ou
eas build --platform android --profile production
```

**O que acontece:**
- ✅ Gera Android App Bundle (AAB)
- ✅ Formato otimizado para Play Store
- ⚠️ Requer conta Google Play Developer (USD $25 taxa única)

---

## 🍎 BUILD PARA iOS

### Build para TestFlight/App Store

```bash
npm run build:ios
# ou
eas build --platform ios --profile production
```

**Requisitos:**
- ⚠️ Conta Apple Developer (USD $99/ano)
- ⚠️ Certificados e provisioning profiles (EAS gerencia automaticamente)

**Tempo estimado:** 15-20 minutos

---

## 📤 PUBLICAR NAS LOJAS

### Google Play Store

#### 1. Criar Conta Google Play Developer
- Acesse: https://play.google.com/console
- Taxa única: USD $25
- Preencha informações da empresa/desenvolvedor

#### 2. Criar Novo App
- No console, clique em "Criar app"
- Preencha nome, idioma, tipo de app
- Aceite os termos

#### 3. Upload do AAB

```bash
eas submit --platform android
```

Ou manualmente:
1. Vá em "Produção" > "Criar nova versão"
2. Faça upload do arquivo AAB
3. Preencha descrições, screenshots, ícone
4. Envie para revisão

**Tempo de aprovação:** 1-3 dias (geralmente < 24h)

### Apple App Store

#### 1. Criar Conta Apple Developer
- Acesse: https://developer.apple.com
- Custo: USD $99/ano
- Verificação pode levar alguns dias

#### 2. Criar App no App Store Connect
- Acesse: https://appstoreconnect.apple.com
- Clique em "My Apps" > "+"
- Preencha informações do app

#### 3. Upload do Build

```bash
eas submit --platform ios
```

Ou via Xcode/Transporter

#### 4. Enviar para Revisão
- Preencha todas as informações requeridas
- Screenshots (obrigatório para cada tamanho de tela)
- Descrição, palavras-chave, categoria
- Informações de privacidade
- Clique em "Submit for Review"

**Tempo de aprovação:** 1-3 dias (pode ser mais rápido)

---

## 🔄 WORKFLOW RECOMENDADO

### Desenvolvimento

```bash
# 1. Testar localmente com Expo Go
npm start

# 2. Testar em dispositivo real
# Escanear QR code com Expo Go
```

### Teste Beta

```bash
# 3. Criar build de teste (Android)
eas build --platform android --profile preview

# 4. Distribuir APK para testadores
# Download do link gerado e compartilhar
```

### Produção

```bash
# 5. Build de produção
eas build --platform all --profile production

# 6. Publicar nas lojas
eas submit --platform all
```

---

## 🎨 ASSETS NECESSÁRIOS

### Ícones do App

Já configurados em `mobile/assets/`:
- `icon.png` (1024x1024) - Ícone principal
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `favicon.png` (48x48) - Web favicon

### Splash Screen

- `splash.png` (1242x2436) - Tela de carregamento

### Screenshots para as Lojas

**iOS (necessário):**
- iPhone 6.7" (1290x2796)
- iPhone 6.5" (1242x2688)
- iPhone 5.5" (1242x2208)
- iPad Pro 12.9" (2048x2732)

**Android (necessário):**
- Phone (1080x1920)
- 7" Tablet (1200x1920)
- 10" Tablet (1600x2560)

---

## 🐛 Troubleshooting

### Erro: "Expo account not found"
```bash
eas logout
eas login
```

### Erro: "Build failed"
- Verifique os logs no dashboard do Expo
- Comum: dependências incompatíveis ou versões erradas

### Erro de Certificado iOS
- EAS gerencia automaticamente
- Se persistir: `eas credentials`

### App não abre no Expo Go
- Certifique-se de estar na mesma rede Wi-Fi
- Tente com conexão via tunnel: `expo start --tunnel`

---

## 📊 Monitoramento e Analytics

### Expo Dashboard
- Acesse: https://expo.dev
- Veja builds, downloads, crashes

### Implementar Analytics (Próximos Passos)
- Google Analytics for Firebase
- Amplitude
- Mixpanel

---

## 🔐 Segurança

### Variáveis de Ambiente

Para variáveis sensíveis, use Expo Secrets:

```bash
eas secret:create --scope project --name API_KEY --value "seu-valor-secreto"
```

### Proteção de API Keys

No código, use:
```typescript
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.apiKey;
```

Configure em `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiKey": "sua-chave-aqui"
    }
  }
}
```

---

## ✅ CHECKLIST FINAL PRÉ-LANÇAMENTO

### Técnico
- [ ] Testado em iOS (iPhone físico ou simulador)
- [ ] Testado em Android (dispositivo físico ou emulador)
- [ ] Testado em diferentes tamanhos de tela
- [ ] Testado com internet lenta/offline
- [ ] Sem erros no console
- [ ] Performance otimizada (< 2s para primeira tela)

### Conteúdo
- [ ] Todos os textos revisados (sem typos)
- [ ] Imagens e ícones em alta qualidade
- [ ] Cores e estilos consistentes
- [ ] Acessibilidade testada

### Lojas
- [ ] Nome do app aprovado
- [ ] Descrição convincente e clara
- [ ] Screenshots atraentes e informativos
- [ ] Ícone de alta qualidade
- [ ] Categoria apropriada
- [ ] Classificação etária correta
- [ ] Política de privacidade publicada
- [ ] Termos de uso publicados

### Legal
- [ ] Política de privacidade (obrigatório)
- [ ] Termos de serviço
- [ ] Conformidade com LGPD (Brasil)
- [ ] Conformidade com GDPR (se aplicável)
- [ ] Conformidade com COPPA (se para crianças)

---

## 🎯 Próximos Passos Recomendados

1. **Configurar CI/CD**
   - Automatizar builds via GitHub Actions
   - Deploy automático quando fizer push

2. **Implementar Analytics**
   - Rastrear uso e comportamento dos usuários
   - Identificar problemas e oportunidades

3. **Sistema de Feedback**
   - Botão para reportar bugs
   - Avaliação dentro do app

4. **Updates Over-The-Air (OTA)**
   - Usar `expo-updates` para atualizações instantâneas
   - Não precisa republicar nas lojas para mudanças JS

5. **Push Notifications**
   - Lembretes diários
   - Notificações de novos conteúdos

---

## 📞 Suporte

**Documentação Oficial:**
- Expo: https://docs.expo.dev
- React Native: https://reactnative.dev
- EAS Build: https://docs.expo.dev/build/introduction

**Comunidade:**
- Expo Forums: https://forums.expo.dev
- Stack Overflow: tag `expo` ou `react-native`
- Discord Expo: https://chat.expo.dev

---

**Desenvolvido com ❤️ para mães brasileiras**
