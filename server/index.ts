import { modelsRouter } from "./routers/models";
import { chatRouter } from "./routers/chat";
import { router } from "./trpc";

export const appRouter = router({
  models: modelsRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
