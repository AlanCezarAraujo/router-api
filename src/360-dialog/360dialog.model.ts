export type OnPremiseContact = {
    profile: {
        name: string
    },
    wa_id: string,
}

export type OnPremiseMessages = {
    id: string
    text: {
        body: string,
    },
}

export type OnPremiseEntry = {
    contacts: OnPremiseContact[],
    messages: OnPremiseMessages[],
}

export type CloudEntry = {
    id: string,
    changes: [
        {
            value: {
                metadata: {
                    display_phone_number: string,
                },
                contacts: [
                    {
                        profile: {
                            name: string
                        },
                        wa_id: string,
                    },
                ],
                messages: [
                    {
                        text: {
                            body: string,
                        },
                    },
                ],
            },
        }
    ],
}

export type CloudContacts = {
    profile: {
        name: string
    },
    wa_id: string,
}

export type CloudMessages = {
    text: {
        body: string,
    },
}

export type StatusesPayload = {
    statuses: [
      {
        id: string,
        message: {
          recipient_id: string
        },
        status: string,
        timestamp: string,
        type: string
      }
    ]
}
