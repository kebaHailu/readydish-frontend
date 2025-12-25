import { Link } from 'react-router-dom';
import { Card, Button, Spinner } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import MainLayout from '@/components/layout/MainLayout';

const Cart: React.FC = () => {
  const { user, logout } = useAuth();
  const { items: cartItems, totalItems, totalPrice, isLoading, updateQuantity, removeFromCart } = useCart();

  const deliveryFee = 5.99;
  const total = totalPrice + deliveryFee;

  return (
    <MainLayout user={user} cartItemCount={totalItems} onLogout={logout}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-[#2c3e2d] mb-8">Shopping Cart</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-4">
              <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#2c3e2d] mb-2">Your cart is empty</h2>
            <p className="text-[#5a6c5d] mb-6">Add some delicious dishes to get started!</p>
            <Link to={ROUTES.MENU}>
              <Button variant="primary" className="bg-[#2d8659] hover:bg-[#1f5d3f] text-white">
                Browse Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.dish.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2c3e2d] mb-1">{item.dish.name}</h3>
                      <p className="text-sm text-[#5a6c5d] mb-2">{item.dish.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#2d8659]">
                          {formatCurrency(item.dish.price)}
                        </span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-[#d4e4d9] flex items-center justify-center hover:bg-[#f0f7f3] transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-[#d4e4d9] flex items-center justify-center hover:bg-[#f0f7f3] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#2c3e2d] mb-2">
                        {formatCurrency(item.dish.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.dish.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-[#2c3e2d] mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#5a6c5d]">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#5a6c5d]">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="border-t border-[#d4e4d9] pt-3">
                    <div className="flex justify-between font-semibold text-lg text-[#2c3e2d]">
                      <span>Total</span>
                      <span className="text-[#2d8659]">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
                <Link to={ROUTES.CHECKOUT}>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-[#2d8659] hover:bg-[#1f5d3f] text-white"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link to={ROUTES.MENU} className="block mt-4 text-center text-sm text-[#2d8659] hover:text-[#1f5d3f]">
                  Continue Shopping
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;


