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

// Serve static js and css files
fastify.register(serve, {
  root: path.join(__dirname, 'dist'),
  prefix: '/dist/'
});

// Init Liquid
const engine = new Liquid({
  root: path.join(__dirname, "views"),
  extname: ".liquid",
})

fastify.register(view, {
  engine: {
    liquid: engine,
  },
});

// Index route
fastify.get('/', function (request, response) {
  response.view("/dist/index.liquid.html", {client_count: clients.length});
})

// SSE route 
fastify.get("/sse", sse);

// Run the server!
fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})