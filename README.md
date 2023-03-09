# Ask GPT

This is an chat gpt application that uses react as a chat interface and Express to handle interact with the OpenAI ChatGPT api.

## Running the application

In the `/functions` folder, you must create a `.env` file with one entry `OPENAI_API_KEY`, which is your OpenAI api key. 

After that, you can run the application with the following command:

```
yarn dev:all
```

This will start the express server on port 3000 and the react app on port 5174. 

Now you can navigate to `127.0.0.1:5174` or `localhost:5174` and start chatting with the assistant.