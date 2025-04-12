
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsCart2 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import {
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import logo from "../../assets/images/Logo.png";
import "./index.css";

interface Product {
  id: string;
  name: string;
  category: string;
}

const Header = ({  }: { }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<null | { name: string }>(null); // Store user data if logged in
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    // console.log(userData);
    if (userData) {
      setUser(JSON.parse(userData)); // Parse and set user data
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleCartClick = () => {
    navigate("/cart"); // Redirect to the Cart page
  };

  const handleSignInOrAccountClick = () => {
    if (user) {
      navigate("/profile"); // Redirect to the Account page
    } else {
      navigate("/login"); // Redirect to the Sign In page
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    const dropdown = document.getElementById("dropdownMenu");
    const button = document.getElementById("dropdownButton");
    if (
      dropdown &&
      button &&
      !dropdown.contains(event.target as Node) &&
      !button.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-sky-500 fixed w-full z-50">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 md:px-8 lg:px-20">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-20 sm:w-24 lg:w-40 h-28" />
        </div>

        {/* Search */}
        <div className="flex flex-1 justify-center px-4">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full rounded-full px-4 py-2 pl-10 text-gray-900 focus:outline-none font-sans custom-placeholder"
            />
            <MagnifyingGlassIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            className="font-semibold flex items-center px-2 sm:px-4 py-1 rounded text-white font-sans"
            onClick={handleCartClick}
          >
            <BsCart2
              className="h-6 w-6 sm:h-6 sm:w-6 mr-1 sm:mr-2"
              style={{ strokeWidth: 0.5 }}
            />
            <span className="hidden sm:inline">Cart</span>
          </button>

          <button
            className="flex font-semibold items-center px-2 sm:px-4 py-1 rounded text-white font-sans"
            onClick={handleSignInOrAccountClick}
          >
            <FaRegUser className="h-5 w-5 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">
              {user ? "Account" : "Sign In"}
            </span>
          </button>

          <button
            id="dropdownButton"
            onClick={toggleDropdown}
            className="flex items-center rounded text-white font-sans p-2"
          >
            <EllipsisVerticalIcon className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        id="dropdownMenu"
        className={`absolute right-4 mt-2 w-48 bg-white shadow-lg rounded-md text-gray-900 z-10 transition-all duration-500 ease-in-out transform ${
          isDropdownVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-5 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <ul className="py-1 bg-gray-100">
          <li>
            <a
              href="/profile"
              className="block px-4 py-2 text-sm md:text-base hover:bg-gray-200 transition-colors"
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="/signup"
              className="block px-4 py-2 text-sm md:text-base hover:bg-gray-200 transition-colors"
            >
              Contact
            </a>
          </li>
          <li>
            <a
              href="/billing"
              className="block px-4 py-2 text-sm md:text-base hover:bg-gray-200 transition-colors"
            >
              Order
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
