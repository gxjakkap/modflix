# ModFlix

Monorepo for ModFlix project, term project for CPE241.

## Project Structure

- [api](apps/api): Backend Server. Built with [Elysia](https://elysiajs.com/at-glance.html).
- [web](apps/web): Frontend Application. Built with [React](https://react.dev/reference/react), [Vite](https://vite.dev/guide/), [React Router](https://reactrouter.com/home), [TailwindCSS](https://tailwindcss.com/docs/styling-with-utility-classes).
- [db](packages/db): Database ORM Package. Define DB schema with [Drizzle ORM](https://orm.drizzle.team/docs/overview) and also re-export the ORM itself.
- [auth](packages/auth): Auth package with [Better-Auth](https://better-auth.com/docs/introduction)
- [api-types](packages/api-types): API Types Re-export for [Eden Treaty](https://elysiajs.com/eden/overview.html#eden-treaty-recommended)
- [biome-config](packages/biome-config): Config for [Biome](https://biomejs.dev/guides/getting-started/)

## Developing

### Installing recommended extensions

This project use [Biome](https://biomejs.dev/) as its linter and formatter. Please install its companion extension for your editor.

#### VSCode

Install [Official Biome Extension for VSCode here](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

### Installing Bun

This project encourage the use of [Bun](https://bun.com/docs) as runtime and package manager.

#### macOS / Linux

```sh
curl -fsSL https://bun.com/install | bash # linux user might need to install unzip package
```

### Windows

Open Powershell and paste

```sh
irm bun.sh/install.ps1 | iex
```

### Installing Docker

This project use [Docker](https://docs.docker.com/get-started/docker-overview/) to run its development database.

You can download and setup Docker Desktop with this [guide](https://docs.docker.com/get-started/introduction/get-docker-desktop/)

### Installing Dependencies

To install dependencies, run

```sh
bun install
```

### Setting up Environment Variable

Running below commands and edit `.env` file.

```sh
cp .env.example .env
```

### Running Locally

To run development environment, Run below commands.

```sh
docker compose -f compose-db.yml up -d # linux user might need to sudo this command
bun run dev
```

## Disclaimer

Contrary to your believe, this README is entirely written by human, not AI.
