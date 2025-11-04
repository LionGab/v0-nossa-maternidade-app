# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - img "Nossa Maternidade" [ref=e6]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: Bem-vinda de volta
        - generic [ref=e10]: Entre com seu email e senha para continuar sua jornada
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]:
            - generic [ref=e15]: Email
            - textbox "Email" [ref=e16]:
              - /placeholder: seu@email.com
          - generic [ref=e17]:
            - generic [ref=e18]:
              - generic [ref=e19]: Senha
              - link "Esqueceu?" [ref=e20] [cursor=pointer]:
                - /url: /forgot-password
            - textbox "Senha" [ref=e21]
          - button "Entrar" [ref=e22]
        - generic [ref=e23]:
          - text: Ainda não tem conta?
          - link "Criar conta gratuita" [ref=e24] [cursor=pointer]:
            - /url: /signup
  - button "Open Next.js Dev Tools" [ref=e30] [cursor=pointer]:
    - img [ref=e31]
  - alert [ref=e34]
```