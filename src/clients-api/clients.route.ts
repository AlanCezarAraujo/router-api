import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import ClientModel, { IClient } from "./clients.model";
import { log } from "../services/logger.service";

export async function createClientRoute(request: FastifyRequest, response: FastifyReply, fastifyInstance: FastifyInstance) {
    const client: IClient = request.body as IClient;

    log('Client received:', JSON.stringify(client, null, 2));

    const clientRecord = await ClientModel.createClient(client, fastifyInstance);

    if (!clientRecord) {
        log('Client already exists:', JSON.stringify(client, null, 2));

        response.status(400).send({ message: 'Client already exists' });

        return;
    }

    log('Client inserted:', JSON.stringify(clientRecord, null, 2));

    response.status(200).send(clientRecord);
}

export async function updateClientRoute(request: FastifyRequest, response: FastifyReply, fastifyInstance: FastifyInstance) {
    const client: IClient = request.body as IClient;
    
    log('Client received:', JSON.stringify(client, null, 2));

    const clientRecord = await fastifyInstance.mongo.db?.collection('clients').findOne({ id: client.id });

    if (!clientRecord) {
        log('Client not found:', JSON.stringify(client, null, 2));

        response.status(404).send({ message: 'Client not found' });

        return;
    }

    const updated = await fastifyInstance.mongo.db?.collection('clients').updateOne({ id: client.id }, { $set: client });

    log('Client updated:', JSON.stringify(updated, null, 2));

    response.status(200).send(updated);
}

export async function getClientByIdRoute(request: FastifyRequest, response: FastifyReply, fastifyInstance: FastifyInstance) {
    const { id } = request.params as any;

    log('Client id received', JSON.stringify(id, null, 2));

    const client = await ClientModel.getClientById(id, fastifyInstance);

    if (!client) {
        log('Client not found', JSON.stringify(id, null, 2));

        response.status(404).send({ message: 'Client not found' });

        return;
    }

    log('Client found', JSON.stringify(client, null, 2));

    response.status(200).send(client);
}

export async function getClientsRoute(request: FastifyRequest, response: FastifyReply, fastifyInstance: FastifyInstance) {
    const clients = await ClientModel.getClients(fastifyInstance);

    log('Clients found', JSON.stringify(clients, null, 2));

    response.status(200).send(clients);
}

