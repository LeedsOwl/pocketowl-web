import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
});

const passwordWithValidation = Password({
  profile(params) {
    const { error, data } = signInSchema.safeParse(params);
    if (error) {
      throw new ConvexError(error.format());
    }
    return { email: data.email as string, name: data.name as string };
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [passwordWithValidation],
});
