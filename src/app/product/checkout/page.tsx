"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "../../pages/context/CartContext"
import { useSession } from "../../pages/context/SessionContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Header from "../../pages/Header"
import Footer from "./footer" // Update the path to match where Footer is located

export default function CheckoutPage() {
  const { cart } = useCart()
  const { session, setUserSession } = useSession()
  const router = useRouter()

  // Registration form state
  const [name, setName] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repassword, setRepassword] = useState("")
  const [direction, setDirection] = useState("")
  const [postalcode, setPostalCode] = useState("")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Active accordion by default
  const [activeAccordion, setActiveAccordion] = useState<string>("register")

  const [error, setError] = useState("")
  const [loginError, setLoginError] = useState("")

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const total = subtotal

  interface UserData {
    name: string
    lastname: string
    email: string
    password: string
    repassword: string
    direction: string
    postalcode: string
  }

  interface LoginData {
    email: string
    password: string
  }

  interface ApiResponse {
    message?: string
    newUser?: {
      id: string
      name: string
      lastname: string
      email: string
    }
    user?: {
      id: string
      name: string
      lastname: string
      email: string
    }
    token?: string
  }

  // Redirect to PayPal if the session is active
  useEffect(() => {
    console.log("Session value before redirect:", session)
    if (session && typeof session === "object" && session.id) {
      router.push("/payments")
    }
  }, [session, router])

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (password !== repassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!name || !lastname || !email || !password || !direction || !postalcode) {
      setError("Por favor, completa todos los campos")
      return
    }

    const userData: UserData = {
      name,
      lastname,
      email,
      password,
      repassword,
      direction,
      postalcode,
    }

    try {
      const res = await fetch("https://aaa-eight-beta.vercel.app/api/v1/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      })

      if (!res.ok) {
        const data: ApiResponse = await res.json()
        throw new Error(data.message || "Error en el registro")
      }

      const data: ApiResponse = await res.json()

      if (!data.newUser || !data.token) {
        throw new Error("Datos de usuario o token no recibidos")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.newUser))
      console.log(data.token)
      console.log(data.newUser)

      setUserSession({ ...data.newUser, isOnline: true }, data.token)
      localStorage.setItem("totalPrice", total.toString())

      setTimeout(() => {
        console.log("Redirigiendo a payments")
        router.push("/payments")
      }, 1000)

      alert("Registro exitoso y pedido realizado")
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    }
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError("")

    if (!loginEmail || !loginPassword) {
      setLoginError("Por favor, ingresa tu email y contraseña")
      return
    }

    const loginData: LoginData = {
      email: loginEmail,
      password: loginPassword,
    }

    try {
      const res = await fetch("https://aaa-eight-beta.vercel.app/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Error al iniciar sesión")
      }

      const data: ApiResponse = await res.json()

      if (!data.user || !data.token) {
        throw new Error("Datos de usuario o token no recibidos")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      setUserSession({ ...data.user, isOnline: true }, data.token)
      localStorage.setItem("totalPrice", total.toString())

      setTimeout(() => {
        console.log("Redirigiendo a payments")
        router.push("/payments")
      }, 1000)

      alert("Inicio de sesión exitoso")
    } catch (error: unknown) {
      if (error instanceof Error) {
        setLoginError(error.message)
      } else {
        setLoginError("Ocurrió un error desconocido")
      }
    }
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 lg:mx-36">
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold mb-4">Finalizar Compra</h2>

            <Accordion
              type="single"
              collapsible
              defaultValue={activeAccordion}
              onValueChange={(value) => setActiveAccordion(value)}
              className="w-full"
            >
              <AccordionItem value="login">
                <AccordionTrigger className="text-lg font-semibold">Ya tengo una cuenta</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-card rounded-lg shadow-sm border">
                    {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Contraseña</Label>
                        <Input
                          id="login-password"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Iniciar Sesión y Continuar
                      </Button>
                    </form>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="register">
                <AccordionTrigger className="text-lg font-semibold">Crear una cuenta nueva</AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-card rounded-lg shadow-sm border">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre</Label>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastname">Apellidos</Label>
                          <Input
                            id="lastname"
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="direction">Dirección</Label>
                        <Input
                          id="direction"
                          type="text"
                          value={direction}
                          onChange={(e) => setDirection(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="postalcode">Código Postal</Label>
                        <Input
                          id="postalcode"
                          type="text"
                          value={postalcode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Contraseña</Label>
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="repassword">Repetir Contraseña</Label>
                          <Input
                            id="repassword"
                            type="password"
                            value={repassword}
                            onChange={(e) => setRepassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Registrarse y Confirmar Pedido
                      </Button>
                    </form>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length > 0 ? (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between border-b py-2">
                        <p>
                          {item.name} x {item.quantity}
                        </p>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold mt-4">
                      <p>Total</p>
                      <p>${total.toFixed(2)}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">Tu carrito está vacío</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

