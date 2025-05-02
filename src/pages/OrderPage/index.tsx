import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebase/firebaseConfig';
import Lottie from 'lottie-react';
import noOrders from '../../assets/images/noOrders.json';
import { 
    MdPending, 
    MdLocalShipping, 
    MdDoneAll, 
    MdCancel 
  } from 'react-icons/md';

 
const firestore = getFirestore(app);
const auth = getAuth(app);


interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  mainImage: string; // Assuming this is the image URL
}

interface BillingDetails {
  fullName: string;
  email: string;
  address: string;
  phoneNumber: string;
  postalCode: string;
  landmark: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: Timestamp;
  userId: string;
  billingDetails: BillingDetails;
}



const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      if (!auth.currentUser) return;
      
      try {
        const userId = auth.currentUser.uid;
        const ordersRef = collection(firestore, 'orders');
        const q = query(ordersRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: Order['status']): string => {
    const statusColors = {
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (timestamp: Timestamp): string => {
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-[30rem] h-[30rem]">
          <Lottie animationData={noOrders} loop={true} />
        </div>
        <p className="text-gray-600 text-lg mt-4">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="bg-blue-50 rounded-xl shadow-xl border-2 border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 relative"
          >
            {/* Order Content */}
            <div className={`transition-opacity duration-300 ${selectedOrder === order.id ? 'opacity-0' : 'opacity-100'}`}>
              {/* Order Summary Section */}
              <div className="flex flex-col mb-6 border-b-2 border-gray-100 pb-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-gray-700 font-medium text-lg">
                    {formatDate(order.createdAt)}
                  </span>
                  <p className="text-2xl font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                </div>
                
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 self-start border ${getStatusColor(order.status)} shadow-sm`}>
                  {order.status === 'pending' && <MdPending className="w-4 h-4" />}
                  {order.status === 'shipped' && <MdLocalShipping className="w-4 h-4" />}
                  {order.status === 'delivered' && <MdDoneAll className="w-4 h-4" />}
                  {order.status === 'cancelled' && <MdCancel className="w-4 h-4" />}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>   
                
                <p className="text-gray-800 font-semibold mt-4 text-lg">
                  Shipping to: <span className="text-gray-900">{order.billingDetails.fullName}</span>
                </p>
              </div>
  
              {/* Items Section */}
              <div className="space-y-4 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50">
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900 text-md">{item.name}</h3>
                      <p className="text-gray-600 text-md mt-1">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-md ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
  
              {/* View Details Button */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-gray-100">
                <button
                  onClick={() => setSelectedOrder(order.id)}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 shadow-sm"
                >
                  <span>View Details</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {order.status === 'shipped' && (
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm shadow-sm border border-blue-100">
                    Track Package
                  </button>
                )}
              </div>
            </div>
  
            {/* Billing Details Overlay */}
            {selectedOrder === order.id && (
              <div className="absolute inset-0 bg-white rounded-xl p-6 animate-fade-in border-2 border-gray-200 shadow-lg">
                <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
                  <h3 className="font-bold text-gray-900 text-xl">Billing Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 shadow-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Order</span>
                  </button>
                </div>
  
                <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[calc(100%-4rem)]">
                  {[
                    { label: 'Full Name', value: order.billingDetails.fullName },
                    { label: 'Email', value: order.billingDetails.email },
                    { label: 'Phone Number', value: order.billingDetails.phoneNumber },
                    { label: 'Postal Code', value: order.billingDetails.postalCode },
                    { label: 'Address', value: order.billingDetails.address },
                    { label: 'Landmark', value: order.billingDetails.landmark }
                  ].map((detail, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-sm text-gray-600 mb-1">{detail.label}</p>
                      <p className="font-semibold text-gray-900 text-lg">{detail.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersTable;