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
                     Order has a mandatory number,
                     a tracking number,
                     an estimated delivery date,
                     a tracking link and aggregated status.
                     The user is identified by their mandatory email.`,
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
                        query orderById($email: String!, $orderNumber: String!) {
                            order(email: $email, orderNumber: $orderNumber) {
                                estimatedDeliveryDate
                                aggregatedStatus
                                trackingLink
                                trackingNumber
                            }
                        }
                    `,
                    variables: { 'email': email, 'orderNumber': orderNumber  }
                })
            }
        );
        const body = await response.json();
        return Object
            .entries(body.data.order)
            .reduce(
                (result, current) => result += `${current[0]}: ${current[1]}, `, ''
            );
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

        const { finish_reason, message } = response.choices[0];

        if (finish_reason === "tool_calls" && message.tool_calls) {
            const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
            const functionArgsArr = Object.values(functionArgs);
            const functionResponse = await this.queryOrder.apply(null, functionArgsArr);

            const response = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    ...queryMessages,
                    {
                        role: 'system',
                        content: functionResponse,
                    }
                ],
            });

            return response.choices[0].message.content;
        }

        return message.content;

    }
}