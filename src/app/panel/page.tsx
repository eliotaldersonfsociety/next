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
import AvatarSelector from "../pages/AvatarSelector";

interface PurchasedProduct {
  id: string;
  items: string | { name: string; image: string }[];
  total_amount: number;
  address: string;
  buyer: string;
}

interface User {
  email: string;
  saldo: number;
}

//asi

export default function UserDashboardWithAvatar() {
  const { session, token, clearUserSession, sessionLoading } = useSession();
  const router = useRouter();
  const [saldo, setSaldo] = useState<number>(0);
  const [showDollarIcon, setShowDollarIcon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [purchasedProducts, setPurchasedProducts] = useState<PurchasedProduct[]>([]);
  const [mostRecentPurchase, setMostRecentPurchase] = useState<PurchasedProduct | null>(null);
  const [inputSaldo, setInputSaldo] = useState<{ [key: string]: number | string }>({});
  const [searchEmail, setSearchEmail] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchasedProduct | null>(null);
  const itemsPerPage = 10;

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPurchasePages = Math.ceil(purchasedProducts.length / itemsPerPage) || 1;
  const displayedPurchases = purchasedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setShowDollarIcon((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sessionLoading) {
      if (!session || !session.isOnline) {
        router.push("/");
      } else {
        setLoading(false);
      }
    }
  }, [session, sessionLoading, router]);

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

  useEffect(() => {
    const fetchSaldo = async () => {
      if (!token) {
        console.error("Token no encontrado en el contexto");
        toast.error("Token no encontrado");
        return;
      }
      try {
        const res = await fetch("https://aaa-eight-beta.vercel.app/api/v1/user/saldo", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Error al obtener el saldo: ${res.status} - ${res.statusText}`, errorText);
          throw new Error(`No se pudo obtener el saldo: ${res.status} - ${res.statusText}`);
        }
        const data = await res.json();
        setSaldo(data.saldo);
        console.log("Datos obtenidos:", data);
      } catch (error) {
        console.error("Error al obtener el saldo:", error);
        toast.error("Error al obtener el saldo");
      }
    };
    if (token) {
      fetchSaldo();
    }
  }, [token]);

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
        setPurchasedProducts(data.purchases || []);
        setMostRecentPurchase(data.purchases[0] || null);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };
    if (session?.isOnline) {
      fetchPurchases();
    }
  }, [session, token, router, clearUserSession]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://aaa-eight-beta.vercel.app/api/v1/user/recargar", {
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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const redirectToWhatsApp = () => {
    const phoneNumber = "1234567890";
    const message = "Hola, quiero agregar saldo a mi cuenta.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleLogout = () => {
    clearUserSession();
    router.push("/");
  };

  const updateUserSaldo = async (email: string, newSaldo: number) => {
    try {
      const response = await fetch("https://aaa-eight-beta.vercel.app/api/v1/user/updateSaldo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, saldo: newSaldo }),
      });
      if (!response.ok) throw new Error("Failed to update saldo");
      const data = await response.json();
      console.log("Datos obtenidos:", data);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.email === email ? { ...user, saldo: newSaldo } : user))
      );
      toast.success("Saldo actualizado con éxito");
    } catch (error) {
      console.error("Error updating saldo:", error);
      toast.error("Error al actualizar el saldo");
    }
  };

  const handleSaldoChange = (email: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newSaldo = parseFloat(e.target.value);
    setInputSaldo((prev) => ({ ...prev, [email]: newSaldo }));
  };

  const handleRecargarSaldo = async (user: User) => {
    const saldoAIncrementar = Number(inputSaldo[user.email]) || 0;
    await updateUserSaldo(user.email, saldoAIncrementar);
    setInputSaldo((prev) => ({ ...prev, [user.email]: '' }));
    toast.success("Saldo actualizado con éxito");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (!session || !session.isOnline) {
    return <div>Redirigiendo al inicio de sesión...</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6 lg:px-36">
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
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">Usuario: {session.lastname}</p>
              <Badge className="mt-2 text-lg">Activa</Badge>
            </CardContent>
          </Card>

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

          <Card>
            <CardHeader>
              <CardTitle>Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">Saldo: ${saldo}</p>
            </CardContent>
          </Card>
        </div>

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
                      onClick={() => setSelectedPurchase(purchase)}
                      className={`cursor-pointer ${index === 0 && currentPage === 1 ? "bg-green-100" : ""}`}
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
            {totalPurchasePages > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPurchasePages }, (_, index) => (
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

        {selectedPurchase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-xl font-bold mb-4">Detalles de la Compra</h2>
              <p><strong>ID:</strong> {selectedPurchase.id}</p>
              <p><strong>Comprador:</strong> {selectedPurchase.buyer}</p>
              <p><strong>Dirección:</strong> {selectedPurchase.address}</p>
              <p><strong>Total:</strong> ${selectedPurchase.total_amount.toFixed(2)}</p>
              <p><strong>Productos:</strong></p>
              <ul>
                {getParsedItems(selectedPurchase.items).map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPurchase(null)}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Usuarios Registrados</CardTitle>
          </CardHeader>
          <div className="mb-6 flex justify-between items-center pl-4">
            <input
              type="text"
              placeholder="Buscar por email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
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
                {displayedUsers.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>${user.saldo.toFixed(2)}</TableCell>
                    <TableCell>
                      <input
                        type="number"
                        placeholder="Nuevo saldo"
                        value={inputSaldo[user.email] || ''}
                        onChange={(e) => handleSaldoChange(user.email, e)}
                        className="border p-1 rounded"
                      />
                      <button
                        onClick={() => handleRecargarSaldo(user)}
                        className="ml-2 p-2 bg-blue-500 text-white rounded"
                      >
                        Recargar Saldo
                      </button>
                      <div className="mt-2 text-sm text-gray-600">
                        Saldo final: $
                        {(user.saldo + (parseFloat(inputSaldo[user.email] as string) || 0).toFixed(2)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
