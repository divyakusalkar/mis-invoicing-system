import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineDocumentText, HiOutlineCreditCard, HiOutlineCurrencyRupee } from 'react-icons/hi';
import StatCard from '../components/common/StatCard';
import { dashboardApi } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalClients: 0,
        totalEstimates: 0,
        totalInvoices: 0,
        pendingInvoices: 0,
        paidInvoices: 0,
        totalPaidAmount: 0,
        totalPendingAmount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await dashboardApi.getStats();
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Welcome back! Here's an overview of your business.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Clients"
                    value={stats.totalClients}
                    icon={HiOutlineUsers}
                    gradient="from-indigo-500 to-purple-500"
                />
                <StatCard
                    title="Total Invoices"
                    value={stats.totalInvoices}
                    icon={HiOutlineDocumentText}
                    gradient="from-emerald-500 to-teal-500"
                />
                <StatCard
                    title="Pending Invoices"
                    value={stats.pendingInvoices}
                    icon={HiOutlineCreditCard}
                    gradient="from-amber-500 to-orange-500"
                />
                <StatCard
                    title="Paid Amount"
                    value={formatCurrency(stats.totalPaidAmount)}
                    icon={HiOutlineCurrencyRupee}
                    gradient="from-green-500 to-emerald-500"
                />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Invoice Summary */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Invoice Summary</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Total Estimates</span>
                            <span className="text-white font-semibold">{stats.totalEstimates}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Paid Invoices</span>
                            <span className="text-emerald-400 font-semibold">{stats.paidInvoices}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Pending Invoices</span>
                            <span className="text-amber-400 font-semibold">{stats.pendingInvoices}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Overdue Invoices</span>
                            <span className="text-red-400 font-semibold">{stats.overdueInvoices || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Total Paid</span>
                            <span className="text-emerald-400 font-semibold">{formatCurrency(stats.totalPaidAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Total Pending</span>
                            <span className="text-amber-400 font-semibold">{formatCurrency(stats.totalPendingAmount)}</span>
                        </div>
                        <div className="pt-4 border-t border-gray-700/50">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-300 font-medium">Outstanding</span>
                                <span className="text-xl font-bold text-white">{formatCurrency(stats.totalPendingAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
