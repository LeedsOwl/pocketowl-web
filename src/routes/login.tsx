import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuthActions();
  const [errorMessage, setErrorMessage] = useState(""); // Error state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Extract redirect path from URL params
  const redirectPath = new URLSearchParams(location.search).get('redirect');

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    signIn("password", formData)
      .then(() => {
        // Redirect to the invite path or home page after login
        if (redirectPath) {
          navigate(redirectPath); 
        } else {
          navigate("/"); 
        }
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setErrorMessage("Invalid email or password. Please try again."); // Set error message
      });
  }

  return (
    <div className="flex w-screen flex-wrap">
      <div className="flex w-full flex-col md:w-1/2">
        <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
          <p className="dark:text-white text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl">
            Welcome to <br />
            <span className="text-primary">PocketOwl</span>
          </p>
          <p className="dark:text-white mt-6 text-center font-medium md:text-left">
            Sign in to your account below.
          </p>

          {/* Display error message */}
          {errorMessage && (
            <div className="bg-red-200 text-red-800 p-2 rounded-md mb-4">
              {errorMessage}
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-stretch pt-3 md:pt-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-4">
                    <Input
                      type="email"
                      className="w-full border-gray-300 py-2 px-4"
                      placeholder="Email"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-4 flex flex-col pt-4">
                    <Input
                      type="password"
                      className="w-full border-gray-300 py-2 px-4"
                      placeholder="Password"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-center text-base font-semibold text-white shadow-md"
              >
                Sign in
              </Button>
            </form>
          </Form>
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-white">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-semibold text-primary underline"
              >
                Sign up for free.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
