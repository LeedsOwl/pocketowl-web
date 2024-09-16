import { query } from "./_generated/server"; // Correct import for the query function
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { z } from "zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(50),
});

// Define a profile type with optional fields
type Profile = { email: string; name?: string };

const passwordWithValidation = Password({
  profile(params): Profile {
    if (params.flow === "signUp") {
      const result = signUpSchema.safeParse(params);
      if (!result.success) {
        throw new ConvexError(result.error.format());
      }
      // Return profile for signUp flow
      return { email: result.data.email, name: result.data.name };
    } else {
      const result = signInSchema.safeParse(params);
      if (!result.success) {
        throw new ConvexError(result.error.format());
      }
      // Return profile for signIn flow with name as undefined
      return { email: result.data.email, name: undefined };
    }
  },
});

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [passwordWithValidation],
});

export const getUser = query(async (ctx) => {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
});
