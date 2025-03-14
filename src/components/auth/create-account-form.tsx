"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { KeyIcon, Loader2Icon, MailIcon, UserIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

const createAccountFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres.",
  }),
})

type CreateAccountFormValues = z.infer<typeof createAccountFormSchema>

export function CreateAccountForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const router = useRouter()

  const form = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: CreateAccountFormValues) {
    setIsLoading(true)
    setNotification({ type: null, message: "" })

    try {

      const supabase = createClientComponentClient();
      const {email, password} = values;

      const { error,
        data: {user}
       } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`
        }
      })

      if (user) router.push("/")
      setNotification({
        type: "success",
        message: "Conta criada com sucesso! Você já pode fazer login no sistema.",
      })

      // Limpar o formulário após o registro bem-sucedido
      form.reset()
    } catch (error) {
      console.error(error)
      setNotification({
        type: "error",
        message: "Erro ao criar conta. Verifique os dados informados e tente novamente.",
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Nome</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <Input placeholder="Seu nome completo" className="pl-10" disabled={isLoading} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel className="text-slate-700">Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                      <KeyIcon className="h-5 w-5" />
                    </div>
                    <Input
                      type="password"
                      placeholder="Crie uma senha forte"
                      className="pl-10"
                      disabled={isLoading}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-xs text-slate-500">
                  A senha deve ter pelo menos 8 caracteres
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full py-6 text-base bg-slate-900 hover:bg-slate-800" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

