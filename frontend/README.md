# VetDose

Projeto front-end de um guia farmacológico veterinário para apoio à rotina clínica, com foco em rapidez de consulta, organização visual e experiência de uso limpa para profissionais da área.

## Visão geral

O VetDose é uma interface web desenvolvida em React com Vite, pensada para apresentar um catálogo de medicamentos, facilitar buscas por nome ou princípio ativo e oferecer uma base visual para futuras funcionalidades como:

- busca rápida de medicamentos;
- lista de favoritos;
- histórico de cálculos ou consultas;
- suporte para consultas clínicas e decisões de dose;
- uma experiência mais organizada e acessível para uso em ambiente veterinário.

> Este projeto está em fase de protótipo/front-end e foi desenvolvido como estudo e demonstração de interface.

## Stack tecnológica

- React
- Vite
- JavaScript
- CSS
- Oxlint

## Funcionalidades

- header de navegação com ações rápidas;
- search box para medicamentos ou princípios ativos;
- identidade visual voltada ao contexto veterinário;
- área de destaque para medicamentos em destaque;
- layout responsivo e moderno.

## Estrutura do projeto

```bash
.
├── index.html
├── package.json
├── README.md
├── vite.config.js
├── public/
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── assets/
│   └── components/
│       └── Header.jsx
└──
```

## Como executar

Pré-requisitos:

- Node.js 18+;
- npm ou outro gerenciador de pacotes compatível.

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/guia-farmacologico.git
cd guia-farmacologico
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

4. Acesse a aplicação no navegador no endereço informado pelo Vite, normalmente:

```bash
http://localhost:5173
```

## Build de produção

Para gerar a versão otimizada para produção:

```bash
npm run build
```

A build será gerada na pasta `dist`.

## Verificação de qualidade

Para rodar o lint do projeto:

```bash
npm run lint
```

## Status do projeto

- Status: protótipo em desenvolvimento
- Foco atual: interface e experiência do usuário
- Próximos passos: integrar dados reais, buscar medicamentos, implementar filtros e cálculos de dose

## Licença

Este projeto foi desenvolvido para fins acadêmicos e de estudo.

## Autor

Projeto desenvolvido como parte da disciplina de Programação Avançada.
