import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

import * as jwt from 'jose';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  signOut: () => void;
  verifyToken: () => void;
}

interface AuthContextProps {
  children: ReactNode;
}

interface User {
  id: string;
  email: string;
  sector: string;
  name: string;
  group: 'admin' | 'user';
}

interface TokenPayload {
  email: string;
  sector: string;
  name: string;
  isAdmin: boolean;
  id: string;
}

interface Session {
  token: string;
  user: User | null;
}

const AuthContext = createContext({} as AuthContextType);

const PUBLIC_KEY =
  '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3POpb9/1PwBK9A3vBfXXTJuGhTMy8CreeFXEM19/WB6bLqhIXE7IzH40KNnfWnQn1twMshViJBN9eHAiYErnF5dJrzjWtIp9xrFhmquYvz/2RyeVflWXH/ZmfO1v15nF7tKjN3+WTM4rAY9wGsslGahvs6ET0rp2PG0PLJXXEvYNxHp1OpP21xrWepb3RXCxlCqARq//UNENgFyazpsx9Q/V15xvlmUT74mYOGMMEhy/Xw71SEMr/rOElXj2cGZ65fgeBl+vi7Fj/0Z7jk23Ka4iuaXxElys8cieok77KJrhwFoRae4cJgjY86SfYgipc5PwepOtu1S5k3NRtIEVAQIDAQAB-----END PUBLIC KEY-----';

export default function AuthProvider({ children }: AuthContextProps) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const tokenFromCookie = document.cookie;

    let token = tokenFromCookie
      ? tokenFromCookie.replace('@Biopark:token=', '')
      : signOut();

    if (token) {
      const ecPublicKey = await jwt.importSPKI(PUBLIC_KEY, 'RS256');

      try {
        const { payload }: any = await jwt.jwtVerify(token, ecPublicKey);

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const { email, sector, name, isAdmin, id } =
          payload as unknown as TokenPayload;

        setSession({
          token,
          user: {
            id,
            email,
            sector,
            name,
            group: isAdmin ? 'admin' : 'user',
          },
        });
      } catch (error) {
        console.log(error);

        signOut();
      }
    } else {
      console.log('error');

      signOut();
    }
  };

  const signOut = () => {
    // para deletar o cookie basta colocar uma session de expiração passada
    document.cookie = '@Biopark:token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

    setSession(null);
    window.open(import.meta.env.VITE_GDI_AUTH_URL, 'gdi');
  };

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, signOut, verifyToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
