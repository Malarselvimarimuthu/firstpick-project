import React, { useState } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import app from "../../firebase/firebaseConfig";  // Ensure you have your firebaseConfig set up here

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!name || !email || !message) {
      setError("Please fill out all required fields.");
      return;
    }

    const db = getFirestore(app);

    try {
      // Add contact form data to Firestore
      const docRef = doc(db, "contactFormSubmissions", email);  // Using email as doc ID for uniqueness
      await setDoc(docRef, {
        name,
        email,
        phone,
        message,
        timestamp: new Date().toISOString(),
      });

      setSuccess(true);  // Show success message
      setError("");  // Clear any previous errors
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error: any) {
      console.error("Error storing data:", error.message);
      setError("Error submitting your message. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row ">
      {/* Left side with image */}
      <div className="w-full md:w-1/2 bg-cover bg-center flex justify-center items-center bg-black">
        <img src="https://kotaielectronics.com/wp-content/uploads/2021/09/ecommerce-business-futuer-in-India.jpeg" />
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white shadow-md rounded-lg ">
        <div className="w-full max-w-md">
          <h1 className="text-[40px] text-gray-800">Contact Us</h1>
          <h4 className="text-gray-800 text-[20px]">We'd love to hear from you!</h4>
          <br />
          <form onSubmit={handleSubmit} className="mb-4">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">Your message has been submitted!</div>}

            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Phone Number (Optional)</label>
              <input
                type="text"
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea
                className="w-full border-b py-2 px-3 focus:outline-none focus:border-green-500 border-gray-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={2}
              />
            </div>

            <button
              type="submit"
              className="w-full text-white py-2 px-4 rounded bg-sky-500 hover:bg-sky-600 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
