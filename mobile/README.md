# 📱 Nossa Maternidade - Aplicativo Mobile

Aplicativo mobile-first para iOS e Android desenvolvido com React Native e Expo.

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 20+ e npm 10+
- Expo CLI (instalado globalmente ou via npx)
- Para iOS: Xcode (apenas no macOS)
- Para Android: Android Studio

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Executar no iOS (requer macOS)
npm run ios

# Executar no Android
npm run android

# Executar no navegador (preview web)
npm run web
```

## 📱 Testando no Dispositivo

### Usando Expo Go

1. Instale o app Expo Go:
   - **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - **Android**: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Execute `npm start`

3. Escaneie o QR code:
   - **iOS**: Use a câmera do iPhone
   - **Android**: Use o app Expo Go

### Build de Produção

Para criar builds de produção para as lojas:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Configurar projeto
eas build:configure

# Build para Android (APK de teste)
npm run build:android

# Build para iOS (requer conta Apple Developer)
npm run build:ios

# Build para ambas plataformas
npm run build:all
```

## 📂 Estrutura do Projeto

```
mobile/
├── app/                    # Rotas do Expo Router
│   ├── (tabs)/            # Navegação por tabs
│   │   ├── index.tsx      # Home/Dashboard
│   │   ├── chat.tsx       # Chat com NathAI
│   │   ├── diary.tsx      # Diário Digital
│   │   └── profile.tsx    # Perfil/Configurações
│   ├── _layout.tsx        # Layout raiz
│   └── index.tsx          # Tela de boas-vindas
├── assets/                # Imagens, fontes, ícones
├── components/            # Componentes reutilizáveis
├── constants/             # Constantes e configurações
├── hooks/                 # Custom hooks
├── app.json              # Configuração do Expo
├── eas.json              # Configuração de build (EAS)
└── package.json          # Dependências
```

## 🎨 Features Implementadas

- ✅ **Design Mobile-First**: Interface otimizada para smartphones
- ✅ **Navegação por Tabs**: Acesso rápido às principais funcionalidades
- ✅ **Tema Personalizado**: Cores suaves e acolhedoras
- ✅ **Responsivo**: Adaptável a diferentes tamanhos de tela
- ✅ **TypeScript**: Tipagem completa para maior segurança
- ✅ **Expo Router**: Navegação baseada em arquivos

### Telas

1. **Boas-Vindas**: Apresentação do app com botão para começar
2. **Home/Dashboard**: Visão geral com acesso rápido
3. **Chat**: Conversa com assistente virtual NathAI
4. **Diário**: Registro de sentimentos e reflexões
5. **Perfil**: Configurações e informações da usuária

## 🔧 Configuração

### iOS

As permissões necessárias já estão configuradas no `app.json`:
- Câmera
- Galeria de Fotos
- Microfone

### Android

As permissões necessárias já estão configuradas no `app.json`:
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- RECORD_AUDIO

## 📦 Build e Deploy

### Android

#### APK de Teste (Desenvolvimento/Preview)
```bash
eas build --platform android --profile preview
```

#### AAB para Play Store (Produção)
```bash
eas build --platform android --profile production
```

#### Publicar na Play Store
```bash
eas submit --platform android
```

### iOS

#### Build para TestFlight
```bash
eas build --platform ios --profile production
```

#### Publicar na App Store
```bash
eas submit --platform ios
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar em modo watch
npm run test:watch
```

## 📝 Próximos Passos

1. **Integração com Backend**
   - Conectar com Supabase
   - Implementar autenticação
   - Sincronizar dados do diário

2. **Features Adicionais**
   - Push notifications
   - Compartilhamento social
   - Modo offline completo
   - Integração com calendário

3. **Melhorias de UX**
   - Animações suaves
   - Feedback háptico
   - Modo escuro
   - Acessibilidade

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 💡 Suporte

Para dúvidas ou problemas:
- 📧 Email: suporte@nossamaternidade.com.br
- 📱 WhatsApp: (00) 00000-0000
- 🌐 Site: https://nossamaternidade.com.br

---

**Desenvolvido com ❤️ para mães brasileiras**
