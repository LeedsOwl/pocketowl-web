import { query } from "./_generated/server"; // Correct import for the query function
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { z } from "zod";

// Schema for sign-in validation
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

// Export authentication functions
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [passwordWithValidation],
});

// Define the getUser query
export const getUser = query(async (ctx) => {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
});
