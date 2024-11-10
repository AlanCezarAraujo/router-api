export async function sendMessageTo360Dialog(phoneNumber: string, message: string) {
    return fetch('https://waba.360dialog.io/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          // TODO: Pegar a API Key de acordo com o número cadastrado
          'D360-API-KEY': 'pCKdN6pxsJsJKnaAf9n3NXmVAK',
        },
        body: JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": phoneNumber,
            "type": "text",
            "text": {
                "body": message,
            }
        }),
    })
}

// export async function downloadMediaOnPremise(mediaID: string, token: string) {
//     const response = await fetch(`https://waba.360dialog.io/v1/media/${mediaID}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'D360-API-KEY': token,
//         },
//     })

//     if (!response.ok) {
//         throw new Error(`Falha ao baixar a imagem: ${response.statusText}`);
//     }

//     const buffer = await response.arrayBuffer();

//     return Buffer.from(buffer);
// }

export async function downloadCloudMedia(mediaID: string, token: string) {
    const response = await fetch(`https://waba-v2.360dialog.io/${mediaID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'D360-API-KEY': token,
        },
    })

    if (!response.ok) {
        throw new Error(`Falha ao baixar a imagem: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
}
