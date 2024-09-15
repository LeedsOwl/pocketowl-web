import { useAuthActions } from "@convex-dev/auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Terms } from "@/components/terms";

const formSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const { toast } = useToast();
//   const { setTheme } = useTheme();
//   setTheme("dark");
    
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (values.password !== values.confirmPassword) {
      toast({
        description: "Passwords do not match!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", values.fullName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("flow", "signUp");
    
    signIn("password", formData)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: `Could not sign up: ${error.message}`,
        });
      });
  }

  return (
    <div className="flex w-screen flex-wrap text-foreground">
      <div
        className="relative hidden h-screen select-none flex-col justify-center text-center md:flex md:w-1/2"
        style={{
          backgroundImage: "url('/register.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto py-16 px-8 xl:w-[40rem]">
          <span className="bg-white text-black rounded-full px-3 py-1 font-medium text-primary">
            Welcome to PocketOwl
          </span>
          <p className="my-6 text-3xl font-semibold leading-10">
            Take control of your finances with{" "}
            <span className="mx-auto block w-56 mt-1 whitespace-nowrap rounded-lg bg-primary border border-white py-2">
              PocketOwl
            </span>
          </p>
          <p className="mb-4">
            PocketOwl provides you with the tools to effortlessly manage your
            budget, track expenses, and achieve your financial goals - all in one
            place.
          </p>
          <a
            href="#"
            className="font-semibold tracking-wide underline underline-offset-4"
          >
            Learn More
          </a>
        </div>
      </div>
      <div className="flex w-full flex-col md:w-1/2">
        <div className="flex justify-center pt-12 md:justify-start md:pl-12">
          <a href="#" className="text-2xl font-bold text-primary">
            {" "}
            PocketOwl .{" "}
          </a>
        </div>
        <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
          <p className="text-center text-3xl font-bold md:text-left md:leading-tight dark:">
            Create your free account
          </p>
          <p className="mt-6 text-center font-medium md:text-left dark:">
            Already using PocketOwl?{" "}
            <a
              href="/login"
              className="whitespace-nowrap font-semibold text-primary underline"
            >
              Login here
            </a>
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-stretch pt-3 md:pt-8"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-4">
                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primary">
                      <Input
                        className="w-full flex-shrink appearance-none border-gray-300 py-2 px-4 placeholder-gray-400 focus:outline-none"
                        placeholder="Full Name"
                        {...field}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-4">
                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primary">
                      <Input
                        type="email"
                        className="w-full flex-shrink appearance-none border-gray-300  py-2 px-4 text-base  placeholder-gray-400 focus:outline-none"
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
                  <FormItem className="flex flex-col pt-4">
                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primary">
                      <Input
                        type="password"
                        className="w-full flex-shrink appearance-none border-gray-300  py-2 px-4 text-base  placeholder-gray-400 focus:outline-none"
                        placeholder="Password (minimum 8 characters)"
                        {...field}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="mb-4 flex flex-col pt-4">
                    <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primary">
                      <Input
                        type="password"
                        className="w-full flex-shrink appearance-none border-gray-300  py-2 px-4 text-base  placeholder-gray-400 focus:outline-none"
                        placeholder="Confirm Password"
                        {...field}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="termsAccepted"
                render={({ field }) => (
                  <FormItem className="flex pb-2">
                    <Checkbox
                      id="terms"
                      className="mr-2 h-5 w-5 mt-1"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FormLabel>
                      I agree to the <Terms/>
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-6 rounded-lg bg-primary px-4 py-2 text-center text-base font-semibold dark:text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
