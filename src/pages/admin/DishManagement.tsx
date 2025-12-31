import { useState, useEffect } from 'react';
import { Card, Button, Input, Spinner, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Dish, DishData } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { dishService } from '@/services';
import { PAGINATION } from '@/lib/constants';
import { getErrorMessage } from '@/lib/errorHandler';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MainLayout from '@/components/layout/MainLayout';

const dishSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  imageURL: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
      message: 'Invalid URL format',
    }),
  isAvailable: z.boolean(),
});

type DishFormData = z.infer<typeof dishSchema>;

const DishManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [deletingDishId, setDeletingDishId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = PAGINATION.DEFAULT_LIMIT;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DishFormData>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageURL: '',
      isAvailable: true,
    },
  });

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
    } catch (error: unknown) {
      console.error('Failed to load dishes:', error);
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingDish(null);
    reset({
      name: '',
      description: '',
      price: 0,
      imageURL: '',
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dish: Dish) => {
    setEditingDish(dish);
    setValue('name', dish.name);
    setValue('description', dish.description);
    setValue('price', dish.price);
    setValue('imageURL', dish.imageURL || '');
    setValue('isAvailable', dish.isAvailable);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDish(null);
    reset();
  };

  const onSubmit = async (data: DishFormData) => {
    try {
      const dishData: DishData = {
        name: data.name,
        description: data.description,
        price: data.price,
        imageURL: data.imageURL || undefined,
        isAvailable: data.isAvailable,
      };

      if (editingDish) {
        await dishService.updateDish(editingDish.id, dishData);
        showSuccess('Dish updated successfully!');
      } else {
        await dishService.createDish(dishData);
        showSuccess('Dish created successfully!');
      }

      closeModal();
      loadDishes();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dish? This action cannot be undone.')) {
      return;
    }

    setDeletingDishId(id);
    try {
      await dishService.deleteDish(id);
      showSuccess('Dish deleted successfully!');
      loadDishes();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setDeletingDishId(null);
    }
  };

  return (
    <MainLayout user={user} cartItemCount={0} onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#2c3e2d] mb-2">Dish Management</h1>
            <p className="text-[#5a6c5d]">Manage your restaurant menu items</p>
          </div>
          <Button variant="primary" onClick={openAddModal}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Dish
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
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

        {/* Dishes Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : dishes.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-[#5a6c5d] text-lg">No dishes found. Create your first dish to get started.</p>
          </Card>
        ) : (
          <>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f0f7f3]">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Image</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Price</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#2c3e2d]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dishes.map((dish) => (
                      <tr key={dish.id} className="border-b border-[#d4e4d9] hover:bg-[#f0f7f3]">
                        <td className="py-4 px-4">
                          {dish.imageURL ? (
                            <img
                              src={dish.imageURL}
                              alt={dish.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-[#2c3e2d]">{dish.name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-[#5a6c5d] line-clamp-2 max-w-md">{dish.description}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-[#2d8659]">{formatCurrency(dish.price)}</p>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={dish.isAvailable ? 'success' : 'default'}>
                            {dish.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(dish)}
                              className="text-[#2d8659] hover:text-[#1f5d3f]"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(dish.id)}
                              disabled={deletingDishId === dish.id}
                              className="text-red-600 hover:text-red-700"
                            >
                              {deletingDishId === dish.id ? (
                                <Spinner size="sm" />
                              ) : (
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-[#5a6c5d]">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-[#2c3e2d]">
                    {editingDish ? 'Edit Dish' : 'Add New Dish'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-[#5a6c5d] hover:text-[#2c3e2d] transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Input
                    label="Dish Name"
                    type="text"
                    placeholder="e.g., Grilled Salmon with Herbs"
                    error={errors.name?.message}
                    {...register('name')}
                  />

                  <div>
                    <label className="block text-sm font-medium text-[#2c3e2d] mb-2">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full px-3 py-2 border border-[#d4e4d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d8659] focus:border-transparent"
                      placeholder="Describe the dish..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <Input
                    label="Price ($)"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    error={errors.price?.message}
                    {...register('price', { valueAsNumber: true })}
                  />

                  <Input
                    label="Image URL (Optional)"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    error={errors.imageURL?.message}
                    {...register('imageURL')}
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      {...register('isAvailable')}
                      className="w-4 h-4 text-[#2d8659] border-[#d4e4d9] rounded focus:ring-[#2d8659]"
                    />
                    <label htmlFor="isAvailable" className="ml-2 text-sm font-medium text-[#2c3e2d]">
                      Available for ordering
                    </label>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      {editingDish ? 'Update Dish' : 'Create Dish'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DishManagement;

