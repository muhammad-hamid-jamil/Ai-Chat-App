import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { supabaseAdmin } from "../supabaseAdmin";
import { createClient } from "@supabase/supabase-js";

const callLLMOrEcho = async (prompt: string): Promise<string> => {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    return `you said: ${prompt}`;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return `you said: ${prompt}`;
  }
};

export const chatRouter = router({
  send: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        modelTag: z.string(),
        prompt: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, modelTag, prompt } = input;

      // Use admin client to bypass RLS for now
      const supabase = supabaseAdmin;

      // Insert user message
      const { error: userError } = await supabase
        .from("messages")
        .insert({
          user_id: userId,
          model_tag: modelTag,
          role: "user",
          content: prompt,
        });

      if (userError) {
        throw new Error(`Failed to save user message: ${userError.message}`);
      }

      // Get AI response
      const aiResponse = await callLLMOrEcho(prompt);

      // Insert AI message
      const { error: aiError } = await supabase
        .from("messages")
        .insert({
          user_id: userId,
          model_tag: modelTag,
          role: "ai",
          content: aiResponse,
        });

      if (aiError) {
        throw new Error(`Failed to save AI message: ${aiError.message}`);
      }

      return { reply: aiResponse };
    }),

  history: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        modelTag: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { userId, modelTag } = input;

      // Use admin client to bypass RLS for now
      const supabase = supabaseAdmin;

      const { data, error } = await supabase
        .from("messages")
        .select("role, content, created_at")
        .eq("user_id", userId)
        .eq("model_tag", modelTag)
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch chat history: ${error.message}`);
      }

      return data;
    }),
});
