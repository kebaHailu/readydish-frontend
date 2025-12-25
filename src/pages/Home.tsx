import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';

const Home: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <MainLayout user={user} onLogout={logout}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#2d8659] opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200 opacity-5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-[#2d8659] bg-opacity-10 text-[#2d8659] rounded-full text-sm font-semibold">
                  🍽️ Fresh Food, Fast Delivery
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#2c3e2d] mb-6 leading-tight">
                Your Favorite
                <span className="block text-[#2d8659]">Restaurant Dishes</span>
                <span className="block">Delivered Fresh</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#5a6c5d] mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover our delicious selection of chef-prepared meals. Order with ease and enjoy restaurant-quality food delivered right to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {!user ? (
                  <>
                    <Link to={ROUTES.SIGNUP}>
                      <Button
                        variant="primary"
                        size="lg"
                        className="bg-[#2d8659] hover:bg-[#1f5d3f] text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Get Started
                      </Button>
                    </Link>
                    <Link to={ROUTES.MENU}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-[#2d8659] text-[#2d8659] hover:bg-[#f0f7f3] px-8 py-4 text-lg font-semibold"
                      >
                        Browse Menu
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to={ROUTES.MENU}>
                    <Button
                      variant="primary"
                      size="lg"
                      className="bg-[#2d8659] hover:bg-[#1f5d3f] text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Order Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-square bg-gradient-to-br from-[#2d8659] to-emerald-400 rounded-2xl flex items-center justify-center">
                    <svg className="w-48 h-48 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-[#2d8659] rounded-2xl p-6 shadow-xl transform -rotate-6">
                  <div className="flex items-center space-x-3 text-white">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-90">Fast Delivery</p>
                      <p className="text-lg font-bold">30-45 min</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-emerald-500 rounded-2xl p-6 shadow-xl transform rotate-6">
                  <div className="flex items-center space-x-3 text-white">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-90">Fresh Food</p>
                      <p className="text-lg font-bold">100% Quality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2c3e2d] mb-4">
              Why Choose ReadyDish?
            </h2>
            <p className="text-xl text-[#5a6c5d] max-w-2xl mx-auto">
              Experience the convenience of restaurant-quality meals delivered to your doorstep
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#2d8659] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#2c3e2d] mb-3 text-center">Fresh Menu</h3>
              <p className="text-[#5a6c5d] text-center leading-relaxed">
                Explore our wide selection of delicious dishes prepared with the finest ingredients by expert chefs.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#2d8659] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#2c3e2d] mb-3 text-center">Fast Delivery</h3>
              <p className="text-[#5a6c5d] text-center leading-relaxed">
                Get your favorite meals delivered quickly and safely to your doorstep in 30-45 minutes.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-green-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-[#2d8659] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-[#2c3e2d] mb-3 text-center">Secure Ordering</h3>
              <p className="text-[#5a6c5d] text-center leading-relaxed">
                Your data and payments are protected with industry-standard security measures for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#2d8659] to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-emerald-100 text-lg">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">100+</div>
              <div className="text-emerald-100 text-lg">Menu Items</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">30min</div>
              <div className="text-emerald-100 text-lg">Avg Delivery</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">4.9★</div>
              <div className="text-emerald-100 text-lg">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2c3e2d] mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl text-[#5a6c5d] mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying fresh, delicious meals delivered to their door.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.SIGNUP}>
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-[#2d8659] hover:bg-[#1f5d3f] text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Account
                </Button>
              </Link>
              <Link to={ROUTES.MENU}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#2d8659] text-[#2d8659] hover:bg-[#f0f7f3] px-8 py-4 text-lg font-semibold"
                >
                  Browse Menu
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
