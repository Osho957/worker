import { inngest } from "./client";
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ step }) => {
    await step.run("generate-text", async () => {
      // Simulate a text generation step
     return await generateText({
        model: anthropic('claude-3-haiku-20240307'),
        prompt: 'Write a vegetarian lasagna recipe for 4 people.',
      });
    });
  },
);