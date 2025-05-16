import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from '../ui/Toaster';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;