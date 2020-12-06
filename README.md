# shakespearian-pokemon

## Getting started

### Local Development

#### Installation

`npm i`

If you want to specify a different port than the default (3000), add an `.env` file to the root of the project with the `SERVER_PORT` variable, e.g:

```
SERVER_PORT=3000
```

#### Start

`npm start`

#### Tests

`npm test` or `npm run test:watch`

### Docker

`docker-compose up`

## Areas of improvement

- Create a docker image for local development. With such an image, the developer doesn't need to install any dependencies or setting up anything. On top of that, the environment can be made as close as possible to the production one.
- Add hot reloading for the server. With nodemon or any other similar library, the server can be restarted every time there's a change. While this is something really easy to do, I wasn't concern about it, since I used the tests to drive the development of the application.
- Errors from the different adapters could be modeled slightly better. Since this is a trivial exercise, I modeled the errors with a simple ApiError type to avoid converting them later. The adapters could have their own errors depending of the different error states, though I'm not sure how valuable in this scenario, since the APIs are quite simple and the user doesn't need to know a lot of the internal errors of the APIs.
- I couldn't find details on the Pokemon API types about nullability. Some of the fields might or might not exist, I had to adjust the schema to reflect that, but I can't guarantee I got all of the nullable fields. It would nice to investigate this in order to strengthening the schema.
