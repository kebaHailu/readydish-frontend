import { useState, useEffect } from 'react';
import { Card, Button, Spinner, Input } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Dish } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { dishService } from '@/services';
import { PAGINATION } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errorHandler';
import MainLayout from '@/components/layout/MainLayout';

const Menu: React.FC = () => {
  const { user, logout } = useAuth();
  const { addToCart, totalItems } = useCart();
  const { showSuccess, showError } = useToast();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = PAGINATION.DEFAULT_LIMIT;

  useEffect(() => {
    loadDishes();
  }, [currentPage, searchQuery]);

  const loadDishes = async () => {
    setIsLoading(true);
    try {
      const response = await dishService.getDishes({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
      });
      
      setDishes(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
    } catch (error: unknown) {
      console.error('Failed to load dishes:', error);
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (dish: Dish) => {
    try {
      await addToCart(dish, 1);
      showSuccess(`${dish.name} added to cart!`);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  return (
    <MainLayout user={user} cartItemCount={totalItems} onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2c3e2d] mb-2">Our Menu</h1>
          <p className="text-[#5a6c5d]">Discover our delicious selection of dishes</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-md"
          />
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : dishes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#5a6c5d] text-lg">No dishes found. Try a different search.</p>
          </div>
        ) : (
          <>
            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {dishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {dish.imageURL ? (
                      <img
                        src={dish.imageURL}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {!dish.isAvailable && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Unavailable</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#2c3e2d] mb-2">{dish.name}</h3>
                    <p className="text-sm text-[#5a6c5d] mb-3 line-clamp-2">{dish.description}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xl font-bold text-[#2d8659]">
                        {formatCurrency(dish.price)}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToCart(dish)}
                        disabled={!dish.isAvailable}
                        className="shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-[#5a6c5d]">
                  Page {currentPage} of {totalPages} ({total} total dishes)
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Menu;


