# Fastify Server-Side Events Example

## [Live demo](https://fastify-sse.fly.dev/)

This project demonstrates how to set up a [Fastify](https://github.com/fastify/fastify) server that sends server-side events (SSE) to clients. Unlike websockets, this is a one-way connection. Data can only be sent from the server to clients.

There are two endpoints:

- **GET /**: Navigate here to connect to the server using the EventSource API. The page displays connection status, the number of connected clients, an updating chart showing the data sent from the server, and a list of recent data points. 
- **GET /sse**: Hit this endpoint to establish a long-term connection and receive events. The server generates random-ish data and sends it to clients once per second.

This project uses [Parcel](https://github.com/parcel-bundler/parcel) to bundle the front-end code, [LiquidJS](https://github.com/harttle/liquidjs) for templating, [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) for styling, and plain old javascript.

There's a `fly.toml` file and a Dockerfile used for deployment on [Fly](https://fly.io).
