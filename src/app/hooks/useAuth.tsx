import { AuthContext, AuthContextModel } from "@/auth/AuthContext";
import { useContext } from "react";

export const useAuth = (): AuthContextModel => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };