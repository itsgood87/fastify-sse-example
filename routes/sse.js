
/**
 * Store an array of the clients
 * @type {Array.{request: import('fastify').FastifyRequest, reply: import('fastify').FastifyReply}}
 */
export let clients = []

let lastFive = [10.0, 11.5, 9.6, 6.7, 8.8];

function generateDataPoint(){
  // Get the average of the last five data points
  const avg = lastFive.reduce((a,b) => a + b, 0) / lastFive.length;

  // Generate a random number between -3 and +3
  const rand = Math.random() * 6 - 3;

  // Sum them
  const sum = avg + rand;

  // Remove first data point and push this to end
  lastFive.shift();
  lastFive.push(sum);

  return sum;
}

setInterval(() => {
  // Generate a new data point
  const value = generateDataPoint();

  // Send to all clients
  for(const client of clients){
    client.reply.raw.write(`type: message\ndata: ${JSON.stringify({event: "data", value: value})}\n\n`)
  }
}, 1000);

/**
 * Send an update to all clients with the client count
 */
function sendClientCount(){
  // Send an update on client count to all clients
  for(const client of clients){
    client.reply.raw.write(`type: message\ndata: ${JSON.stringify({event: "clients", value: clients.length})}\n\n`)
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