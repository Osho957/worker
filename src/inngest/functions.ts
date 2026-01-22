import { firecrawl } from "@/lib/firecrawl";
import { inngest } from "./client";
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

const URL_REGEX = /https?:\/\/[^\s]+/g;

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ event, step }) => {
    const {prompt} = event.data as { prompt: string };

    // Extract URLs from the prompt
    const urls = await step.run("extract-urls", async () => {
          return prompt.match(URL_REGEX) ?? [];
    }) as string[];

    // Scrape contents from the URLs
    const scrapedContents = await step.run("scrape-urls", async () => {
       const results = await Promise.all(urls.map(async (url) => {
          // Simulate scraping each URL
          const result = await firecrawl.scrape(url, {formats: ['markdown']});
          return result.markdown ?? null;
        }));
        return results.filter(Boolean).join('\n\n');
    });

    // Generate final prompt with scraped contents
    const finalPrompt = scrapedContents ? `Context:\n${scrapedContents}\n\nQuestion:\n${prompt}` : prompt;

    await step.run("generate-text", async () => {
      // Simulate a text generation step
     return await generateText({
        model: anthropic('claude-3-haiku-20240307'),
        prompt: finalPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      });
    });
  },
);