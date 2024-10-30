import Fastify from 'fastify'
import mongodb from '@fastify/mongodb';
import { createWebhookRoute, handleMessageRoute, updateWebhookRoute } from './webhooks-api/webhooks.routes';
import { createClientRoute, getClientByIdRoute, getClientsRoute, updateClientRoute } from './clients-api/clients.route';
import { onCreateInstance, onSendMessage } from './evolution-api/evolution.routes';

const fastify = Fastify({
  logger: true
})

fastify.register(mongodb, {
  forceClose: true,
  url: 'mongodb://localhost:27017',
  database: 'i4-database'
})

fastify.get('/', async function handler (request, reply) {
  return 'i4 Router API'
})

// Webhook
fastify.post('/', handleMessageRoute)
fastify.post('/webhook', createWebhookRoute)
fastify.put('/webhook', updateWebhookRoute)

// Evolution
fastify.post('/create-instance', onCreateInstance)
fastify.post('/send-message', onSendMessage)

// Clients
fastify.post('/clients', (request, response) => createClientRoute(request, response, fastify))
fastify.put('/clients', (request, response) => updateClientRoute(request, response, fastify))
fastify.get('/clients/:id', (request, response) => getClientByIdRoute(request, response, fastify))
fastify.get('/clients', async (request, response) => getClientsRoute(request, response, fastify))

fastify.listen({ port: 3000, host: '0.0.0.0' })
  .then((address) => console.log(`server listening on ${address}`))
  .catch((err) => {
    console.error('Error starting server:', err)
    process.exit(1)
  })
