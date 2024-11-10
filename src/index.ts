import Fastify from 'fastify'
import * as Minio from 'minio'
import { sendMediaToEvolutionApi, sendToEvolutionApi, setEvolutionPayload } from './evolution-api/evolution.service'
import { IEvolutionPayload, MessageTypeEnum } from './evolution-api/evolution.model'
import {
  downloadCloudMedia,
  // downloadMediaOnPremise,
  sendMessageTo360Dialog,
} from './360-dialog/360dialog.service'

const fastify = Fastify({
  logger: true
})

const minioClient = new Minio.Client({
  endPoint: 's3.i4ai.com.br',
  useSSL: true,
  accessKey: '1IS4rz3JGlBV0uuQYfAb',
  secretKey: 'YLVI6tBIrF5pVukAnOpxhe8eysb84UAk4VuMFMgB',
});

async function uploadToMinIO(bucketName: string, objectName: string, buffer: Buffer, mediaType: string) {
  try {
    const bucketExists = await minioClient.bucketExists('router');

    if (!bucketExists) {
      await minioClient.makeBucket('router', 'us-east-1');
    }

    await minioClient.putObject('router', bucketName + '-' + objectName, buffer, buffer.length, {
      'Content-Type': mediaType,
    });

    console.log('')
    console.log('ROUTER • Arquivo salvo no MinIO:', 'router' + '/' + bucketName + '-' + objectName);
    console.log('')

    return objectName;
  } catch (error) {
    console.log('')
    console.error('ROUTER • Erro ao salvar arquivo no MinIO:', error);
    console.log('')
  }
}

fastify.get('/', async function handler (request, reply) {
  return 'i4 Router API'
})

fastify.post<{ Params: { numberId: string } }>('/:numberId', async function handler (request, reply) {
  const { numberId } = request.params

  console.log('')
  console.info('ROUTER • Request recebido:', JSON.stringify(request.body, null, 2))
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

  // if (messages && messages[0]?.image) {
  //   // TODO: Pegar token do MongoDB
  //   const buffer = await downloadMediaOnPremise(messages[0].image.id, 'pCKdN6pxsJsJKnaAf9n3NXmVAK');

  //   await uploadToMinIO(messages[0].from, messages[0].image.id, buffer, messages[0].image.mime_type);

  //   const fileURL = await minioClient.presignedUrl('GET', 'router', messages[0].from + '-' + messages[0].image.id) // `https://s3.i4ai.com.br/${messages[0].from}/${messages[0].image.id}`;

  //   await sendMediaToEvolutionApi({
  //     numberId,
  //     key: {
  //       remoteJid: messages[0].from,
  //       fromMe: false,
  //       id: messages[0].id,
  //     },
  //     pushName: messages[0].from,
  //     token: '39882bc13b5e520f417cf8acf7c2c4a2001', // 'BB270D0E17D7-4A17-AF19-534639FD982A',
  //     message: {
  //       mediaType: 'image',
  //       media: fileURL,
  //     },
  //     messageType: MessageTypeEnum.ImageMessage,
  //   });

  //   return reply.status(200).send({ message: 'Imagem recebida' })
  // }

  if (entryPayload && entryPayload[0]?.changes[0]?.value?.messages[0]?.image) {
    const imageID = entryPayload[0]?.changes[0]?.value?.messages[0]?.image.id
    const mimeType = entryPayload[0]?.changes[0]?.value?.messages[0]?.image.mime_type
    const from = entryPayload[0]?.changes[0]?.value?.messages[0]?.from
    const remoteJid = entryPayload[0]?.changes[0]?.value?.contacts[0]?.wa_id
    const pushName = entryPayload[0].changes[0].value.contacts[0].profile.name

    // TODO: Pegar token do MongoDB
    const { url } = await downloadCloudMedia(imageID, 'pCKdN6pxsJsJKnaAf9n3NXmVAK') as any;

    await sendMediaToEvolutionApi({
      numberId,
      key: {
        remoteJid,
        fromMe: false,
        id: entryPayload[0].id,
      },
      pushName,
      token: '39882bc13b5e520f417cf8acf7c2c4a2001', // 'BB270D0E17D7-4A17-AF19-534639FD982A',
      message: {
        mediaType: 'image',
        media: 'http://minio.i4ai.com.br/api/v1/download-shared-object/aHR0cHM6Ly9zMy5pNGFpLmNvbS5ici9yb3V0ZXIvNTUxMTk4NDM3OTkwNi0wN2UzM2UwZS0zYjdjLTRkYmEtOGU3ZS00M2I2ZGNmMTkxYWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1YVkRIWDdISklBSjBLUUdCOTBZMiUyRjIwMjQxMTEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTExMFQyMzEzMTJaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUpZVmtSSVdEZElTa2xCU2pCTFVVZENPVEJaTWlJc0ltVjRjQ0k2TVRjek1UTXlNelV4Tml3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuaTBDWDdLRmZveEJpaUxiNy1JOVFiYnFGZXVld3Z4eXRhcXIyd3NfTnM2ajhqcVJMV1oxbE1FSlFRNXVFMTY1bXpMT3hXRWhvaTBxWUVuTkxXcDZPbWcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT0zNGJmMmI3OGY0NGFiYTAyMDgyMGU4OWQzMjA2MDM5MmQ1ZTA5OWEwNTQ0ZmYxZjI2MGQ1ZDViODlmNzQ0MTlk' //url,
      },
      messageType: MessageTypeEnum.ImageMessage,
    });

    return reply.status(200).send({ message: 'Imagem recebida' })
  }

  // if (messages && messages[0]?.audio) {
  //   // TODO: Pegar token do MongoDB
  //   const buffer = await downloadMediaOnPremise(messages[0].audio.id, 'pCKdN6pxsJsJKnaAf9n3NXmVAK');

  //   await uploadToMinIO(messages[0].from, messages[0].audio.id, buffer, messages[0].audio.mime_type);

  //   const fileURL = await minioClient.presignedUrl('GET', 'router', messages[0].from + '-' + messages[0].audio.id) // `https://s3.i4ai.com.br/${messages[0].from}/${messages[0].audio.id}`;

  //   await sendMediaToEvolutionApi({
  //     numberId,
  //     mediatype: messages[0].audio.mime_type,
  //     media: fileURL,
  //     token: '39882bc13b5e520f417cf8acf7c2c4a2001', // 'BB270D0E17D7-4A17-AF19-534639FD982A',
  //     messageType: MessageTypeEnum.AudioMessage,
  //   });

  //   debugger

  //   return reply.status(200).send({ message: 'Audio recebido' })
  // }

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

fastify.post('/send-message', async function handler (request, reply) {
  console.log('')
  console.info('ROUTER • Request recebido no /send-message:', JSON.stringify(request.body, null, 2))
  console.log('')

  debugger

  const { data } = request.body as any
  const { key, message } = data as IEvolutionPayload
  const numberId = key.remoteJid.split('@')[0]
  let response = null

  try {
    response = await sendMessageTo360Dialog(numberId, message.conversation)
    response = await response.json()

    console.log('')
    console.info('ROUTER • Resposta da 360Dialog:', JSON.stringify(response, null, 2))
    console.log('')
  } catch (error) {
    console.error('ROUTER • Error sending message to 360Dialog:', error)

    reply.status(500).send({ message: 'Error sending message to 360Dialog' })

    return
  }

  console.log('')
  console.info('ROUTER • Mensagem enviada pela 360Dialog:', JSON.stringify(data, null, 2))
  console.log('')

  reply.status(200).send({ message: 'Message sent' })

  return
})

fastify.listen({ port: 3000, host: '0.0.0.0' })
  .then((address) => console.log(`server listening on ${address}`))
  .catch((err) => {
    console.error('Error starting server:', err)
    process.exit(1)
  })
