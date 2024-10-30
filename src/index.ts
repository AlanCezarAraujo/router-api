import Fastify from 'fastify'
import { sendToEvolutionApi, setEvolutionPayload } from './evolution-api/evolution.service'
import { IEvolutionPayload } from './evolution-api/evolution.model'
import { sendMessageTo360Dialog } from './360-dialog/360dialog.service'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async function handler (request, reply) {
  return 'i4 Router API'
})

fastify.post('/', async function handler (request, reply) {
  if ((request.body as any).event === 'webhook-test-event') {
    reply.status(200).send({ message: 'Webhook test event received' })

    return
  }

  const entryPayload: any = (request.body as any).entry;
  const contacts: any = (request.body as any).contacts;
  const messages: any = (request.body as any).messages;

  console.log('')
  console.info('ROUTER • Request received:', JSON.stringify(entryPayload, null, 2))
  console.log('')

  if (!entryPayload || !entryPayload[0]?.changes[0]?.value?.contacts) {
    console.warn('No contacts or entry found [maybe On Primise account/request]')

    reply.status(404).send({ message: 'No contacts found' })

    return
  }

  const evolutionPayload = setEvolutionPayload(entryPayload, contacts, messages)

  if (!evolutionPayload) {
    console.log('')
    console.warn('ROUTER • Could not process request')
    console.warn(JSON.stringify(request.body, null, 2))
    console.log('')

    reply.status(404).send({ message: 'No contacts or messages found' })

    return
  }

  await sendToEvolutionApi(evolutionPayload)

  reply.status(200).send({ message: 'Message received' })

  return
})

fastify.post('/send-message', async function handler (request, reply) {
  console.log('')
  console.info('ROUTER • Request recebido no /send-message:', JSON.stringify(request.body, null, 2))
  console.log('')

  const { data } = request.body as any
  const { key, message } = data as IEvolutionPayload
  const numberId = key.remoteJid.split('@')[0]

  await sendMessageTo360Dialog(numberId, message.conversation)

  reply.status(200).send({ message: 'Message sent' })

  return
})

fastify.listen({ port: 3000, host: '0.0.0.0' })
  .then((address) => console.log(`server listening on ${address}`))
  .catch((err) => {
    console.error('Error starting server:', err)
    process.exit(1)
  })
