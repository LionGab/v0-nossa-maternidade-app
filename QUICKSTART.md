# 🚀 INÍCIO RÁPIDO - Nossa Maternidade

## ⚡ Teste o App Mobile AGORA (2 minutos)

### Método 1: No seu celular (MAIS FÁCIL) 📱

1. **Instale o Expo Go** no seu celular:
   - 🍎 iPhone: https://apps.apple.com/app/expo-go/id982107779
   - 🤖 Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **No seu computador**, execute:
   ```bash
   ./setup-mobile.sh
   ```
   
3. **Escaneie o QR code** que aparecer:
   - iPhone: Use a câmera nativa
   - Android: Abra o Expo Go e toque em "Scan QR Code"

✅ **Pronto!** O app abrirá no seu celular em segundos.

### Método 2: Navegador Web (Preview rápido) 🌐

```bash
cd mobile
npm install
npm run web
```

Abrirá automaticamente em `http://localhost:8081`

---

## 📱 Sobre o Projeto

**Nossa Maternidade** é um aplicativo completo para apoio emocional e prático às mães, disponível em **duas versões**:

### 🌐 Versão Web (Next.js)
- Progressive Web App (PWA)
- Deploy no Netlify
- Acesso via navegador

### 📱 Versão Mobile (React Native + Expo)
- Apps nativos para **iOS** e **Android**
- 4 telas completas implementadas
- Pronto para App Store e Play Store

---

## 🎯 Telas Implementadas

1. **🏠 Boas-Vindas** - Apresentação do app
2. **📊 Dashboard** - Estatísticas e acesso rápido
3. **💬 Chat NathAI** - Assistente virtual empática
4. **📝 Diário** - Registro de sentimentos
5. **👤 Perfil** - Configurações da usuária

---

## 📚 Documentação

- **[README Principal](./README.md)** - Visão geral completa
- **[Guia de Build Mobile](./MOBILE_BUILD_GUIDE.md)** - Build e deploy detalhado
- **[Checklist Mobile](./MOBILE_CHECKLIST.md)** - Status e validações
- **[CI/CD Mobile](./MOBILE_CI_CD.md)** - Automação via GitHub Actions

---

## 🛠️ Comandos Úteis

```bash
# Setup inicial completo
./setup-mobile.sh

# Testar no celular (Expo Go)
cd mobile && npm start

# Testar no navegador
cd mobile && npm run web

# Build Android (APK)
cd mobile && eas build --platform android --profile preview

# Build iOS
cd mobile && eas build --platform ios --profile production
```

---

## 🔧 Tecnologias

- **React Native 0.76** - Framework mobile
- **Expo 52** - Ferramentas e build
- **TypeScript** - Tipagem segura
- **Expo Router** - Navegação moderna
- **Next.js 16** - Versão web

---

## ✅ Status

- ✅ **App Mobile**: 100% funcional para testes
- ✅ **4 Telas**: Implementadas e responsivas
- ✅ **iOS/Android**: Totalmente compatível
- ✅ **Documentação**: Completa em português
- ✅ **CI/CD**: Workflows configurados

---

## 🎯 Próximos Passos

1. ✅ **Testar agora** - Use Expo Go
2. 📸 **Assets** - Criar ícones profissionais
3. 🔌 **Backend** - Integrar com Supabase
4. 🏪 **Deploy** - Publicar nas lojas

---

## 💡 Precisa de Ajuda?

- 📖 Leia o [MOBILE_BUILD_GUIDE.md](./MOBILE_BUILD_GUIDE.md)
- 🔍 Veja o [MOBILE_CHECKLIST.md](./MOBILE_CHECKLIST.md)
- 💬 Abra uma issue no GitHub

---

**Desenvolvido com ❤️ para mães brasileiras**

🚀 **Comece agora**: `./setup-mobile.sh`
