"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../pages/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "../../pages/Header";
import Footer from "./footer";
import { useSession } from "../../pages/context/SessionContext"; // Importa el hook

export default function CheckoutPage() {
  const { cart } = useCart();
  const { session, setUserSession } = useSession(); // Obtén la sesión
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [direction, setDirection] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const total = subtotal;

  interface UserData {
    name: string;
    lastname: string;
    email: string;
    password: string;
    repassword: string;
    direction: string;
    postalcode: string;
  }

  interface ApiResponse {
    message?: string;
    newUser?: {
      id: string;
      name: string;
      lastname: string;
      email: string;
    };
    token?: string;
  }

  // Redirigir a PayPal si la sesión está activa
  useEffect(() => {
    if (session) {
      router.push("/paypal");
    }
  }, [session, router]);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== repassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const userData: UserData = { name, lastname, email, password, repassword, direction, postalcode };

    try {
      const res = await fetch("https://apli-zts6.vercel.app/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data: ApiResponse = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en el registro"); 

      if (data.token && data.newUser) {
        setUserSession({ ...data.newUser, isOnline: true }, data.token);
      }

      localStorage.setItem("totalPrice", total.toString());
      //clearCart();
      alert("Registro exitoso y pedido realizado");
      router.push("/paypal");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 lg:mx-36">
          <div className="md:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold mb-4">Registro y Datos de Envío</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleRegister} className="space-y-4">
              <Label>Nombre</Label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              <Label>Apellidos</Label>
              <Input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Label>Dirección</Label>
              <Input type="text" value={direction} onChange={(e) => setDirection(e.target.value)} required />
              <Label>Código Postal</Label>
              <Input type="text" value={postalcode} onChange={(e) => setPostalCode(e.target.value)} required />
              <Label>Contraseña</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Label>Repetir Contraseña</Label>
              <Input type="password" value={repassword} onChange={(e) => setRepassword(e.target.value)} required />
              <Button type="submit">Registrarse y Confirmar Pedido</Button>
            </form>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between border-b py-2">
                    <p>{item.name} x {item.quantity}</p>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between font-bold mt-4">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
