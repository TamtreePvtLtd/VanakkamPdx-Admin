import { useContext } from "react";
import { useState, createContext } from "react";
import { IAuthContext, IUser } from "../interface/customer";

const AuthContext = createContext<IAuthContext>({
  user: null,
  updateUserData: () => {},
});

function AuthProvider({ children }) {
  const [user, setUser] = useState<IUser | null>(null);

  const updateUserData = (user: IUser | null) => {
    if (user) {
      setUser({
        ...user,
      });
    } else {
      setUser(null);
    }
  };

  const contextValue: IAuthContext = {
    user,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext<IAuthContext>(AuthContext);
  return context;
}

export default AuthProvider;
