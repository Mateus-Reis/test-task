import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axiosInstance from "@/api/axiosConfig";
import { animated, useSpring } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const UserList: React.FC = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fade = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(50px)",
  });

  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/users?page=${page}`);
        setUsers((prevUsers) => [...prevUsers, ...response.data.users]);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const showMoreUsers = () => {
    if (page < totalPages) {
      setIsLoading(true);
      setPage(page + 1);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const pulseAnimation = useSpring({
    from: { scale: 1 },
    to: { scale: isLoading ? 1.1 : 1 },
    config: { duration: 300 },
  });

  return (
    <animated.div
      ref={ref}
      style={fade}
      id="usersList"
      className="w-full py-16 bg-[#F8F8F8] flex flex-col items-center"
    >
      <h2 className="text-3xl font-bold mb-8">Working with GET request</h2>
      {loading && <div className="text-center text-lg mb-4">Loading...</div>}
      <div className="flex flex-wrap justify-center gap-8">
        {users.map((user, index) => (
          <UserCard key={`${user.id}-${index}`} user={user} />
        ))}
      </div>
      {page < totalPages && (
        <animated.button
          onClick={showMoreUsers}
          style={pulseAnimation}
          className="mt-8 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors duration-300"
        >
          Show more
        </animated.button>
      )}
    </animated.div>
  );
};

export default UserList;
