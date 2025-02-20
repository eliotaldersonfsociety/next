"use client";

import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "../pages/footer";
import { useCart } from "../pages/context/CartContext";
import { Toaster, toast } from "react-hot-toast";
import { useSession } from "../pages/context/SessionContext";
import { useRouter } from "next/navigation";
import Header from "../pages/Header";

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

const PaypalPage = () => {
  const { cart, getTotal, clearCart } = useCart();
  // Extraemos session, token y sessionLoading desde el contexto
  const { session, token, sessionLoading } = useSession();
  const router = useRouter();
  const [total, setTotal] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);

  useEffect(() => {
    // Mientras se carga la sesión, mostramos un indicador
    if (sessionLoading) {
      return;
    }

    // Si ya se cargó y no hay sesión, redirigimos❤️🙌😍❤️
    if (!session || !session.isOnline) {
      toast.error("Usuario no autenticado");
      router.push("/login");
      return;
    }

    // Obtenemos el saldo usando el token del contexto
    const fetchSaldo = async () => {
      if (!token) {
        console.error("Token no encontrado en el contexto");
        toast.error("Token no encontrado");
        return;
      }
      try {
        console.log("Obteniendo saldo...");
        const res = await fetch("https://aaa-njli-rho.vercel.app/api/v1/user/saldo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error(`Error al obtener el saldo: ${res.statusText}`);
          throw new Error("No se pudo obtener el saldo");
        }
        const data = await res.json();
        console.log("Saldo obtenido:", data.saldo);
        setSaldo(data.saldo);
      } catch (error) {
        console.error("Error al obtener el saldo:", error);
        toast.error("Error al obtener el saldo");
      }
    };

    fetchSaldo();
  }, [token, session, sessionLoading, router]);

  // Actualizamos el total del carrito cada vez que cambia
  useEffect(() => {
    setTotal(Number(getTotal()));
  }, [cart, getTotal]);
  console.log("getTotal() devuelve:", getTotal());
  console.log("Tipo de getTotal():", typeof getTotal());


  // Función auxiliar para obtener el token (usamos el token del contexto)
  const getToken = () => {
    if (!token) {
      toast.error("Token no encontrado");
      router.push("/login");
    }
    return token;
  };

  const savePurchaseToAPI = async (paymentMethod: string) => {
    if (!session) {
      toast.error("Usuario no autenticado");
      return;
    }
    try {
      const tokenLocal = getToken();
      if (!tokenLocal) return;

    console.log("Total a descontar:", total);
    console.log("Tipo de total:", typeof total);


      const res = await fetch("https://aaa-njli-rho.vercel.app/api/v1/user/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenLocal}`,
        },
        body: JSON.stringify({
          userId: session.id,
          items: cart,
          payment_method: paymentMethod,
          total_amount: Number(total),
        }),
      });
      if (!res.ok) throw new Error("No se pudo guardar la compra");

      toast.success("Compra guardada con éxito");
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      toast.error("Error al guardar la compra");
    }
  };

  const handlePayWithSaldo = async () => {
    if (saldo < total) {
      toast.error("Saldo insuficiente");
      return;
    }
    const tokenLocal = getToken();
    if (!tokenLocal) return;

    const totalAmount = Number(total);

    if (isNaN(totalAmount)) {
      console.error("Error: total_amount no es un número válido");
      toast.error("Error: total_amount no es un número válido");
      return;
    }

    try {
      console.log("Enviando total_amount:", totalAmount * -1);
      console.log("Tipo de total_amount:", typeof totalAmount);
      const res = await fetch("https://aaa-njli-rho.vercel.app/api/v1/user/actualizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenLocal}`,
        },
        body: JSON.stringify({ total_amount: (total) * -1 }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al actualizar saldo:", errorData);
        throw new Error("No se pudo actualizar el saldo");
      }
      setSaldo((prev) => prev - total);
      await savePurchaseToAPI("Saldo");
      clearCart();

      // Guardamos los detalles de la compra en localStorage
      const purchaseDetails = {
        total,
        paymentMethod: "Saldo",
        items: cart,
      };
      localStorage.setItem("purchaseDetails", JSON.stringify(purchaseDetails));

      toast.success("Pago realizado con éxito");
      router.push("/paypal/thankyou");
    } catch (error) {
      console.error("Error al procesar el pago con saldo:", error);
      toast.error("Error al procesar el pago");
    }
  };

  const handlePayWithPayPal = async () => {
    try {
      await savePurchaseToAPI("PayPal");
      // Guardamos los detalles de la compra en localStorage para PayPal
      const purchaseDetails = {
        total,
        paymentMethod: "PayPal",
        items: cart,
      };
      localStorage.setItem("purchaseDetails", JSON.stringify(purchaseDetails));
      clearCart();
      toast.success("Pago realizado con éxito");
      router.push("/paypal/thankyou");
    } catch (error) {
      console.log("Error al procesar el pago con PayPal", error);
      toast.error("Error al procesar el pago con PayPal");
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <div className="flex-grow mt-8 pb-8">
        <div className="container mx-auto px-4 lg:px-36">
          <div className="w-full md:w-1/2 mx-auto space-y-6">
            <Button variant="outline" className="w-full mb-4" onClick={() => router.back()}>
              Volver
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de la compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ul>
                    {cart.length > 0 ? (
                      cart.map((item: CartItem, index: number) => (
                        <li key={index} className="flex justify-between">
                          <span className="font-light">{item.name}</span>
                          <span className="font-bold">
                            {item.quantity} x ${item.price.toFixed(2)} = ${(
                              item.price * item.quantity
                            ).toFixed(2)}
                          </span>
                        </li>
                      ))
                    ) : (
                      <p>No hay productos en el carrito.</p>
                    )}
                  </ul>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold mt-4">
                      <p>Total</p>
                      <p className="font-bold">${total.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between font-bold mt-4">
                      <p>Saldo disponible</p>
                      <p className="font-bold">${saldo.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col space-y-4 w-full max-w-md mx-auto">
                    <Button className="w-full bg-[#2c2e2f] text-white" onClick={handlePayWithSaldo}>
                      Pagar con Saldo (${saldo.toFixed(2)})
                    </Button>

                    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
                      <PayPalButtons
                        createOrder={(_, actions) =>
                          actions.order.create({
                            intent: "CAPTURE",
                            purchase_units: [{ amount: { currency_code: "USD", value: total.toFixed(2) } }],
                          })
                        }
                        onApprove={(_, actions) => {
                          if (actions.order) {
                            return actions.order.capture().then(() => handlePayWithPayPal());
                          } else {
                            toast.error("Error en PayPal: order es undefined");
                            return Promise.resolve();
                          }
                        }}
                        onError={(err) => {
                          toast.error("Error en PayPal");
                          console.error("Error en PayPal", err);
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
};

export default PaypalPage;
