"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, signUp, useSession } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.email("Ingresa un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

const signUpSchema = z
  .object({
    name: z.string().min(1, "Ingresa tu nombre"),
    email: z.email("Ingresa un email válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "La confirmación debe tener al menos 8 caracteres"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

type Mode = "signIn" | "signUp";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isPending } = useSession();

  const callbackURL = useMemo(() => {
    const raw = searchParams.get("callbackURL");
    return raw?.startsWith("/") ? raw : "/";
  }, [searchParams]);

  const [mode, setMode] = useState<Mode>("signIn");
  const [serverError, setServerError] = useState<string | null>(null);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
    mode: "onSubmit",
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (isPending) return;

    const hasSession =
      !!(data as unknown as { user?: unknown })?.user ||
      !!(data as unknown as { session?: unknown })?.session;

    if (hasSession) {
      router.replace(callbackURL);
    }
  }, [callbackURL, data, isPending, router]);

  async function onSubmitSignIn(values: SignInValues) {
    setServerError(null);

    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
      callbackURL,
    });

    if (error) {
      setServerError(error.message ?? "Error al iniciar sesión");
      return;
    }

    router.push(callbackURL);
  }

  async function onSubmitSignUp(values: SignUpValues) {
    setServerError(null);

    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL,
    });

    if (error) {
      setServerError(error.message ?? "Error al crear la cuenta");
      return;
    }

    router.push(callbackURL);
  }

  const activeForm = mode === "signIn" ? signInForm : signUpForm;
  const isSubmitting = activeForm.formState.isSubmitting;

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <Landmark className="size-8" />
            <h1 className="text-2xl font-semibold tracking-tight">Finantier</h1>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Inicia sesión para continuar
          </p>
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setServerError(null);
                setMode("signIn");
              }}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b",
                mode === "signIn"
                  ? "text-foreground border-b-primary"
                  : "text-muted-foreground border-b-transparent",
              )}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setServerError(null);
                setMode("signUp");
              }}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b",
                mode === "signUp"
                  ? "text-foreground border-b-primary"
                  : "text-muted-foreground border-b-transparent",
              )}
            >
              Crear cuenta
            </button>
          </div>

          <div className="p-6">
            {serverError ? (
              <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {serverError}
              </div>
            ) : null}

            {mode === "signIn" ? (
              <Form {...signInForm}>
                <form
                  onSubmit={signInForm.handleSubmit(onSubmitSignIn)}
                  className="space-y-4"
                >
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="tu@email.com"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signInForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="size-4"
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isSubmitting}
                          />
                          <span className="text-sm text-muted-foreground">
                            Mantener sesión
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Ingresando..." : "Ingresar"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...signUpForm}>
                <form
                  onSubmit={signUpForm.handleSubmit(onSubmitSignUp)}
                  className="space-y-4"
                >
                  <FormField
                    control={signUpForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            autoComplete="name"
                            placeholder="Tu nombre"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="tu@email.com"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar contraseña</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
