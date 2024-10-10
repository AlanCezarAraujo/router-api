import Fastify from 'fastify'
import { sendToEvolutionApi } from './evolution-api/evolution.service'
import { MessageTypeEnum } from './evolution-api/evolution.model'

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

  if (!entryPayload[0].changes[0].value.contacts) {
    console.warn('No contacts found')

    reply.status(404).send({ message: 'No contacts found' })

    return
  }

  console.log('')
  console.info('Request received:', JSON.stringify(entryPayload, null, 2))
  console.log('')

  const evolutionPayload = {
    numberId: entryPayload[0].changes[0].value.metadata.display_phone_number,
    key: {
      remoteJid: entryPayload[0].changes[0].value.contacts[0].wa_id,
      fromMe: false,
      id: entryPayload.id,
    },
    pushName: entryPayload[0].changes[0].value.contacts[0].profile.name,
    message: {
        conversation: entryPayload[0].changes[0].value.messages[0].text.body,
    },
    messageType: MessageTypeEnum.Conversation,
  }

  await sendToEvolutionApi(evolutionPayload)

  reply.status(200).send({ message: 'Message received' })

  return
})

fastify.listen({ port: 3000 })
  .then((address) => console.log(`server listening on ${address}`))
  .catch((err) => {
    console.error('Error starting server:', err)
    process.exit(1)
  })
