export function sendMessageTo360Dialog(phoneNumber: string, message: string): void {
    fetch('https://waba-sandbox.360dialog.io/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          // TODO: Pegar a API Key do Sandbox de acordo com o número cadastrado
          'D360-API-KEY': 'LtmN6p_sandbox',
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
