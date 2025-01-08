
import React, { useState } from "react";

const BillingFormPage: React.FC = () => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/.test(event.key) && event.key !== "Backspace" && event.key !== "Tab") {
      event.preventDefault();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full shadow-xl p-6 lg:p-24 space-y-6 lg:space-y-0 mt-16 sm:mt-2">
      {/* Billing Form */}
      <div className="w-full lg:w-1/2 bg-gray-200 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-black mb-6">Billing Form</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Full Name</label>
            <input
              type="text"
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Phone Number</label>
            <input
              type="text"
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter your phone number"
              onKeyDown={handleKeyDown}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Address</label>
            <textarea
              className="mt-1 block w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              rows={4}
              placeholder="Enter your address"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Landmark</label>
            <input
              type="text"
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter the landmark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Postal Code</label>
            <input
              type="text"
              className="mt-1 block h-10 w-full pl-3 border-black rounded-md shadow-sm focus:ring-black focus:border-black"
              placeholder="Enter your postal code"
              required
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              className="w-1/3 bg-red-400 text-black py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/3 bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Information Cards */}
      {/* Information Cards */}
      <div className="w-full p-6 flex flex-col space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* First Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-black w-full flex items-start space-x-4">
            <div className="text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V7.618a1 1 0 01.553-.894L9 4m0 0l5.447 2.724A1 1 0 0115 7.618v8.764a1 1 0 01-.553.894L9 20m0-16v16"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Free Delivery</h3>
              <p className="text-sm text-black mt-2">
                Enjoy free delivery on all orders above $50 and within a 20 km radius.
              </p>
            </div>
          </div>

          {/* Second Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-black flex items-start space-x-4">
            <div className="text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Easy Returns</h3>
              <p className="text-sm text-black mt-2">
                Hassle-free returns within 30 days of purchase. Customer satisfaction guaranteed for orders over $30 within 50 km.
              </p>
            </div>
          </div>

          {/* Third Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-black flex items-start space-x-4">
            <div className="text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h11M9 21V3m-6 6a6 6 0 0112 0v5a6 6 0 01-12 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">Top Quality Products</h3>
              <p className="text-sm text-black mt-2">
                We ensure the highest quality standards for all our products. Shop with confidence.
              </p>
            </div>
          </div>

        </div>
      </div>


    </div>
  );
};

export default BillingFormPage;
