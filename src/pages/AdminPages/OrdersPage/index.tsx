import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MdCancel, MdDoneAll, MdEdit, MdLocalShipping, MdPending, MdSearch, MdFileDownload, MdPrint } from 'react-icons/md';
import app from '../../../firebase/firebaseConfig';

const firestore = getFirestore(app);
const auth = getAuth(app);

// Interfaces
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  mainImage: string;
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

interface SearchFilters {
  orderId: string;
  customerName: string;
  email: string;
  items: string;
  totalAmount: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

const OrdersTable: React.FC = () => {
  // States
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    orderId: '',
    customerName: '',
    email: '',
    items: '',
    totalAmount: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const statusOptions: Order['status'][] = ['pending', 'shipped', 'delivered', 'cancelled'];

  // Fetch Orders
  const fetchOrders = async () => {
    if (!auth.currentUser) return;

    try {
      setLoading(true);
      const orderRef = collection(firestore, 'orders');
      const q = query(orderRef);
      const snapshot = await getDocs(q);

      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];

      setOrders(fetchedOrders);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Status Update
  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderRef = doc(firestore, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus
      });
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setEditingOrderId(null);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status');
    }
  };

  // Filter Orders
  const getFilteredOrders = () => {
    return orders.filter(order => {
      const orderDate = order.createdAt.toDate();
      return (
        order.id.toLowerCase().includes(searchFilters.orderId.toLowerCase()) &&
        order.billingDetails.fullName.toLowerCase().includes(searchFilters.customerName.toLowerCase()) &&
        order.billingDetails.email.toLowerCase().includes(searchFilters.email.toLowerCase()) &&
        (searchFilters.items === '' || order.items.some(item => 
          item.name.toLowerCase().includes(searchFilters.items.toLowerCase())
        )) &&
        (searchFilters.totalAmount === '' || 
          order.totalAmount.toString().includes(searchFilters.totalAmount)) &&
        (searchFilters.status === '' || order.status === searchFilters.status) &&
        (!searchFilters.dateFrom || orderDate >= new Date(searchFilters.dateFrom)) &&
        (!searchFilters.dateTo || orderDate <= new Date(searchFilters.dateTo))
      );
    });
  };

  // Get Current Orders for Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const filteredOrders = getFilteredOrders();
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Items', 'Total Amount', 'Status', 'Date'];
    const csvData = filteredOrders.map(order => [
      order.id,
      order.billingDetails.fullName,
      order.billingDetails.email,
      order.items.map(item => `${item.name} (${item.quantity})`).join('; '),
      order.totalAmount.toFixed(2),
      order.status,
      order.createdAt.toDate().toLocaleDateString(),
    ]);

    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_export_${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Orders
  const handlePrintOrders = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Orders Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; }
            .status-pending { color: #f59e0b; }
            .status-shipped { color: #3b82f6; }
            .status-delivered { color: #10b981; }
            .status-cancelled { color: #ef4444; }
          </style>
        </head>
        <body>
          <h1>Orders Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => `
                <tr>
                  <td>${order.id}</td>
                  <td>${order.billingDetails.fullName}<br/>${order.billingDetails.email}</td>
                  <td>${order.items.map(item => `${item.name} x ${item.quantity}`).join('<br/>')}</td>
                  <td>$${order.totalAmount.toFixed(2)}</td>
                  <td class="status-${order.status}">${order.status}</td>
                  <td>${order.createdAt.toDate().toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Status Icon Component
  const StatusIcon = ({ status }: { status: Order['status'] }) => {
    switch (status) {
      case 'pending': return <MdPending className="w-4 h-4" />;
      case 'shipped': return <MdLocalShipping className="w-4 h-4" />;
      case 'delivered': return <MdDoneAll className="w-4 h-4" />;
      case 'cancelled': return <MdCancel className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-600 text-center p-4">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto p-6 mt-10">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <div className="text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Search Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Add all your search input fields here */}
          {/* Example of one filter field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Order ID</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={searchFilters.orderId}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, orderId: e.target.value }))}
              placeholder="Search by Order ID"
            />
          </div>
          {/* Add other filter fields similarly */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                {/* Add all your table cells here */}
                {/* Example of status cell */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingOrderId === order.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setEditingOrderId(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'}`}>
                        <StatusIcon status={order.status} />
                        <span className="ml-1">{order.status}</span>
                      </span>
                      <button
                        onClick={() => setEditingOrderId(order.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={ordersPerPage}
            onChange={(e) => setOrdersPerPage(Number(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {Math.ceil(filteredOrders.length / ordersPerPage)}
          </span>
          <button
            className={`px-3 py-1 rounded ${
              currentPage >= Math.ceil(filteredOrders.length / ordersPerPage)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setCurrentPage(prev =>
              Math.min(prev + 1, Math.ceil(filteredOrders.length / ordersPerPage))
            )}
            disabled={currentPage >= Math.ceil(filteredOrders.length / ordersPerPage)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Export Actions */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
          onClick={handleExportCSV}
        >
          <MdFileDownload className="mr-2" />
          Export to CSV
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          onClick={handlePrintOrders}
        >
          <MdPrint className="mr-2" />
          Print Orders
        </button>
      </div>
    </div>
  );
};

export default OrdersTable;