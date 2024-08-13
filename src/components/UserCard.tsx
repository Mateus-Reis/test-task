import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  photo: string;
}

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center flex flex-col justify-between h-[400px] w-[300px] transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl">
      <img
        src={user.photo}
        alt={user.name}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <div className="flex flex-col flex-grow">
        <h2 className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">
          {user.name}
        </h2>
        <p className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
          {user.position}
        </p>
        <p className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
          {user.email}
        </p>
        <p className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
          {user.phone}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
