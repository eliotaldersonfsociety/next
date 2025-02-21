"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// Definición del tipo de sesión de usuario, ahora con la propiedad avatar opcional
export type UserSession = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  isOnline: boolean;
  isAdmin?: boolean; // Añadir la propiedad isAdmin
  avatar?: string; // Propiedad para el avatar (opcional)
};

// Definición del contexto, incluyendo la sesión, el token, el estado de carga y funciones para actualizar la sesión
type SessionContextType = {
  session: UserSession | null;
  token: string | null;
  sessionLoading: boolean;
  setUserSession: (user: UserSession, token: string) => void;
  clearUserSession: () => void;
  updateAvatar: (avatarUrl: string) => void;
};

// Se crea el contexto
const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Al iniciar la aplicación, recuperamos la sesión, el token y el avatar desde las cookies (si existen)
  useEffect(() => {
    const savedSession = Cookies.get("session");
    const savedToken = Cookies.get("token");
    const savedAvatar = Cookies.get("avatar"); // Cookie para el avatar
    if (savedSession) {
      const parsedSession: UserSession = JSON.parse(savedSession);
      // Si existe un avatar guardado y el objeto de sesión no lo tiene, lo asignamos
      if (savedAvatar && !parsedSession.avatar) {
        parsedSession.avatar = savedAvatar;
      }
      setSession(parsedSession);
    }
    if (savedToken) {
      setToken(savedToken);
    }
    setSessionLoading(false);
  }, []);

  // Guardamos la sesión en las cookies cada vez que cambie
  useEffect(() => {
    if (session) {
      Cookies.set("session", JSON.stringify(session), { expires: 7 });
    } else {
      Cookies.remove("session");
    }
  }, [session]);

  // Guardamos el token en las cookies cada vez que cambie
  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { expires: 7 });
    } else {
      Cookies.remove("token");
    }
  }, [token]);

    // Función para establecer la sesión. Si el objeto no tiene avatar, se revisa la cookie "avatar"
    const setUserSession = (user: UserSession, token: string) => {
      const savedAvatar = Cookies.get("avatar");
      if (!user.avatar && savedAvatar) {
        user.avatar = savedAvatar;
      }
      setSession(user);
      setToken(token);
      if (user.avatar) {
        // Guardamos el avatar en la cookie por 10 años (aprox. 3650 días)
        Cookies.set("avatar", user.avatar, { expires: 3650 });
      }
    };  

  // Función para actualizar únicamente el avatar del usuario
  const updateAvatar = (avatarUrl: string) => {
    if (session) {
      const updatedSession = { ...session, avatar: avatarUrl };
      setSession(updatedSession);
      // Guardamos el avatar en una cookie con expiración a 10 años
      Cookies.set("avatar", avatarUrl, { expires: 3650 });
    }
  };

  // Función para limpiar la sesión y eliminar la cookie de sesión y token, pero NO la cookie del avatar
  const clearUserSession = () => {
    setSession(null);
    setToken(null);
    Cookies.remove("session");
    Cookies.remove("token");
    // Nota: La cookie "avatar" no se elimina para mantener el avatar elegido durante mucho tiempo.
  };

  return (
    <SessionContext.Provider
      value={{ session, token, sessionLoading, setUserSession, clearUserSession, updateAvatar }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe usarse dentro de un SessionProvider");
  }
  return context;
};
