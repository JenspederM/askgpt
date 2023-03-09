import * as dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import cors from 'cors'

import { ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai'

const app = express()

app.use(express.json())
app.use(cors())

const messages: ChatCompletionResponseMessage[] = [
  {
    role: 'system',
    content:
      'You are a helpful assistant that will keep your answers short and concise. When you send code, you always send it as a code snippet with language tags.',
  },
]

app.post('/sendMessage', async (req: Request, response: Response) => {
  const userMessage = req.body
  messages.push(userMessage)

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const openai = new OpenAIApi(configuration)

  await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages.slice(-5),
    })
    .then((res) => {
      const answer = res.data.choices[0].message
      if (answer) {
        messages.push(answer)
        response.send(JSON.stringify(answer))
      } else {
        response.sendStatus(500)
      }
    })
    .catch((err) => {
      console.log('An error occurred: ', err.message)
    })
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
