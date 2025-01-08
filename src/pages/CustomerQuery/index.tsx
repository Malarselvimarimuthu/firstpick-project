import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import app from "../../firebase/firebaseConfig"; // Ensure you have your firebaseConfig set up here

const ContactFormSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(app);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "contactFormSubmissions"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
      setLoading(false);
    };

    fetchSubmissions();
  }, [db]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "contactFormSubmissions", id));
      setSubmissions((prev) => prev.filter((submission) => submission.id !== id));
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  return (
    <div className="container mx-auto my-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Contact Form Submissions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">Phone</th>
                <th className="border border-gray-300 px-4 py-2">Message</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{submission.name}</td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{submission.email}</td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{submission.phone || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2 whitespace-pre-line">{submission.message}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(submission.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactFormSubmissions;
