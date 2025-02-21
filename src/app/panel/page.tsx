"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSession } from "../pages/context/SessionContext";
import { DollarSign } from "lucide-react";
import Footer from "../pages/footer";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Header from "../pages/Header";
import AvatarSelector from "../pages/AvatarSelector"; // Componente para seleccionar avatar❤️

interface PurchasedProduct {
  items: string | { name: string; image: string }[];
  total_amount: number;
  created_at: string;
}

interface User {
  email: string;
  saldo: number;
}

export default function UserDashboardWithAvatar() {
  const { session, token, clearUserSession, sessionLoading } = useSession();
  const router = useRouter();
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [saldo, setSaldo] = useState<number>(0);
  const [showDollarIcon, setShowDollarIcon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // Paginación: 10 compras por página
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Alterna el ícono cada 3 segundos (solo visual)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowDollarIcon((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Verifica la sesión y redirige si no hay usuario autenticado
  useEffect(() => {
    if (!sessionLoading) {
      if (!session || !session.isOnline) {
        router.push("/");
      } else {
        setLoading(false);
      }
    }
  }, [session, sessionLoading, router]);

  // Función auxiliar para parsear los items (en caso de que vengan como cadena JSON)
  const getParsedItems = (
    rawItems: string | { name: string; image: string }[]
  ): { name: string; image: string }[] => {
    if (typeof rawItems === "string") {
      try {
        return JSON.parse(rawItems);
      } catch (error) {
        console.error("Error al parsear items:", error);
        return [];
      }
    } else if (Array.isArray(rawItems)) {
      return rawItems;
    } else {
      return [];
    }
  };

  // Obtener saldo desde la API usando el token del contexto
  useEffect(() => {
    const fetchSaldo = async () => {
      if (!token) {
        console.error("Token no encontrado en el contexto");
        toast.error("Token no encontrado");
        return;
      }
      try {
        console.log("Token que se está enviando:", token); // Verificar el valor del token
        const res = await fetch("https://aaa-eight-beta.vercel.app/api/v1/user/saldo", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Respuesta del servidor:", res.status, res.statusText);
        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Error al obtener el saldo: ${res.status} - ${res.statusText}`, errorText);
          throw new Error(`No se pudo obtener el saldo: ${res.status} - ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Saldo obtenido:", data.saldo);
        setSaldo(data.saldo);
      } catch (error) {
        console.error("Error al obtener el saldo:", error);
        toast.error("Error al obtener el saldo");
      }
    };
    if (token) {
      fetchSaldo();
    }
  }, [token]);

  // Obtener compras del usuario (endpoint protegido)
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch("https://aaa-eight-beta.vercel.app/api/v1/purchases", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 401) {
          clearUserSession();
          router.push("/");
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch purchases");
        const data = await response.json();
        console.log("Fetched purchases:", data.purchases); // Verifica los datos recibidos
        setPurchasedProducts(data.purchases || []);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };
    if (session?.isOnline) {
      fetchPurchases();
    }
  }, [session, token, router, clearUserSession]);

  // Obtener todos los usuarios registrados
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://aaa-eight-beta.vercel.app/api/v1/users", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (session?.isOnline) {
      fetchUsers();
    }
  }, [session, token]);

  // Ordenar las compras de forma descendente:
  // La compra con la fecha más reciente (mayor timestamp) quedará en la posición 0
  const sortedPurchases = [...purchasedProducts].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });

  console.log("Sorted purchases:", sortedPurchases); // Verifica las compras ordenadas

  // La "Última Compra" (en el sentido de la compra más reciente) se toma del primer elemento
  const mostRecentPurchase = sortedPurchases[0];

  // Paginación: calcular número total de páginas
  const totalPages = Math.ceil(sortedPurchases.length / itemsPerPage) || 1;

  // Si la página actual es mayor que el total de páginas, reajustarla
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [sortedPurchases, currentPage, totalPages]);

  // Extraer las compras a mostrar en la página actual
  const displayedPurchases = sortedPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Redirigir a WhatsApp para agregar saldo
  const redirectToWhatsApp = () => {
    const phoneNumber = "1234567890";
    const message = "Hola, quiero agregar saldo a mi cuenta.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    clearUserSession();
    router.push("/");
  };

  // Función para modificar el saldo de un usuario
  const updateUserSaldo = async (email: string, newSaldo: number) => {
    try {
      const response = await fetch("https://aaa-eight-beta.vercel.app/api/v1/user/saldo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, saldo: newSaldo }),
      });
      if (!response.ok) throw new Error("Failed to update saldo");
      const data = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.email === email ? { ...user, saldo: newSaldo } : user))
      );
      toast.success("Saldo actualizado con éxito");
    } catch (error) {
      console.error("Error updating saldo:", error);
      toast.error("Error al actualizar el saldo");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!session || !session.isOnline) {
    return <div>Redirigiendo al inicio de sesión...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 lg:px-36">
        {/* Componente para seleccionar avatar */}
        <AvatarSelector />

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{session.name}</h1>
          <div className="flex items-center gap-2">
            <Badge
              className="cursor-pointer bg-green-500 hover:bg-green-600"
              onClick={redirectToWhatsApp}
            >
              {showDollarIcon && <DollarSign className="h-4 w-4" />}
            </Badge>
            <Badge
              className="cursor-pointer bg-red-500 hover:bg-red-600"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {/* Tarjeta de estado de la cuenta */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">Usuario: {session.lastname}</p>
              <Badge className="mt-2 text-lg">Activa</Badge>
            </CardContent>
          </Card>

          {/* Tarjeta "Última Compra" que muestra la compra más reciente */}
          {mostRecentPurchase && (
            <Card>
              <CardHeader>
                <CardTitle>Última Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">
                  {(() => {
                    try {
                      const items = getParsedItems(mostRecentPurchase.items);
                      const productNames = items.map((item: { name: string }) => item.name);
                      return productNames.join(", ");
                    } catch (error) {
                      console.error("Error al parsear items:", error);
                      return "Error al cargar los productos";
                    }
                  })()}
                </p>
                <p>${mostRecentPurchase.total_amount.toFixed(2)}</p>
                {(() => {
                  try {
                    const items = getParsedItems(mostRecentPurchase.items);
                    const firstItem = items[0];
                    return firstItem ? (
                      <Image
                        src={firstItem.image}
                        alt={firstItem.name}
                        width={80}
                        height={80}
                        unoptimized
                        className="object-cover rounded"
                      />
                    ) : (
                      "Sin imagen"
                    );
                  } catch (error) {
                    console.error("Error al obtener imagen:", error);
                    return "Error al cargar la imagen";
                  }
                })()}
              </CardContent>
            </Card>
          )}

          {/* Tarjeta de saldo */}
          <Card>
            <CardHeader>
              <CardTitle>Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">Saldo: ${saldo}</p>
            </CardContent>
          </Card>
        </div>

        {/* Historial de Compras */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Productos</TableHead>
                  <TableHead>Monto Total</TableHead>
                  <TableHead>Imagen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPurchases.length > 0 ? (
                  displayedPurchases.map((purchase, index) => (
                    <TableRow
                      key={index}
                      // En la primera página, la primera fila es la compra más reciente
                      className={index === 0 && currentPage === 1 ? "bg-green-100" : ""}
                    >
                      <TableCell>
                        {(() => {
                          try {
                            const items = getParsedItems(purchase.items);
                            const productNames = items.map((item: { name: string }) => item.name);
                            return productNames.join(", ");
                          } catch (error) {
                            console.error("Error al parsear items:", error);
                            return "Error al cargar los productos";
                          }
                        })()}
                      </TableCell>
                      <TableCell>${purchase.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {(() => {
                          try {
                            const items = getParsedItems(purchase.items);
                            const firstItem = items[0];
                            return firstItem ? (
                              <Image
                                src={firstItem.image}
                                alt={firstItem.name}
                                width={64}
                                height={64}
                                unoptimized
                                className="object-cover rounded"
                              />
                            ) : (
                              "Sin imagen"
                            );
                          } catch (error) {
                            console.error("Error al obtener imagen:", error);
                            return "Error";
                          }
                        })()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No hay compras registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-black"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabla de Usuarios Registrados */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Usuarios Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Saldo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>${user.saldo.toFixed(2)}</TableCell>
                    <TableCell>
                      <input
                        type="number"
                        placeholder="Nuevo saldo"
                        onBlur={(e) => updateUserSaldo(user.email, parseFloat(e.target.value))}
                        className="border p-1 rounded"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
