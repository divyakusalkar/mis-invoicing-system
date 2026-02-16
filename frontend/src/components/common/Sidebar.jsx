import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
    HiOutlineHome,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineDocumentDuplicate,
    HiOutlineCreditCard,
    HiOutlineX,
    HiOutlineLogout
} from 'react-icons/hi';

const allNavItems = [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard', roles: ['ADMIN', 'SALESPERSON'] },
    { path: '/clients', icon: HiOutlineUsers, label: 'Clients', roles: ['ADMIN', 'SALESPERSON'] },
    { path: '/estimates', icon: HiOutlineDocumentDuplicate, label: 'Estimates', roles: ['ADMIN', 'SALESPERSON'] },
    { path: '/invoices', icon: HiOutlineDocumentText, label: 'Invoices', roles: ['ADMIN', 'SALESPERSON'] },
    { path: '/payments', icon: HiOutlineCreditCard, label: 'Payments', roles: ['ADMIN'] },
];

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = allNavItems.filter(
        (item) => item.roles.includes(user?.role)
    );
    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 bg-gray-800/95 lg:bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="p-4 sm:p-6 border-b border-gray-700/50 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            MIS Invoice
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">Management System</p>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                        <HiOutlineX className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-3 px-3 sm:px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.fullName || 'User'}</p>
                            <p className="text-xs text-gray-500">{user?.role === 'ADMIN' ? 'Admin' : 'Sales Person'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <HiOutlineLogout className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
