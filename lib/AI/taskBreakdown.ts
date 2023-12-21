"use server";

import OpenAI from "openai";
import { updateTask } from "../serv-actions/Todo";

const openai = new OpenAI({apiKey: process.env.API_KEY});

export const fetchTaskBreakdown = async (taskId: string, taskTitle: string): Promise<string[]> => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that breaks down tasks." },
          { role: "user", content: `Breakdown the task high level step by step: "${taskTitle}"` },
        ],
        max_tokens: 50, // Adjust the max_tokens as needed to control response length
      });
  
      if (completion && completion.choices && completion.choices.length > 0) {
        const breakdown = completion.choices[0].message.content.trim(); // Access content property
        const breakdownLines = breakdown.split('\n');
        console.log(breakdownLines);
        updateTask(taskId, JSON.stringify(breakdownLines));
        return breakdownLines; // Return the breakdownLines as the result
      } else {
        // Handle errors
        console.error('Failed to fetch task breakdown');
        return [];
      }
    } catch (error) {
      console.error('Error while fetching task breakdown:', error);
      return [];
    }
  };