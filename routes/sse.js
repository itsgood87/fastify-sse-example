import { DateTime } from 'luxon';

/**
 * Store an array of the clients
 * @type {Array.{request: import('fastify').FastifyRequest, reply: import('fastify').FastifyReply}}
 */
export let clients = []

// When server starts up, generate the first 50 points randomly (between -5 and 15)
let prevPoints = [...new Array(50)].map((e, index) => {return {x: DateTime.now().plus({seconds: -index}).toMillis(), y: Math.random() * 20 - 5}}).reverse();

function generateDataPoint(){
  // Get the average of the previous points
  const avg = prevPoints.reduce((acc,v) => acc + v.y, 0) / prevPoints.length;

  // Generate a random number between -6 and +6
  const rand = Math.random() * 12 - 6;

  // Sum them
  const sum = avg + rand;
  const point = {x: new Date().valueOf(), y: sum};


  // Remove first data point and push this to end
  prevPoints.shift();
  prevPoints.push(point);

  // Return the point with the timestamp
  return {x: new Date().valueOf(), y: sum};
}

setInterval(() => {
  // Generate a new data point
  const point = generateDataPoint();

  // Send to all clients
  for(const client of clients){
    client.reply.raw.write(`event:data\ndata: ${JSON.stringify(point)}\n\n`)
  }
}, 1000);

/**
 * Send an update to all clients with the client count
 */
function sendClientCount(){
  // Send an update on client count to all clients
  for(const client of clients){
    client.reply.raw.write(`event:clients\ndata: ${clients.length}\n\n`)
  }
}

/**
 * Add a client
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} reply 
 */
function addClient(request, reply){
  // Push into client array
  clients.push({request, reply});

  // Register a close listener
  request.socket.on('close', () => removeClient(request));

  // Send the client count to all clients
  sendClientCount();

  // Send the intial data to this client
  reply.raw.write(`event:initial_data\ndata:${JSON.stringify(prevPoints)}\n\n`);
}

/**
 * Remove a client
 * @param {import('fastify').FastifyRequest} request 
 */
function removeClient(request){
  // Remove from client list
  clients = clients.filter(c => c.request != request);

  // Send the client count to all clients
  sendClientCount();
}



/**
 * The SSE endpoint handler
 * @param {import('fastify').FastifyRequest} request 
 * @param {import('fastify').FastifyReply} reply 
 */
export function sse(request, reply){
  // Set appropriate headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  };

  // Write the headers
  reply.raw.writeHead(200, headers);
  
  // Tell the client to retry every 10 seconds if connectivity is lost
  reply.raw.write('retry: 10000\n\n');

  // Store the client
  addClient(request, reply);
}