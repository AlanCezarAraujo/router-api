import { FastifyReply, FastifyRequest } from "fastify"
import { IEvolutionPayload } from "../evolution-api/evolution.model"
import { sendMessageTo360Dialog } from "../360-dialog/360dialog.service"
import evolutionService from "../evolution-api/evolution.service"
import { log } from "../services/logger.service"

export async function onCreateInstance(request: FastifyRequest, reply: FastifyReply) {
    const payload = request.body as IEvolutionPayload
  
    log('Request received on /create-instance:', JSON.stringify(payload, null, 2))
  
    await evolutionService.createInstance(payload)
  
    reply.status(200).send({ message: 'Instance created' })
  
    return

}

export async function onSendMessage(request: FastifyRequest, reply: FastifyReply) {
    log('Request recebido no /send-message:', JSON.stringify(request.body, null, 2))
  
    const { data } = request.body as any
    const { key, message } = data as IEvolutionPayload
    const numberId = key.remoteJid.split('@')[0]
  
    await sendMessageTo360Dialog(numberId, message.conversation)
  
    reply.status(200).send({ message: 'Message sent' })
  
    return
}
