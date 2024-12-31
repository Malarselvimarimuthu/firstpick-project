

import React, { useState } from 'react';
import { MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import logo from '../../assets/images/Logo.png';
import './App.css';  // Import custom CSS (or add this style in your global CSS file)

const Header: React.FC = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const dropdown = document.getElementById('dropdownMenu');
    const button = document.getElementById('dropdownButton');
    if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
      setDropdownVisible(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-customBlue">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:px-8 lg:px-20">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-20 sm:w-24 md:w-30 lg:w-40 h-32"
          />
        </div>

        {/* Search Bar */}
        {/* <div className="flex flex-1 justify-center px-4">
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full px-4 py-2 pl-10 text-gray-900 focus:outline-none font-sans hidden sm:placeholder"
            />
            <MagnifyingGlassIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div> */}

<div className="flex flex-1 justify-center px-4">
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-full px-4 py-2 pl-10 text-gray-900 focus:outline-none font-sans custom-placeholder"
        />
        <MagnifyingGlassIcon className="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
      </div>
    </div>


       

        {/* User Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="bg-blue-500 font-semibold flex items-center px-2 sm:px-4 py-1 rounded text-white hover:bg-blue-600 font-sans">
            <ShoppingCartIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Cart</span>
          </button>

          <button className="bg-blue-500 flex font-semibold items-center px-2 sm:px-4 py-1 rounded text-white hover:bg-blue-600 font-sans">
            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Sign In</span>
          </button>

          <button
            id="dropdownButton"
            onClick={toggleDropdown}
            className="bg-blue-500 flex items-center rounded text-white hover:bg-blue-600 font-sans p-2"
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
            ? 'translate-y-0 opacity-100 scale-100'
            : '-translate-y-5 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <ul className="py-1 bg-lightgray">
          <li>
            <a
              href="/contact"
              className="block px-4 py-2 text-sm md:text-base hover:bg-gray1 transition-colors"
            >
              Contact
            </a>
          </li>
          <li>
            <a
              href="/order"
              className="block px-4 py-2 text-sm md:text-base hover:bg-gray1 transition-colors"
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
