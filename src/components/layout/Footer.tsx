import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4a5d4c] border-t border-[#5a6c5d] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#2d8659] mb-4">ReadyDish</h3>
            <p className="text-gray-200 text-sm">
              Your favorite restaurant dishes, delivered fresh to your door.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li><a href="#" className="hover:text-[#2d8659] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#2d8659] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#2d8659] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#2d8659] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li>Email: support@readydish.com</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#5a6c5d] mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; {new Date().getFullYear()} ReadyDish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


