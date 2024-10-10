import { IEvolutionPayload } from "./evolution.model";

export async function sendToEvolutionApi(evolutionPayload: IEvolutionPayload) {
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
