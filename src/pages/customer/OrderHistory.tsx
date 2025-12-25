import { useState, useEffect } from 'react';
import { Card, Badge, Button, Spinner } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order } from '@/types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS } from '@/types/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { orderService } from '@/services';
import { PAGINATION } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errorHandler';
import MainLayout from '@/components/layout/MainLayout';

const OrderHistory: React.FC = () => {
  const { user, logout } = useAuth();
  const { showError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = PAGINATION.DEFAULT_LIMIT;

  useEffect(() => {
    loadOrders();
  }, [currentPage]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getMyOrders({
        page: currentPage,
        limit: itemsPerPage,
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

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <MainLayout user={user} cartItemCount={0} onLogout={logout}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#2c3e2d] mb-8">My Orders</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#5a6c5d] text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2c3e2d]">Order {order.id}</h3>
                    <p className="text-sm text-[#5a6c5d]">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#2d8659] mb-2">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <Badge variant={ORDER_STATUS_VARIANTS[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-[#d4e4d9] pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-[#5a6c5d]">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      {expandedOrder === order.id ? 'Hide' : 'View'} Details
                    </Button>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="space-y-4 pt-4 border-t border-[#d4e4d9]">
                      <div>
                        <h4 className="font-semibold text-[#2c3e2d] mb-2">Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-[#5a6c5d]">
                                {item.dishName} x{item.quantity}
                              </span>
                              <span className="font-medium">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2c3e2d] mb-2">Delivery Address</h4>
                        <p className="text-sm text-[#5a6c5d]">
                          {order.deliveryAddress.street}, {order.deliveryAddress.city},{' '}
                          {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                        </p>
                        <p className="text-sm text-[#5a6c5d] mt-1">
                          Phone: {order.deliveryAddress.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-2 mt-8">
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
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderHistory;


