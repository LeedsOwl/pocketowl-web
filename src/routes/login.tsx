import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(50),
});

function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, activeFlow);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("flow", activeFlow);
    signIn("password", formData);
  }

  const { signIn } = useAuthActions();
  const [activeFlow, setActiveFlow] = useState<"signUp" | "signIn">("signIn");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#5865F2]">
      <div className="max-w-sm mx-auto p-6 rounded-xl bg-black">
        <h1 className="text-xl font-medium text-white mb-3">
          {activeFlow === "signIn" ? "Sign In" : "Sign Up"}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="block mb-2 text-sm font-medium text-white">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border border-gray-500 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="block mb-2 text-sm font-medium text-white">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="border border-gray-500 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="text-white bg-[#5865F2] hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mb-3"
            >
              Submit
            </Button>
          </form>
        </Form>
        <Button
          className="text-[#5865F2] bg-black border border-[#5865F2] hover:bg-purple-50 focus:ring-4 focus:outline-none focus:ring-purple-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mb-3"
          variant="outline"
          onClick={() => {
            setActiveFlow(activeFlow === "signIn" ? "signUp" : "signIn");
          }}
        >
          {activeFlow === "signIn" ? "Sign up instead" : "Sign in instead"}
        </Button>
      </div>
    </div>
  );
}

export default Login;
