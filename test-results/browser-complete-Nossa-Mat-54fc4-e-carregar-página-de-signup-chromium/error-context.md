# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - img "Nossa Maternidade" [ref=e6]
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: Criar conta
        - generic [ref=e10]: Comece sua jornada conosco
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]:
            - generic [ref=e15]: Nome completo
            - textbox "Nome completo" [ref=e16]:
              - /placeholder: Maria Silva
          - generic [ref=e17]:
            - generic [ref=e18]: Email
            - textbox "Email" [ref=e19]:
              - /placeholder: seu@email.com
          - generic [ref=e20]:
            - generic [ref=e21]: Senha
            - textbox "Senha" [ref=e22]
            - paragraph [ref=e23]: Mínimo de 6 caracteres
          - button "Criar conta" [ref=e24]
        - generic [ref=e25]:
          - text: Já tem uma conta?
          - link "Entrar" [ref=e26] [cursor=pointer]:
            - /url: /login
  - button "Open Next.js Dev Tools" [ref=e32] [cursor=pointer]:
    - img [ref=e33]
  - alert [ref=e36]
```