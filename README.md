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

1. Copy the sample environment file to a real local configuration file:
   ```powershell
   Copy-Item .env.example .env
   ```
2. Review the values in [.env](.env) if needed.

### Running the Application

#### Production (Main Branch)
To update to the main branch and run the production build:
```powershell
./scripts/run-update-main.sh
```
This will:
- Checkout the main branch
- Pull latest changes
- Build and start containers

#### Development (with pgAdmin4)
To run the development instance with pgAdmin4 for database management:
```powershell
./scripts/run-dev.sh
```
This uses [docker-compose.dev.yml](docker-compose.dev.yml) and provides:
- Frontend: http://localhost:80
- Backend API: http://localhost:8080
- pgAdmin4: http://localhost:5050 (admin@octopus.dev / admin)
