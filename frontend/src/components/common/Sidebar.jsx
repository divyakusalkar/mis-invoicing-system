import { NavLink } from 'react-router-dom';
import {
    HiOutlineHome,
    HiOutlineUsers,
    HiOutlineDocumentText,
    HiOutlineDocumentDuplicate,
    HiOutlineCreditCard
} from 'react-icons/hi';

const navItems = [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/clients', icon: HiOutlineUsers, label: 'Clients' },
    { path: '/estimates', icon: HiOutlineDocumentDuplicate, label: 'Estimates' },
    { path: '/invoices', icon: HiOutlineDocumentText, label: 'Invoices' },
    { path: '/payments', icon: HiOutlineCreditCard, label: 'Payments' },
];

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700/50">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    MIS Invoice
                </h1>
                <p className="text-xs text-gray-500 mt-1">Management System</p>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
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
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                        G
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Ganesh</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
