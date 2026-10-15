import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSensoryExercise = createServerFn({ method: "POST" })
  .inputValidator(z.object({ feeling: z.string().trim().min(2).max(500) }))
  .handler(async ({ data }) => {
    const { recommendExercise } = await import("./sensory-guide.server");
    try {
      return { ok: true as const, exercise: await recommendExercise(data.feeling) };
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      const message = status === 429 ? "Lots of people are resting here right now. Try again in a moment."
        : status === 402 || status === 403 ? "AI suggestions are paused for now. The other tools still work."
        : "Couldn't find a suggestion just now. Try again in a little while.";
      console.error(e);
      return { ok: false as const, message };
    }
  });
