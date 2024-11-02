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

fastify.post<{ Params: { numberId: string } }>('/:numberId', async function handler (request, reply) {
  const { numberId } = request.params

  console.log('')
  console.info('ROUTER • Request received:', JSON.stringify(request.body, null, 2))
  console.log('')

  if (!request.body) {
    return reply.status(200).send({ message: 'Empty body' })
  }

  if ((request.body as any).event === 'webhook-test-event') {
    return reply.status(200).send({ message: 'Webhook test event received' })
  }

  if ((request.body as any).statuses) {
    return reply.status(200)
  }

  const entryPayload: any = (request.body as any).entry;
  const contacts: any = (request.body as any).contacts;
  const messages: any = (request.body as any).messages;

  if ((!entryPayload || !entryPayload[0]?.changes[0]?.value?.contacts) && (!contacts || !messages)) {
    console.warn('No contacts or entry found [maybe On Premise account/request]')

    reply.status(404).send({ message: 'No contacts found' })

    return
  }

  const evolutionPayload = setEvolutionPayload(numberId, entryPayload, contacts, messages)

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

// DEPRECATED
// fastify.post('/', async function handler (request, reply) {
//   console.log('')
//   console.info('ROUTER • Request received:', JSON.stringify(request.body, null, 2))
//   console.log('')

//   if (!request.body) {
//     return reply.status(200).send({ message: 'Empty body' })
//   }

//   if ((request.body as any).event === 'webhook-test-event') {
//     return reply.status(200).send({ message: 'Webhook test event received' })
//   }

//   if ((request.body as any).statuses) {
//     return reply.status(200)
//   }

//   const entryPayload: any = (request.body as any).entry;
//   const contacts: any = (request.body as any).contacts;
//   const messages: any = (request.body as any).messages;

//   if ((!entryPayload || !entryPayload[0]?.changes[0]?.value?.contacts) && (!contacts || !messages)) {
//     console.warn('No contacts or entry found [maybe On Premise account/request]')

//     reply.status(404).send({ message: 'No contacts found' })

//     return
//   }

//   const evolutionPayload = setEvolutionPayload(entryPayload, contacts, messages)

//   if (!evolutionPayload) {
//     console.log('')
//     console.warn('ROUTER • Could not process request')
//     console.warn(JSON.stringify(request.body, null, 2))
//     console.log('')

//     reply.status(404).send({ message: 'No contacts or messages found' })

//     return
//   }

//   await sendToEvolutionApi(evolutionPayload)

//   reply.status(200).send({ message: 'Message received' })

//   return
// })

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
