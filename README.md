**Octopus, an online academic exercise practice tool**

The main goal of Octopus is to provide university students a precise and advanced tool for studying and testing their course knowledge.

Students will be able to solve multiple choice question quizes and mathematical exercises.

They will also be able to view their progress through a history of previous completed attempts including their scores and mistakes.

In order to encourage studious behaviour, aspects of 'gamefication' will be included in the likes of leaderboards, time trials and 1v1s between students based on time completed and score. 

The application and its development have been modeled around the department of Information and Electronic Engineering of the International Hellenic University, where I got my degree.
However it can also be applied to any other institution where content is available and applicable in the app.

Tech stack

Backend : Spring Boot, PostgreSQL, Docker

Frontend: React, Tailwind

The Octopus Team:

Kopsidas(corpora1984): Backend development and architecture design

Retsilas(rets5820): Frontend development and UX engineer

Tsiftelidis(mastertsif): QA and content creation


With help by:

Thomas(bonuschromosome): Hosting and launch

Helper team from IEE IHU Discord for ideas and further content creation


## Quick start

Create a `.env` file in the project root with the required application and Docker configuration values.

For local access over plain HTTP, set `AUTH_REFRESH_COOKIE_SECURE=false` so the browser can accept the refresh cookie.

### Production setup (recommended)

The production setup is recommended for local testing because it more closely simulates the production environment. Only Nginx is exposed on port `80`; the backend, database, and pgAdmin ports are internal to Docker.

Before starting, create a `.htpasswd` file in the project root for pgAdmin's additional Nginx login. On Debian/Ubuntu:

```bash
sudo apt-get install apache2-utils
htpasswd -c .htpasswd your_username
```

The command prompts for a password. Keep `.htpasswd` out of version control. Set `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` in `.env` for the separate pgAdmin login.

Start the application using [docker-compose.yml](docker-compose.yml):

```bash
docker compose up -d --build
```

- Frontend: http://localhost
- Backend API: http://localhost/api/ (API endpoints use `/api/v1`)
- pgAdmin: http://localhost/pgadmin/ — sign in with the Nginx credentials first, then the pgAdmin credentials from `.env`.

### Development setup

Start the application using [docker-compose.dev.yml](docker-compose.dev.yml):

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Development exposes the service ports directly:

- Frontend: http://localhost:80
- Backend API: http://localhost:8080/api/v1
- pgAdmin: http://localhost:5050 (email: `admin@octopus.dev`, password: `admin`)
- PostgreSQL: `localhost:5432` (credentials from `.env`)

Stop the running setup before switching between production and development, since both use port `80`.
