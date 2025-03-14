import { CreateAccountForm } from "@/components/auth/create-account-form"
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { LockIcon, UserIcon } from "lucide-react"
import { cookies } from "next/headers"
import { redirect, RedirectType } from "next/navigation"

export default async function Home() {
  let loggedIn = false
  try {
    
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) loggedIn = true
  } catch (error) {
    console.log("home", error)
  } finally {
    if (loggedIn) redirect("/user-app", RedirectType.replace)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Inventory Pro</h1>
          <p className="text-slate-500">Sistema de gerenciamento de custos e lucros para revenda</p>
        </div>

        <Card className="border-slate-200 shadow-lg">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-100 p-1 rounded-t-lg">
              <TabsTrigger
                value="account"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <LockIcon className="w-4 h-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Registrar-se
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="p-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center text-slate-900">Acesse sua conta</CardTitle>
                <CardDescription className="text-center text-slate-500">
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8">
                <p className="text-sm text-center text-slate-500">
                  Ao entrar, você concorda com nossos{" "}
                  <a href="#" className="text-slate-900 hover:underline">
                    Termos de Serviço
                  </a>
                </p>
              </CardFooter>
            </TabsContent>

            <TabsContent value="password" className="p-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center text-slate-900">Crie uma conta</CardTitle>
                <CardDescription className="text-center text-slate-500">
                  Registre-se para gerenciar seus custos e lucros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateAccountForm />
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8">
                <p className="text-sm text-center text-slate-500">
                  Ao se registrar, você concorda com nossos{" "}
                  <a href="#" className="text-slate-900 hover:underline">
                    Termos de Serviço
                  </a>
                </p>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>© 2025 Inventory Pro. Todos os direitos reservados.</p>
        </div>
      </div>
    </main>
  )
}

