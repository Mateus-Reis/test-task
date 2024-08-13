import axiosInstance from "@/api/axiosConfig";
import { useEffect, useState } from "react";

export const useToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchToken = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/token");
      setToken(response.data.token);
    } catch (error) {
      console.error("Error fetching token:", error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  return { token, loading, fetchToken };
};
