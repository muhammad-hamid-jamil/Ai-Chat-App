import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { supabaseAdmin } from "../supabaseAdmin";

export const modelsRouter = router({
  getAvailable: publicProcedure.query(async () => {
    const { data, error } = await supabaseAdmin
      .from("models")
      .select("tag")
      .order("tag");

    if (error) {
      throw new Error(`Failed to fetch models: ${error.message}`);
    }

    return data;
  }),
});
