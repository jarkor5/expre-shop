import React, { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


type AuthContextType = {
  token: string | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthProviderProps = React.PropsWithChildren<{}>;

const AuthContext = createContext<AuthContextType>({
  token: null,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC <AuthProviderProps>= ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  const signIn = async (newToken: string) => {
    setToken(newToken);
    await AsyncStorage.setItem("access_token", newToken);
  };

  const signOut = async () => {
    setToken(null);
    await AsyncStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
