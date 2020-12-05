# shakespearian-pokemon

## Getting started

### Local Development

- Installation: `npm i`
- Start: `npm start`
- Tests: `npm test` or `npm run test:watch`

### Docker

`docker-compose up`

## Areas of improvement

- Create a docker image for local development. With such an image, the developer doesn't need to install any dependencies or setting up anything. On top of that, the environment can be made as close as possible as the production one.
- Add hot reloading for the server. With nodemon or any other similar library, the server can be restarted every time there's a change.
- Errors from the different adapters could be model better. Since this is a trivial exercise, I modeled the errors with a simple ApiError type, but the adapters can have their own errors, independent from the external errors we send to the clients.
