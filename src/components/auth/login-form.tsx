"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { KeyIcon, Loader2Icon, MailIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)
    setNotification({ type: null, message: "" })

    try {
      const supabase = createClientComponentClient();
      const {email, password} = values;

      const { error,
        data: {session}
       } = await supabase.auth.signInWithPassword({
        email, 
        password
      })
      setNotification({
        type: "success",
        message: "Login realizado com sucesso! Redirecionando...",
      })
      
      router.refresh()

    } catch (error) {
      console.error(error)
      setNotification({
        type: "error",
        message: "Erro ao fazer login. Verifique suas credenciais e tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {notification.type && (
        <Alert
          className={
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }
        >
          <AlertTitle>{notification.type === "success" ? "Sucesso!" : "Erro!"}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <MailIcon className="h-5 w-5" />
                    </div>
                    <Input placeholder="seu@email.com" className="pl-10" disabled={isLoading} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-slate-700">Senha</FormLabel>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs text-slate-500 hover:text-slate-900"
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      setNotification({
                        type: "error",
                        message: "Funcionalidade em desenvolvimento.",
                      })
                    }
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <KeyIcon className="h-5 w-5" />
                    </div>
                    <Input type="password" placeholder="••••••••" className="pl-10" disabled={isLoading} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full py-6 text-base bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

