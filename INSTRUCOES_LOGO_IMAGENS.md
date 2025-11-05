# 🎨 Instruções - Adicionar Logos/Ilustrações

## 📁 Arquivos Necessários

Adicione os seguintes arquivos de imagem no diretório `public/`:

### 1. `logo-avatar.png`
- **Descrição:** Ilustração de mulher sorrindo (avatar)
- **Uso:** Dashboard header, login, signup, cards de recursos
- **Tamanho recomendado:** 256x256px ou maior (PNG com transparência)

### 2. `logo-mother-baby.png`
- **Descrição:** Ilustração de mãe segurando bebê com decoração de berçário
- **Uso:** Landing page, login, signup, onboarding, cards de recursos
- **Tamanho recomendado:** 512x512px ou maior (PNG com transparência)

### 3. `logo-family.png`
- **Descrição:** Ilustração de mãe segurando bebê dormindo com cachorro pequeno
- **Uso:** Landing page, signup, onboarding, cards de recursos
- **Tamanho recomendado:** 512x512px ou maior (PNG com transparência)

---

## 📍 Onde as Imagens Foram Adicionadas

### ✅ **Landing Page** (`app/page.tsx`)
- Hero section: Ilustrações decorativas de fundo (opacidade 10%)
- Cards de recursos: Ilustrações pequenas nos cantos dos cards (opacidade 20%)

### ✅ **Login** (`app/login/page.tsx`)
- Ilustrações decorativas de fundo (opacidade 10%, visíveis em desktop)

### ✅ **Signup** (`app/signup/page.tsx`)
- Ilustrações decorativas de fundo (opacidade 10%, visíveis em desktop)

### ✅ **Dashboard** (`app/dashboard/page.tsx`)
- Header: Avatar da mulher sorrindo ao lado do nome (visível em desktop)

### ✅ **Onboarding** (`app/onboarding/page.tsx`)
- Ilustrações decorativas de fundo (opacidade 10%, visíveis em desktop)

---

## 🎯 Características Técnicas

### **Opacidade e Visibilidade**
- **Fundo decorativo:** `opacity-10` (10% de opacidade)
- **Cards:** `opacity-20` (20% de opacidade)
- **Header dashboard:** `opacity-80` (80% de opacidade)
- **Mobile:** Ilustrações de fundo ocultas (`hidden md:block`) para melhor performance

### **Tamanhos Implementados**
- **Hero landing:** 256x256px (fundo) e 192x192px (fundo)
- **Cards recursos:** 96x96px
- **Login/Signup:** 192-224px (fundo)
- **Dashboard header:** 64x64px
- **Onboarding:** 144-160px (fundo)

---

## 📝 Próximos Passos

1. **Adicionar arquivos de imagem** no diretório `public/`:
   ```
   public/
   ├── logo-avatar.png
   ├── logo-mother-baby.png
   └── logo-family.png
   ```

2. **Verificar se as imagens estão visíveis:**
   - Abrir landing page
   - Abrir login/signup
   - Abrir dashboard
   - Abrir onboarding

3. **Testar responsividade:**
   - Desktop: Ilustrações de fundo visíveis
   - Mobile: Ilustrações de fundo ocultas (melhor performance)

---

## ✅ Checklist

- [ ] Adicionar `logo-avatar.png` em `public/`
- [ ] Adicionar `logo-mother-baby.png` em `public/`
- [ ] Adicionar `logo-family.png` em `public/`
- [ ] Testar landing page
- [ ] Testar login
- [ ] Testar signup
- [ ] Testar dashboard
- [ ] Testar onboarding
- [ ] Verificar responsividade mobile

---

**Nota:** As imagens devem ser otimizadas para web (PNG com transparência, compressão adequada) para garantir boa performance.

