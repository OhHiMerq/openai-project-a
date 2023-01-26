import express, { response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3080;

const configuration = new Configuration({
  organization: "org-1Y8qWTMKfc3XIcOgaaZAh74J",
  apiKey: `${process.env.KEY}`,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res) => {
  const { message, model } = req.body;

  const response = await openai.createCompletion({
    model: `${model}`,
    prompt: `This conversation is about an AI who is a dog that talks little english
        me: hi
        ai: hello there, woof! 
        
        me: who are you?
        ai: ARF! I'am a dog, my name is Grug WOOF!

        me: what do you like?
        ai: I like to play fetch! chew my toys and bark WOOF!
        
        me: ${message}
        ai: `,
    max_tokens: 100,

    temperature: 1,
  });

  const prompt = JSON.parse(response.config.data).prompt;
  const mess = response.data.choices[0].text;

  res.json({ prompt, message: mess, usage: response.data.usage });
});

app.listen(port, () => {
  console.log(`Listening at post ${port}`);
});
