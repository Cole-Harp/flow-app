"use server";

import OpenAI from "openai";
import { updateTask } from "../serv-actions/Todo";
import { CompletionChoice } from "openai/resources";

const openai = new OpenAI({apiKey: process.env.API_KEY});

export const fetchNoteCards = async(notes: string)=> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
            { role: "system", content: "You are a note card generator. Analyze the provided notes and generate a structured list." },
            { role: "user", content: `Analyze the following notes and generate note cards in JSON format of {{front: "title", back: "Note to learn"}, {front: "title", back: "Note to learn"}}: "${notes}"` },
          ],
        max_tokens: 2000, // adjust for desired detail
        response_format: { type: "json_object" }, // request JSON response
      });
  
      if (completion && completion.choices && completion.choices.length > 0) {
        const choice = completion.choices[0];
        console.log(choice.message.content); // log the full JSON object for debugging
        return choice.message.content; // return the entire choice object
      } else {
        console.error("Failed to generate note cards");
        return {} as CompletionChoice; // return an empty object for consistency
      }
    } catch (error) {
      console.error("Error while generating note cards:", error);
      return {} as CompletionChoice;
    }
  };
  
  