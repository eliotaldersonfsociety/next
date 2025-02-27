"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '../pages/context/CartContext';
import { useSession } from '../pages/context/SessionContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Header() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const { session, clearUserSession, setUserSession, sessionLoading } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  interface LoginResponse {
    token: string;
    user: {
      id: number;
      name: string;
      lastname?: string;
      email: string;
      isAdmin?: boolean;
    };
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch('https://aaa-eight-beta.vercel.app/api/v1/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      const data: LoginResponse = await response.json();
      console.log("Datos recibidos:", data);

      if (!data.token || !data.user) {
        throw new Error('Respuesta del servidor no válida');
      }

      setUserSession(
        {
          id: data.user.id.toString(),
          name: data.user.name,
          lastname: data.user.lastname || '',
          email: data.user.email,
          isOnline: true,
          isAdmin: data.user.isAdmin || false,
        },
        data.token // Pasa el token recibido
      );

      setEmail('');
      setPassword('');
      
      //redirigir segun el rol
      if (data.user.isAdmin){
        router.push('/panel');
      } else {
        router.push('/dashboard')
      }
      
      alert('Inicio de sesión exitoso');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert((error as Error).message || 'Hubo un problema al iniciar sesión.');
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Función de logout que limpia los datos del localStorage
  const handleLogout = () => {
    // Limpiar el contexto de sesión de la aplicación
    clearUserSession();

    // Eliminar los items del localStorage
    localStorage.removeItem('session');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('totalPrice');

    // Si deseas eliminar también los items de librerías de terceros:
    localStorage.removeItem('__paypal_storage__');
    localStorage.removeItem('_grecaptcha');
    localStorage.removeItem('ally-supports-cache');

    // Redirigir a la página de login (o a la que prefieras)
    router.push('/login');
  };

  // Muestra un indicador mientras la sesión se carga
  if (sessionLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <header className="bg-[#041E42] p-4 border-b-4 border-[#AC252D]">
      <div className="container mx-auto lg:mx-36 sm:mx-4">
        <div className="flex justify-between items-center mb-4">
          <Link href="/">
            <Image src="/tsb.png" alt="Logo" width={128} height={40} className="h-8" />
          </Link>
          <input type="text" placeholder="Buscar productos..." className="p-2 rounded-md w-1/2" />
          <div className="flex items-center space-x-4">
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="relative">
                  <ShoppingCart className="h-6 w-6 text-white" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Carrito de Compras</SheetTitle>
                  <SheetDescription>
                    {cart.length === 0 ? (
                      <p>Tu carrito está vacío.</p>
                    ) : (
                      <>
                      cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2">
                          <p>{item.name} - ${item.price.toFixed(2)}</p>
                          <Button variant="outline" size="sm" onClick={() => decreaseQuantity(item.id)}>-</Button>
                          <span>{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => increaseQuantity(item.id)}>+</Button>
                          <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>Eliminar</Button>
                        </div>
                       ))}
                        <Button className="mt-4 w-full bg-blue-600 text-white" onClick={() => router.push('/payments')}>
                          Ir a Pagar
                        </Button>
                      </>
                    )}
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.avatar || "/usuario.png"} alt="Usuario" />
                    <AvatarFallback>
                      {session ? session.name[0].toUpperCase() : <User className="h-6 w-6 text-gray-500" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {session ? (
                  <>
                    <DropdownMenuItem>{session.name} {session.lastname}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => session.isAdmin ? router.push('/panel/') : router.push('/dashboard/')}>Ir al Dashboard</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
                  </>
                ) : (
                  <form onSubmit={handleLogin} className="p-4 space-y-2">
                    <h2 className="font-semibold">Iniciar sesión</h2>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full">Iniciar sesión</Button>
                  </form>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
