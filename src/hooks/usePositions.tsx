import axiosInstance from "@/api/axiosConfig";
import { useEffect, useState } from "react";

interface Position {
  id: number;
  name: string;
}

export const usePositions = () => {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axiosInstance.get("/positions");
        setPositions(response.data.positions);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, []);

  return positions;
};
