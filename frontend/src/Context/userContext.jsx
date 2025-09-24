// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { userApi } from "../Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    fetchUser();
  }, []);

    const fetchUser = async () => {
      try {
        const res = await axios.get(userApi.me, { withCredentials: true },);
      
        setUser(res.data.data || null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

  


  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
