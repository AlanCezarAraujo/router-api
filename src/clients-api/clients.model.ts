import { FastifyInstance } from "fastify";
import { log } from "../services/logger.service";
import { ObjectId } from "@fastify/mongodb";

export interface IClient {
    id?: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    whatsappNumber: string;
}

type Error = {
    error: string;
}

async function createClient(client: IClient, fastifyInstance: FastifyInstance) {
    log('Client received:', JSON.stringify(client, null, 2));

    const clientRecord = await fastifyInstance.mongo.db?.collection('clients').findOne({ phone: client.phone });

    if (clientRecord) {
        return null;
    }

    return await fastifyInstance.mongo.db?.collection('clients').insertOne(client);
}

async function updateClient(client: IClient, fastifyInstance: FastifyInstance) {
    log('Client received:', JSON.stringify(client, null, 2));

    const clientRecord = await fastifyInstance.mongo.db?.collection('clients').findOne({ id: client.id });

    if (!clientRecord) {
        return { error: 'Client not found' };
    }

    return await fastifyInstance.mongo.db?.collection('clients').updateOne({ id: client.id }, { $set: client });
}

async function getClientById(id: string, fastifyInstance: FastifyInstance) {
    return await fastifyInstance.mongo.db?.collection('clients').findOne(new ObjectId(id));
}

async function getClients(fastifyInstance: FastifyInstance) {
    return await fastifyInstance.mongo.db?.collection('clients').find().toArray();
}

export default {
    createClient,
    updateClient,
    getClientById,
    getClients,
}
