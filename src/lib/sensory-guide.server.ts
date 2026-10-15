import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";

export const exerciseSchema = z.object({
  title: z.string(),
  why: z.string(),
  minutes: z.number(),
  steps: z.array(z.string()),
  surface: z.enum(["texture-pad", "breathing", "meadow", "none"]),
});
export type SensoryExercise = z.infer<typeof exerciseSchema>;

const INSTRUCTIONS = `You are a warm, gentle companion in a wellness app for people who experience skin-picking urges.
The user describes how their hands feel or what texture they crave. Recommend ONE short, personalized, hands-busy sensory exercise (1-5 minutes) using safe, common items (fabric, stones, putty, ice, a textured mat) or the app's own tools.
Rules: never diagnose, never mention medical conditions, never shame, never mention streaks or scores, never suggest anything that touches or harms skin. Kind, plain language. 3-5 short steps.
surface: "texture-pad" if tracing/raking a digital texture suits them, "breathing" if calming breath helps, "meadow" for hands-free rest, otherwise "none".`;

export async function recommendExercise(feeling: string): Promise<SensoryExercise> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("AI is not configured yet.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    prompt: feeling,
    output: Output.object({ schema: exerciseSchema }),
    providerOptions: {
      openai: { forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
    },
  });
  return await result.output;
}
