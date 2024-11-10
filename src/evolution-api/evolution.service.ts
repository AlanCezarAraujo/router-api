import { CloudEntry, OnPremiseContact, OnPremiseMessages } from "src/360-dialog/360dialog.model";
import { IEvolutionMediaPayload, IEvolutionPayload, MessageTypeEnum } from "./evolution.model";

export function setEvolutionPayload(numberId: string, entry: CloudEntry[], contacts: OnPremiseContact[], messages: OnPremiseMessages[]): IEvolutionPayload | undefined {
  if (!entry || !entry[0]?.changes[0]?.value?.contacts) {
    console.warn('No contacts or entry found [maybe On Premise account/request]')
  }

  if (!entry && (!contacts || !messages)) {
    console.warn('No contacts or messages found')

    return
  }

  if (entry && entry[0]?.changes[0]?.value?.messages[0]?.text) {
    const evolutionPayload = {
      numberId, // entry[0].changes[0].value.metadata.display_phone_number,
      token: '39882bc13b5e520f417cf8acf7c2c4a2001', // 'BB270D0E17D7-4A17-AF19-534639FD982A',
      key: {
        remoteJid: entry[0].changes[0].value.contacts[0].wa_id,
        fromMe: false,
        id: entry[0].id,
      },
      pushName: entry[0].changes[0].value.contacts[0].profile.name,
      message: {
          conversation: entry[0].changes[0].value.messages[0].text.body,
      },
      messageType: MessageTypeEnum.Conversation,
    } as IEvolutionPayload

    return evolutionPayload
  }

  return {
    numberId, // contacts[0].wa_id,
    token: '39882bc13b5e520f417cf8acf7c2c4a2001', // 'BB270D0E17D7-4A17-AF19-534639FD982A',
    key: {
      remoteJid: contacts[0].wa_id,
      fromMe: false,
      id: messages[0].id,
    },
    pushName: contacts[0].profile.name,
    message: {
        conversation: messages[0].text.body,
    },
    messageType: MessageTypeEnum.Conversation,
  } as IEvolutionPayload
}

export async function sendToEvolutionApi(evolutionPayload: IEvolutionPayload) {
    console.log('')
    console.info('ROUTER • Sending to Evolution API:', JSON.stringify(evolutionPayload, null, 2))
    console.log('')

    let response = null
    
    try {
      // response = await fetch('https://api.netip.com.br/webhook/evolution', {
      response = await fetch('https://api02.netip.com.br/webhook/evolution', {
      // response = await fetch('https://localhost:8080/webhook/evolution', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(evolutionPayload),
      })
    } catch (error) {
      console.log('')
      console.error('ROUTER • Error sending to Evolution API:', error)
      console.log('')

      return null
    }
    
    const data = await response?.json();

    return data;
}

export async function sendMediaToEvolutionApi(payload: any) {
    console.log('')
    console.info('ROUTER • Sending media to Evolution API:', JSON.stringify(payload, null, 2))
    console.log('')

    let response = null
    
    try {
      // response = await fetch('https://api.netip.com.br/webhook/evolution', {
      response = await fetch('https://api02.netip.com.br/webhook/evolution', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      })
    } catch (error) {
      debugger
      console.log('')
      console.error('ROUTER • Error sending media to Evolution API:', error)
      console.log('')

      return null
    }

    const header = response.headers.get('content-type'); 
    
    const data = await response?.json();

    debugger

    return data;
}
