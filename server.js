import Fastify from 'fastify'
import serve from '@fastify/static'
import view from '@fastify/view'
import {Liquid} from 'liquidjs'
import path from 'path'
import { sse, clients } from './routes/sse.js'

const __dirname = path.resolve(path.dirname(""))

const fastify = Fastify({
  logger: true
})


fastify.register(serve, {
  root: path.join(__dirname, 'dist'),
  prefix: '/dist/'
});

const engine = new Liquid({
  root: path.join(__dirname, "views"),
  extname: ".liquid",
})

fastify.register(view, {
  engine: {
    liquid: engine,
  },
});

// Declare a route
fastify.get('/', function (request, response) {
  response.view("./views/index.liquid", {client_count: clients.length});
})

// SSE route 
fastify.get("/sse", sse);

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})