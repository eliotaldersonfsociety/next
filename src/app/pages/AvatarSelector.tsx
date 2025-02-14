"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useSession } from "../pages/context/SessionContext";

// Hook para detectar cambios en el media query
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  
  return matches;
}

const AvatarSelector = () => {
  const { session, updateAvatar } = useSession();

  // Opciones de avatar (asegúrate de que estas imágenes existan en tu carpeta public)
  const avatarOptions = useMemo(() => [
    "/avatar1.png",
    "/avatar2.png",
    "/avatar3.png",
    "/avatar4.png",
    "/avatar5.png",
    "/avatar6.png",
    "/avatar7.png",
    "/avatar8.png",
  ], []);

  // Estado para el avatar seleccionado. Se inicializa con el avatar guardado en sesión (o el primero si no hay)
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    session?.avatar || avatarOptions[0]
  );

  // Para la versión mobile, usamos un índice para el carrusel
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    const idx = avatarOptions.findIndex((url) => url === selectedAvatar);
    return idx >= 0 ? idx : 0;
  });

  // Detectamos si estamos en desktop (por ejemplo, min-width de 768px)
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Actualizamos el avatar seleccionado cuando cambie la selección en mobile
  useEffect(() => {
    if (!isDesktop) {
      setSelectedAvatar(avatarOptions[selectedIndex]);
    }
  }, [selectedIndex, isDesktop, avatarOptions]);

  // Si el avatar guardado en la sesión cambia (por ejemplo, luego de guardarlo), actualizamos la selección
  useEffect(() => {
    if (session?.avatar) {
      setSelectedAvatar(session.avatar);
      const index = avatarOptions.findIndex((url) => url === session.avatar);
      if (index >= 0) {
        setSelectedIndex(index);
      }
    }
  }, [session?.avatar, avatarOptions]);

  const handleSaveAvatar = () => {
    if (selectedAvatar) {
      updateAvatar(selectedAvatar);
      toast.success("Avatar guardado");
    } else {
      toast.error("Por favor, selecciona un avatar.");
    }
  };

  // Handlers para el carrusel en mobile
  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % avatarOptions.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? avatarOptions.length - 1 : prevIndex - 1
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Escoge tu avatar</CardTitle>
      </CardHeader>
      <CardContent>
        {isDesktop ? (
          // Versión Desktop: Mostrar todos los avatares en un grid
          <div className="grid grid-cols-4 gap-4">
            {avatarOptions.map((avatar, index) => (
              <div
                key={index}
                onClick={() => setSelectedAvatar(avatar)}
                className={`cursor-pointer border rounded p-2 hover:shadow-lg ${
                  selectedAvatar === avatar ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <Image
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  width={80}
                  height={80}
                  unoptimized
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        ) : (
          // Versión Mobile: Mostrar carrusel con botones de navegación
          <div className="flex items-center justify-center space-x-4">
            <Button onClick={handlePrev} variant="outline">
              {"<"}
            </Button>
            <div className="relative w-40 h-40">
              <Image
                src={selectedAvatar}
                alt="Avatar seleccionado"
                fill
                sizes="150px"
                unoptimized
                className="object-cover rounded"
              />
            </div>
            <Button onClick={handleNext} variant="outline">
              {">"}
            </Button>
          </div>
        )}

        {/* Mostrar el botón "Guardar Avatar" solo si la selección es diferente al avatar guardado en la sesión */}
        {selectedAvatar !== session?.avatar && (
          <div className="mt-4 text-center">
            <Button onClick={handleSaveAvatar}>Guardar Avatar</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvatarSelector;
