import { IEvolutionPayload } from "@/evolution-api/evolution.model";

const evolutionDomain = process.env.EVOLUTION_API_DOMAIN || 'https://api.netip.com.br';

async function sendToEvolutionApi(evolutionPayload: IEvolutionPayload) {
    const response = await fetch('https://api.netip.com.br/webhook/evolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evolutionPayload),
    })
    
    const data = await response.json();

    return data;
}

async function createInstance(payload: IEvolutionPayload) {
    const response = await fetch(evolutionDomain + '/instance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    
    const data = await response.json();

    return data;
}

export default {
    sendToEvolutionApi,
    createInstance,
}
