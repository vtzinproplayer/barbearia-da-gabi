# Barbearia da Gabi

Website e sistema de marcações da Barbearia da Gabi (Porto). Inclui uma
homepage editorial com animações, login por nome de utilizador e palavra-passe,
marcação de horários para clientes e um painel privado para a Gabi gerir a
agenda.

## Como correr

```sh
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # dist/client + dist/barbearia_da_gabi/index.js
```

O projeto usa Vite, React 19, Tailwind CSS 4 e um Worker Cloudflare (Hono) com
D1. O servidor de desenvolvimento já cria uma base D1 local e aplica o esquema
automaticamente no primeiro pedido.

## Contas

A conta da dona é criada automaticamente na primeira execução:

- **Nome de utilizador:** `gabi`
- **Palavra-passe:** `barbearia2026`

Altere a palavra-passe imediatamente em **Painel → Segurança**. Também pode
definir `OWNER_USERNAME` e `OWNER_PASSWORD` no ambiente do Worker antes da
primeira execução (`.dev.vars` em desenvolvimento ou secret em produção); esses
valores só são usados quando ainda não existe nenhuma conta de dona.

Os clientes criam a própria conta na página **Entrar → Criar conta**. O login
pede apenas nome de utilizador e palavra-passe.

Neste ambiente local ficaram também duas contas de demonstração para testar o
painel: `cliente` / `cliente123` e `marta.alves` / `marta123`, com três
marcações de exemplo. Apague `.wrangler/state` para começar com uma base vazia.

## O que está implementado

- **Homepage** com hero animado, menu de serviços, história, galeria com
  lightbox, testemunhos em carrossel, FAQ e chamada final.
- **Login/registo** com sessão em cookie `HttpOnly`, palavras-passe protegidas
  com PBKDF2-SHA256 (120 000 iterações) e mensagens de erro genéricas.
- **Marcação em 3 passos:** serviço, data/hora e confirmação. A disponibilidade
  tem em conta a duração de cada serviço, os horários ocupados e o fecho às
  19:30. Não é possível sobrepor marcações.
- **Área do cliente:** próxima visita, histórico, cancelamento e novo
  agendamento.
- **Painel da Gabi:** estatísticas, filtros por dia e estado, pesquisa,
  confirmação/conclusão/cancelamento de marcações, notas do cliente e alteração
  de palavra-passe.
- **Segurança:** todas as mutações validam a origem, as consultas do painel
  exigem a conta de dona e os pedidos de API não são colocados em cache.

## Estrutura

```text
src/
  content.ts              textos, contactos, testemunhos e imagens
  shared/services.ts      serviços, preços, duração e horário (site + Worker)
  worker/index.ts         API Hono, sessões, D1 e regras de marcação
  lib/                    cliente de API, autenticação, rotas e formatação
  components/             botões, logo, campos, modais, nav, footer
  sections/               homepage, login, marcação, conta e painel
  styles.css              paleta vinho/ouro, tipografia e animações
```

## Personalizar

- **Serviços e preços:** editar `src/shared/services.ts`. O site, o formulário
  e as validações do servidor atualizam-se em conjunto.
- **Textos, contactos e imagens:** editar `src/content.ts`.
- **Cores e tipografia:** os tokens estão no início de `src/styles.css`.
- **Horário:** a barbearia abre de terça a sábado, das 09:00 às 19:30. As
  constantes `OPEN_WEEKDAYS`, `OPENING_MINUTES` e `CLOSING_MINUTES` ficam em
  `src/shared/services.ts`.

## Dados

Em desenvolvimento, o D1 local guarda os dados em `.wrangler/state`. Para voltar
a uma base vazia, pare o servidor, apague essa pasta e volte a arrancar. Em
produção, o Worker espera um binding D1 chamado `DB`; o deploy via Freebuff
Sites pode criá-lo com `sites_add_storage`. O `deploy.json` já aponta para o
build do Worker e para `dist/client`.

Nota: o schema é criado automaticamente (`CREATE TABLE IF NOT EXISTS`), por isso
não há migrações manuais a executar neste momento.
