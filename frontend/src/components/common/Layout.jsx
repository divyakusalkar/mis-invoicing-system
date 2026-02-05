import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
