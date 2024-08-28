import { useAuthActions } from "@convex-dev/auth/react";
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
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("flow", "signIn");

    signIn("password", formData)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  }

  return (
    <div className="flex w-screen flex-wrap">
      <div className="flex w-full flex-col md:w-1/2">
        <div className="flex justify-center pt-12 md:justify-start md:pl-12">
          <a href="#" className="text-2xl font-bold text-primary">
            PocketOwl .
          </a>
        </div>
        <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
          <p className=" dark:text-white text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl">
            Welcome to <br />
            <span className="text-primary">PocketOwl</span>
          </p>
          <p className="dark:text-white mt-6 text-center font-medium md:text-left">
            Sign in to your account below.
          </p>

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
                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primary">
                      <Input
                        type="email"
                        className="w-full flex-shrink appearance-none border-gray-300 py-2 px-4 text-base placeholder-gray-400 focus:outline-none"
                        placeholder="Email"
                        {...field}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-4 flex flex-col pt-4">
                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primary">
                      <Input
                        type="password"
                        className="w-full flex-shrink appearance-none border-gray-300 py-2 px-4 text-base  placeholder-gray-400 focus:outline-none"
                        placeholder="Password"
                        {...field}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <a
                href="#"
                className="dark:text-white mb-6 text-center text-sm font-medium text-gray-600 md:text-left"
              >
                Forgot password?
              </a>
              <Button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
              >
                Sign in
              </Button>
            </form>
          </Form>
          <div className="py-12 text-center">
            <p className="text-gray-600 dark:text-white">
              Don't have an account? {" "}
              <a
                href="/register"
                className="whitespace-nowrap font-semibold text-primary underline underline-offset-4"
              >
                Sign up for free.
              </a>
            </p>
          </div>
        </div>
      </div>
      <div
        className="relative hidden h-screen select-none bg-primary bg-gradient-to-br md:block md:w-1/2"
        style={{
          backgroundImage: "url('/register.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="py-16 px-8 text-white xl:w-[40rem]">
          <span className="bg-white rounded-full px-3 py-1 font-medium text-primary">
            Welcome to PocketOwl
          </span>
          <p className="my-6 text-3xl font-semibold leading-10">
            Manage your finances with{" "}
            <span className="awhitespace-nowrap py-2 text-cyan-300">
              ease and confidence
            </span>
            .
          </p>
          <p className="mb-4">
            PocketOwl helps you track your spending, budget your income, and
            achieve your financial goals with powerful, easy-to-use tools.
          </p>
          <a
            href="#"
            className="font-semibold tracking-wide text-white underline underline-offset-4"
          >
            Learn More
          </a>
        </div>
        {/* <img
          className="ml-8 w-11/12 max-w-lg rounded-lg object-cover"
          src="/"
          alt="Feature"
        /> */}
      </div>
    </div>
  );
}

export default Login;
