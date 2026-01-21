"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useForm, type Updater } from "@tanstack/react-form";
import type { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import { loginFormSchema } from "../forms/login";
import { authClient } from "@/server/better-auth/client";
import { SignInWithGithubButton, SignInWithGoogleButton } from "../../components";

type LoginValues = z.infer<typeof loginFormSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState<
    null | "email" | "github" | "google"
  >(null);

  const isBusy = loading !== null;

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    } satisfies LoginValues,
    validators: {
      onSubmit: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      await handleLoginWithEmailPassword(value);
    },
  });

  async function handleLoginWithEmailPassword(values: LoginValues) {
    try {
      setLoading("email");

      const res = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (res?.error) {
        toast.error("Login failed", {
          description: res.error.message ?? "Invalid credentials",
        });
        return;
      }

      toast.success("Yeay!", { description: "You are now logged in" });
      window.location.assign("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while signing in.";
      toast.error("Login failed", { description: message });
    } finally {
      setLoading(null);
    }
  }

  return (
    <form
      className={className}
      {...props}
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel className="font-semibold">
                  Email Address
                </FieldLabel>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-12 h-12"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isBusy}
                    autoComplete="email"
                  />
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field>
                <FieldLabel className="font-semibold">
                  Password
                </FieldLabel>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#89869A]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-12 pr-12"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={isBusy}
                    autoComplete="current-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void form.handleSubmit();
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#89869A] hover:text-white transition-colors cursor-pointer"
                    disabled={isBusy}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="flex items-center justify-between">
          <form.Field name="rememberMe">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked as Updater<false>)
                  }
                  className="border-[#23203A] data-[state=checked]:bg-[#312ECB] data-[state=checked]:border-[#312ECB]"
                  disabled={isBusy}
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-black dark:text-white/80 font-semibold cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            )}
          </form.Field>

          <Button
            type="button"
            variant="link"
            className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
            disabled={isBusy}
            onClick={() =>
              toast.info("TODO", {
                description: "Implement forgot password flow with Better Auth.",
              })
            }
          >
            Forgot Password?
          </Button>
        </div>

        <Field>
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-semibold rounded-xl transition-all duration-300 group"
            disabled={isBusy}
          >
            <span>{loading === "email" ? "Signing in..." : "Sign In"}</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Field>

        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#23203A]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 dark:bg-[#110E24] bg-white dark:text-[#89869A] text-black/80">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SignInWithGoogleButton />

          <SignInWithGithubButton />
        </div>

        <div className="text-center">
          <p className="text-[#89869A]">
            Don&apos;t have an account?
            <Link href={"/register"}>
              <Button
                type="button"
                variant="link"
                className="text-[#312ECB] hover:text-[#732ECB] ml-1 p-0 h-auto font-semibold"
                disabled={isBusy}
              >
                Sign Up
              </Button>
            </Link>
          </p>
        </div> */}
      </FieldGroup>
    </form>
  );
}
