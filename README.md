<h3 align="center">
<img alt="dev" width="300px" src="./.github/bioparkLogo.png" />
</h3>
<h2 align="center">
  Template para Módulos do GDI
</h2>

## 🚀 Sobre

GDI (Gestor de Dados Integrados) é um software para centralização dos dados de todos os setores mapeados do Biopark. Com ele é possível gerenciar todas as interações e relações que uma pessoa/empresa teve e/ou tem com o Biopark.

Esse é um template para a criação de novos módulos do GDI.

## 💻 Principais Tecnologias e Bibliotecas

- React 18.2 - (Biblioteca para construção de interfaces de usuário)
- Typescript 4.6 - (Linguagem de programação/Superconjunto tipagens Javascript)
- PrimeReact 8.6 - (Biblioteca de componentes de interface para React)
- Eslint 8.24 - (Ferramenta de análise de código)
- Prettier 2.7 - (Code Formatter)
- Vite 3.1
- Docker
- Docker Compose 3.9

## Possíveis Erros

### Frontend

**Problemas com build em produção**

Pode ser que a transpilação do typescript para javascript falhe. Uma das formas de corrigir é tirar o `tsc` do comando build. Não é o ideal, mas resolve temporariamente.
