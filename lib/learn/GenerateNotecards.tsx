"use server";

import { Configuration, OpenAIApi } from "openai-edge";

export async function generateNotecards(content) {
  const config = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(config);

  const response = await openai.createCompletion({
    model: "gpt-4",
    prompt:
      "Create [number of cards] concise, simple, straightforward and distinct Anki cards to study the following article, each with a front and back. Avoid repeating the content in the front on the back of the card. In particular, if the front is a question and the back an answer, avoid repeating the phrasing of the question as the initial part of the answer. Avoid explicitly referring to the author or the article in the cards, and instead treat the article as factual and independent of the author. Use the following format" +
      "1. Front: [front section of card 1]" +
      "Back: [back section of card 1]" +
      "2. Front: [front section of card 2]" +
      "Back: [back section of card 2]" +
      content,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 1,
    max_tokens: 100,
    stop: null,
  });

  // Convert the response into an array of notecards
  const data = response.json()



}
