"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "../../pages/context/SessionContext"; // Importa el hook para usar el contexto de sesión


interface LoginFormProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const router = useRouter();
  const { setUserSession } = useSession(); // Obtén la función para actualizar la sesión
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    direction: "",
    postalcode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleView = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/v1/user/login" : "/api/v1/user/register";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(`https://aaa-eight-beta.vercel.app${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error en la autenticación");

      // Si es login, actualizamos la sesión
      if (isLogin) {
        const userSession = {
          id: data.user.id,
          name: data.user.name,
          lastname: data.user.lastname,
          email: data.user.email,
          isOnline: true,
          isAdmin: data.user.isAdmin,
          avatar: data.user.avatar,
        };

        setUserSession(userSession, data.token); // Actualizamos la sesión con el token

        // Guardamos el token en localStorage o cookies
        localStorage.setItem("token", data.token);

        // Redirigimos al dashboard
        router.push("/dashboard");
      } else {
        // Si es un registro exitoso, redirigimos al login
        setIsLogin(true); // Cambiamos la vista a login
        router.push("/login"); // Redirigimos a la página de login
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 min-h-screen", className)} {...props}>
      <Card className="overflow-hidden max-w-2xl w-full">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{isLogin ? "Welcome back" : "Create an account"}</h1>
                <p className="text-balance text-muted-foreground">
                  {isLogin ? "Login to your Acme Inc account" : "Sign up for an Acme Inc account"}
                </p>
              </div>

              {/* Formulario para registrar o loguearse */}
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input id="name" type="text" placeholder="Juan" required onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastname">Apellido</Label>
                      <Input id="lastname" type="text" placeholder="Pérez" required onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 grid gap-2">
                      <Label htmlFor="direction">Dirección</Label>
                      <Input id="direction" type="text" placeholder="Calle Principal 123" required onChange={handleChange} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="postalcode">Postal</Label>
                      <Input id="postalcode" type="text" placeholder="28001" required onChange={handleChange} />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required onChange={handleChange} />
              </div>

              {/* Password y Confirmar Password */}
              {!isLogin ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" required />
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required onChange={handleChange} />
                </div>
              )}

              {/* Error */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Botón de submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </Button>

              {/* Switch entre login y signup */}
              <div className="text-center text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={toggleView} className="underline underline-offset-4 hover:text-primary">
                  {isLogin ? "Sign up" : "Login"}
                </button>
              </div>
            </div>
          </form>

          {/* Imagen al lado derecho del formulario (en dispositivos grandes) */}
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/port.png"
              alt="Image"
              layout="fill"
              objectFit="cover"
              className="dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
