import React from "react";
import { LogoHeaderIcon } from "@/icons/Icon";

const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center w-full fixed top-0 left-0 z-50">
      <div className="flex items-center">
        <button
          onClick={() => scrollToSection("presentation")}
          aria-label="Go to presentation"
        >
          <LogoHeaderIcon name="logo" width="40" height="40" className="mr-2" />
        </button>
      </div>
      <nav className="flex space-x-4">
        <button
          onClick={() => scrollToSection("usersList")}
          className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors duration-300"
        >
          Users
        </button>
        <button
          onClick={() => scrollToSection("signup")}
          className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition-colors duration-300"
        >
          Sign Up
        </button>
      </nav>
    </header>
  );
};

export default Header;
