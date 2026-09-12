## Task Manager - Frontend
A Front end application in ReactJS, meant to work in tandem with the Back End of the Tasks API projects made in PHP, Node, Python or Java Springboot

## Environment requirements
To run this application you must have installed on your environment:

- Node (v.14 or greater; **18 LTS recommended**) and npm (v.6 or greater) (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Docker builds use `node:18-alpine` to match Create React App 5 / `react-scripts@5.0.1`

## Installation and Configuration
After cloning this rep and cd into the project's folder. Run the following commands:
- Install all libraries and package.json scripts
```
npm install
```
- Create a local copy of the .env file
```
cp .env.dist .env
```
- Before running the application, set the host address on the .env file which is going to be used to serve the backend application. For example:
```
REACT_APP_SERVER_HOST={host}:{port} (eg. http://localhost:3000)
```
- Run the application to consume the RESTful application (If the server is running, that is)
```
npm start
```

## Docker
Requires Docker and Docker Compose.

1. Configure the backend API URL:
```
cp .env.dist .env
```
Edit `.env` if needed:
```
REACT_APP_SERVER_HOST=http://localhost:3000
FRONTEND_PORT=3005
PORT=3005
```

2. **Development (hot reload):**
```
docker compose --profile dev up frontend-dev --build
```
App at `http://localhost:3005`. Source changes under `src/` reload automatically.

3. **Production (nginx, static build — no hot reload):**
```
docker compose up frontend --build -d
```

Stop:
```
docker compose --profile dev down
# or
docker compose down
```
