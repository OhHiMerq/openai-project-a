
import express from 'express'
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors'
import { Configuration, OpenAIApi } from "openai";

dotenv.config()
const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 3080

const configuration = new Configuration({
  organization: "org-1Y8qWTMKfc3XIcOgaaZAh74J",
  apiKey:`${process.env.KEY}`,
});
const openai = new OpenAIApi(configuration);

app.post('/', async (req,res)=>{
    const {message} = req.body

    const response = await openai.createCompletion({
        model: "text-ada-001",
        prompt: `${message}`,
        max_tokens: 100,
        temperature: 1,
      });

    const mess = response.data.choices[0].text
      console.log("response",mess)
    res.json({message:response.data.choices[0].text})
})

app.listen(port,()=>{
    console.log(`Listening at post ${port}`)
})

