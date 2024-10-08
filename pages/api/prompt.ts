// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const style = req.body.style;

  if (!style) {
    const dataFomAirtable = await fetch(
      "https://api.airtable.com/v0/appZHDBSO3uOPS3eB/tblnGLd1AmnubGqd3",
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        },
      }
    ).then((response) => response.json());

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a content analyzer. Analyze the given email data and return a JSON object with word frequency (top 20 words) and tone analysis (top 5 tones with scores).
               The output should be in the following format:
               
                {
                  "wordCloudData": [
                     { "text": "deadline", "value": 0 to 1000 },
                     // ... more words
                  ],
                  "toneAnalysis": {
                     "dominant": {
                         value: "Professional",
                         color: "#FF...",
                     },
                     "secondary": ...,
                     "tertiary": ...,
                  },
              `,
        },
        {
          role: "user",
          content: JSON.stringify(dataFomAirtable.records),
        },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0,
    });

    res.status(200).json({
      data: JSON.parse(chatCompletion.choices[0].message.content || "{}"),
    });
  }

  if (style) {
    const inbox = await fetch(
      "https://api.airtable.com/v0/appZHDBSO3uOPS3eB/tblMEE1Wr5Vwmr1XT",
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        },
      }
    ).then((response) => response.json());

    const email = inbox.records[0].fields["Email"];

    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a content generator. Generate a response to the given email prompt in the style of the user's emails. The output should be a JSON object with the generated content.

                The output should be in the following format:
                {
                  "response": "Generated response in the style of the user's emails in HTML format. Highlight the words that match the user's style in different color",
                }
                `,
        },
        {
          role: "user",
          content: `
          Email to respond to: ${email}

          User's style: ${JSON.stringify(style)}
        `,
        },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0,
    });

    res.status(200).json({
      response: JSON.parse(chatCompletion.choices[0].message.content || "{}"),
    });
  }
}
