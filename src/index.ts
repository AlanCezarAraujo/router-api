import Fastify from 'fastify'
import { sendToEvolutionApi } from './evolution-api/evolution.service'
import { IEvolutionPayload, MessageTypeEnum } from './evolution-api/evolution.model'
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
  } as IEvolutionPayload

  await sendToEvolutionApi(evolutionPayload)

  reply.status(200).send({ message: 'Message received' })

  return
})

fastify.post('/send-message', async function handler (request, reply) {
  console.log('')
  console.info('Request recebido no /send-message:', JSON.stringify(request.body, null, 2))
  console.log('')

  const { numberId, message } = request.body as IEvolutionPayload

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
