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
                messaging_product: "whatsapp" | string,
                metadata: {
                    display_phone_number: string,
                    phone_number_id: string,
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
                        // Phone Number
                        from: string,

                        // Example: wamid.HBgNNTUxMTk4NDM3OTkwNhUCABIYIEFDMTIxNkZFNzREMTg4M0E4M0NFODZDRDc5Nzk0QkM5AA==
                        id: string,

                        type: 'image' | string,
                        image?: {
                            id: string,
                            mime_type: string,
                            sha256: string,
                        },
                        text?: {
                            body: string,
                        },
                    },
                ],
            },
            field: 'messages' | string,
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
    // Phone Number
    from: string,

    // Example: wamid.HBgNNTUxMTk4NDM3OTkwNhUCABIYIEFDMTIxNkZFNzREMTg4M0E4M0NFODZDRDc5Nzk0QkM5AA==
    id: string,

    type: 'image' | string,
    image?: {
        id: string,
        mime_type: string,
        sha256: string,
    },
    text?: {
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
