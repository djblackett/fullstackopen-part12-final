# Todo app w/ Docker Compose

## Development
Use the following command to start the dev environment: 
`docker compose -f docker-compose.dev.yml up --build`  

Hot reload currently does not work without binding port 3000 of the frontend to the host.
This lets the websocket connection for the dev server through. This is tolerable for a dev environment.


## Production

Use the following command to start the production environment:
`docker compose up --build`


## Proxy
Both environments are accessed through http://localhost