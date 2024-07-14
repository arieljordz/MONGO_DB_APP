import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // Initialize auth state with isAuthenticated property
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    // You can include other properties like user details, tokens, etc.
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
