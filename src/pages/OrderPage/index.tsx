import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const firestore = getFirestore(app);
const auth = getAuth(app);

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    totalAmount: number;
    status: string;
}

interface BillingDetails {
    address: string;
    email: string;
    fullName: string;
    landmark: string;
    phoneNumber: string;
    postalCode: string;
}

interface OrderData {
    id: string;
    userId: string;
    items: OrderItem[];
    billingDetails: BillingDetails;
    createdAt: Date;
}

function Orders() {
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.log('No user logged in');
            setLoading(false);
            return;
        }

        const userId = auth.currentUser.uid;

        try {
            const ordersRef = collection(firestore, 'orders');
            const q = query(ordersRef, where('userId', '==', userId));
            const querySnapshot = await getDocs(q);

            const fetchedOrders: OrderData[] = querySnapshot.docs.map(docSnap => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    userId: data.userId,
                    items: data.items || [],
                    billingDetails: data.billingDetails || {
                        address: '',
                        email: '',
                        fullName: '',
                        landmark: '',
                        phoneNumber: '',
                        postalCode: ''
                    },
                    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date()
                };
            });

            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading your orders...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Your Order Details</h2>

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                        {order.billingDetails && (
                            <div style={{ marginBottom: '20px' }}>
                                <h3>Billing Information</h3>
                                <p><strong>Name:</strong> {order.billingDetails.fullName}</p>
                                <p><strong>Email:</strong> {order.billingDetails.email}</p>
                                <p><strong>Phone Number:</strong> {order.billingDetails.phoneNumber}</p>
                                <p><strong>Address:</strong> {order.billingDetails.address}</p>
                                <p><strong>Landmark:</strong> {order.billingDetails.landmark}</p>
                                <p><strong>Postal Code:</strong> {order.billingDetails.postalCode}</p>
                                <p><strong>Order Date:</strong> {order.createdAt.toLocaleString()}</p>
                            </div>
                        )}

                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Product Name</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Total Amount</th>
                                    <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{item.name}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>₹{item.price}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{item.quantity}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>₹{item.totalAmount}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ marginTop: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                            Grand Total: ₹{order.items.reduce((acc, item) => acc + item.totalAmount, 0)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Orders;
