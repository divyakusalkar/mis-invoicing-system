import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import Sidebar from './Sidebar';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                        <HiOutlineMenuAlt2 className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        MIS Invoice
                    </h1>
                </header>

                <main className="flex-1 overflow-auto bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
                    <div className="p-4 sm:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
