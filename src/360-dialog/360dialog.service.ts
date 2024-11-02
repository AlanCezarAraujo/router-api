export async function sendMessageTo360Dialog(phoneNumber: string, message: string) {
    return fetch('https://waba.360dialog.io/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          // TODO: Pegar a API Key do Sandbox de acordo com o número cadastrado
          'D360-API-KEY': '6F21itBcq2bOFK9WYcvujDU6AK',
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
