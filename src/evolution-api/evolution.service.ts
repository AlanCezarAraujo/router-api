import { CloudEntry, OnPremiseContact, OnPremiseMessages } from "src/360-dialog/360dialog.model";
import { IEvolutionPayload, MessageTypeEnum } from "./evolution.model";

export function setEvolutionPayload(entry: CloudEntry[], contacts: OnPremiseContact[], messages: OnPremiseMessages[]): IEvolutionPayload | undefined {
  if (!entry || !entry[0]?.changes[0]?.value?.contacts) {
    console.warn('No contacts or entry found [maybe On Premise account/request]')
  }

  if (!contacts || !messages) {
    console.warn('No contacts or messages found')

    return
  }

  if (entry) {
    const evolutionPayload = {
      numberId: entry[0].changes[0].value.metadata.display_phone_number,
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
    numberId: contacts[0].wa_id,
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
      response = await fetch('https://api.netip.com.br/webhook/evolution', {
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
