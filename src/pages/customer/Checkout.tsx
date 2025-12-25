import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, Input } from '@/components/ui';
import { formatCurrency, isValidZipCode, isValidPhone } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import type { DeliveryAddress } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { orderService } from '@/services';
import { getErrorMessage } from '@/lib/errorHandler';
import MainLayout from '@/components/layout/MainLayout';

const checkoutSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().refine(isValidZipCode, 'Invalid zip code format'),
  phoneNumber: z.string().refine(isValidPhone, 'Invalid phone number format'),
});

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items: cartItems, totalPrice, clearCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = 5.99;
  const total = totalPrice + deliveryFee;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryAddress>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: DeliveryAddress) => {
    setIsLoading(true);
    setError(null);

    try {
      if (cartItems.length === 0) {
        setError('Your cart is empty');
        setIsLoading(false);
        return;
      }

      const orderData = {
        items: cartItems.map((item) => ({
          dishId: item.dish.id,
          quantity: item.quantity,
        })),
        deliveryAddress: data,
      };

      const order = await orderService.placeOrder(orderData);
      
      // Clear cart after successful order
      await clearCart();
      
      showSuccess('Order placed successfully!');
      navigate(`${ROUTES.ORDERS}?success=true&orderId=${order.id}`);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <MainLayout user={user} cartItemCount={0} onLogout={logout}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <p className="text-[#5a6c5d] text-lg mb-4">Your cart is empty.</p>
            <Link to={ROUTES.MENU}>
              <Button variant="primary" className="bg-[#2d8659] hover:bg-[#1f5d3f] text-white">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onLogout={logout}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#2c3e2d] mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Address Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-[#2c3e2d] mb-6">Delivery Address</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Street Address"
                  placeholder="123 Main Street"
                  error={errors.street?.message}
                  {...register('street')}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="New York"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <Input
                    label="State"
                    placeholder="NY"
                    error={errors.state?.message}
                    {...register('state')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Zip Code"
                    placeholder="10001"
                    error={errors.zipCode?.message}
                    {...register('zipCode')}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="(555) 123-4567"
                    error={errors.phoneNumber?.message}
                    {...register('phoneNumber')}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full bg-[#2d8659] hover:bg-[#1f5d3f] text-white"
                  >
                    Place Order
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-[#2c3e2d] mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.dish.id} className="flex justify-between text-sm">
                    <span className="text-[#5a6c5d]">
                      {item.dish.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.dish.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#d4e4d9] pt-3 space-y-2">
                <div className="flex justify-between text-[#5a6c5d]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[#5a6c5d]">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-[#2c3e2d] pt-2 border-t border-[#d4e4d9]">
                  <span>Total</span>
                  <span className="text-[#2d8659]">{formatCurrency(total)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;


