# SeniorEase

Plataforma **Web + Mobile** focada em **acessibilidade para idosos**, com arquitetura limpa na aplicação web e fluxos simples no app.

## Estrutura do repositório

| Pasta    | Stack                                      |
|----------|--------------------------------------------|
| `web/`   | Next.js 15 (App Router), Tailwind, Zustand |
| `mobile/`| Expo (React Native), Expo Router, Zustand, AsyncStorage |


## Arquitetura (web)

A pasta `web/src` segue **Clean Architecture** em camadas:

- **`domain/`** — Entidades (`AccessibilityPreferences`, `Task`) e contratos de repositório.
- **`application/`** — Casos de uso (carregar/salvar preferências, CRUD lógico de tarefas).
- **`infrastructure/`** — Implementações com `localStorage`.
- **`presentation/`** — Componentes React, store Zustand que orquestra os casos de uso, páginas em `app/`.

Fluxo típico: a UI chama ações na store → a store invoca casos de uso → os casos de uso usam repositórios → a infraestrutura persiste dados.

**Login (web):** rota `/login` com autenticação **simulada** (sem servidor). O estado `isAuthenticated` / `user` fica em Zustand com **`persist`** na chave `seniorease_auth_v1`. Os ajustes de tamanho e contraste na página de login reutilizam as mesmas preferências globais já guardadas em `seniorease_accessibility_v1`.

## Parte técnicas

- **Estado global (web):** Zustand, com leitura do `localStorage`.
- **Persistência (web):** `localStorage` com chaves versionadas (`seniorease_*_v1`).
- **Persistência (mobile):** AsyncStorage com a mesma ideia de chaves.
- **Acessibilidade (web):** Variáveis CSS para tamanho de fonte e espaçamento; `data-contrast`, `data-theme`, `data-interface`;
 `aria-*` em diálogos e toasts; botões grandes.

- **Mobile:**: StyleSheet replicando tamanhos e contraste da aplicação web feita com Tailwind.

**Web:**: Tailwind.

- **Testes (web):** Vitest + Testing Library; exemplo de teste de caso de uso (`create-task`) e de componente (`BigButton`).

## Como executar o projeto

### Web

```bash
cd web
npm install
npm run dev
```

Abrir URL http://localhost:3000 no navegador.

```bash
npm run test
npm run build
```

### Mobile

```bash
cd mobile
npm install
npx start
```

**Abrir no celular:**
O **Expo SDK 55** exige **`expo-router` ~55** (junto com `expo-linking` e `expo-constants` ~55). Se estiver `expo-router` 4.x com `expo` 55, aparece erro tipo `expo-router/internal/routing` — as versões têm de bater com o `bundledNativeModules` do SDK.


**Abrir Web:** 

Abrir URL `http://localhost:8081/` no navegador

## Funcionalidades implementadas

- **Painel de personalização:** fonte, contraste, espaçamento, modo básico/avançado, tema claro/escuro, feedback reforçado, confirmação de ações (web); no mobile, subconjunto equivalente com switches e botões grandes.
- **Organizador de atividades:** criar, editar, concluir, histórico, lembrete por data/hora (web), fluxo guiado passo a passo e TTS opcional (navegador) no modo avançado.
- **Perfil:** resumo de preferências e contagens de tarefas.
- **Modo assistido:** onboarding na home (web) com `localStorage` para não repetir.
