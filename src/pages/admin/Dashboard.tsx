import { useState, useEffect } from 'react';
import { Card, Badge, Button, Select, Spinner } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order } from '@/types';
import { OrderStatus } from '@/types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS, ORDER_STATUS_OPTIONS } from '@/types/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { orderService } from '@/services';
import { PAGINATION } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errorHandler';
import MainLayout from '@/components/layout/MainLayout';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = PAGINATION.DEFAULT_LIMIT;

  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getAllOrders({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      
      setOrders(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error: unknown) {
      console.error('Failed to load orders:', error);
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, { status: newStatus });
      
      // Update the order in the list
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      
      showSuccess('Order status updated successfully');
    } catch (error: unknown) {
      console.error('Failed to update order status:', error);
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  // Calculate stats from orders
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === OrderStatus.PLACED || order.status === OrderStatus.PREPARING
  ).length;
  const completedOrders = orders.filter((order) => order.status === OrderStatus.DELIVERED).length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <MainLayout user={user} onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#2c3e2d] mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-[#5a6c5d] mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-[#2d8659]">{totalOrders}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-[#5a6c5d] mb-2">Pending Orders</h3>
            <p className="text-3xl font-bold text-amber-600">{pendingOrders}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-[#5a6c5d] mb-2">Completed</h3>
            <p className="text-3xl font-bold text-emerald-600">{completedOrders}</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-[#5a6c5d] mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-[#2d8659]">{formatCurrency(totalRevenue)}</p>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-[#2c3e2d]">All Orders</h2>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as OrderStatus | 'all');
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'All Statuses' },
                ...ORDER_STATUS_OPTIONS,
              ]}
              className="w-48"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#d4e4d9]">
                    <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Items</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-[#d4e4d9] hover:bg-[#f0f7f3]">
                      <td className="py-4 px-4 text-[#2c3e2d] font-medium">{order.id}</td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-[#2c3e2d] font-medium">{order.user?.name || 'N/A'}</p>
                          <p className="text-sm text-[#5a6c5d]">{order.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#5a6c5d]">{order.items.length} items</td>
                      <td className="py-4 px-4 font-semibold text-[#2d8659]">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#5a6c5d]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-4">
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                          options={ORDER_STATUS_OPTIONS}
                          className="w-40"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-[#5a6c5d]">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;


