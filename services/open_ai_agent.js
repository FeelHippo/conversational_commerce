import OpenAI from 'openai';
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// https://cookbook.openai.com/examples/how_to_build_an_agent_with_the_node_sdk
export class OpenAIAgent {
    systemMessage;
    tools;
    
    constructor() {
        this.systemMessage = {
                role: 'system',
                content:
                    `You are a helpful assistant.
                     Help find the status of the order.
                     Order has a number,
                     tracking number,
                     estimated delivery date,
                     tracking link and aggregated status.
                     The user is identified by their email.`,
            };
        this.tools = [
            {
                type: 'function',
                function: {
                    name: 'queryOrder',
                    description: 'Get the current status of a user order',
                    parameters: {
                        type: 'object',
                        properties: {
                            orderNumber: {
                                type: 'string',
                            },
                            email: {
                                type: 'string',
                            },
                            estimatedDeliveryDate: {
                                type: 'string',
                            },
                            aggregatedStatus: {
                                type: 'string',
                            },
                            trackingLink: {
                                type: 'string',
                            },
                            trackingNumber: {
                                type: 'string',
                            },
                        },
                        required: ['orderNumber', 'email'],
                    },
                }
            },
        ];
    }

    queryOrder = async (
        orderNumber,
        email,
        estimatedDeliveryDate,
        aggregatedStatus,
        trackingLink,
        trackingNumber,
    ) => {
        // https://www.ibm.com/docs/en/api-connect-graphql/1.1.x?topic=basics-making-graphql-queries-fetch-api
        const response = await fetch(
            'https://graphql-staging.on.com',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query ($orderNumber: String!, $email: String!) {
                          findOneOrder(orderNumber: $orderNumber, email: $email) {
                            estimatedDeliveryDate
                          }
                        }
                    `,
                    variables: { 'orderNumber': orderNumber, 'email': email, }
                })
            }
        );
        console.log('~~~ res', response);
        return response.data;
    }

    query = async (userInput) => {
        let queryMessages = [
            this.systemMessage,
            ...userInput.map(
                (userMessage) => ({
                    role: 'user',
                    content: userMessage,
                    })
            ),
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: queryMessages,
            tools: this.tools,
        });

        const { message } = response.choices[0];

        return message.content;

    }
}