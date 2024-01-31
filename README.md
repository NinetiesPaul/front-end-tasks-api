## Task Manager - Frontend
A Front end application in ReactJS, meant to work in tandem with the Back End of the Tasks API projects made in PHP, Node, Python or Java Springboot

## Environment requirements
To run this application you must have installed on your environment:

- Node (v.14 or greater) and npm (v.6 or greater) (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

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
REACT_APP_SERVER_HOST=http://localhost:8080
```
- Run the application to consume the RESTful application (If the server is running, that is)
```
npm start
```
