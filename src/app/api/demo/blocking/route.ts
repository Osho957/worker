// POST localhost:3000/api/demo/blocking

import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export async function POST() {
  const response = await generateText({
        model: anthropic('claude-3-haiku-20240307'),
        prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });

  return Response.json({ response });
}
