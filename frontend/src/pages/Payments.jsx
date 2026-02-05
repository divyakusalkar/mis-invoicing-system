import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { paymentApi, invoiceApi } from '../services/api';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        invoiceId: '',
        amount: '',
        paymentMode: 'UPI',
        transactionRef: '',
    });

    const paymentModes = ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Cheque'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [paymentsRes, invoicesRes] = await Promise.all([
                paymentApi.getAll(),
                invoiceApi.getAll(),
            ]);
            setPayments(paymentsRes.data);
            setInvoices(invoicesRes.data.filter(inv => inv.status !== 'PAID'));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const paymentData = {
                amount: parseFloat(formData.amount),
                paymentMode: formData.paymentMode,
                transactionRef: formData.transactionRef,
            };

            await paymentApi.record(formData.invoiceId, paymentData);
            fetchData();
            closeModal();
        } catch (error) {
            console.error('Error recording payment:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            try {
                await paymentApi.delete(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting payment:', error);
            }
        }
    };

    const openModal = () => {
        setFormData({
            invoiceId: invoices[0]?.id || '',
            amount: '',
            paymentMode: 'UPI',
            transactionRef: '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount || 0);
    };

    const formatDateTime = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('en-IN');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Payments</h1>
                    <p className="text-gray-400 mt-1">Record and track payment transactions</p>
                </div>
                <Button onClick={openModal} disabled={invoices.length === 0}>
                    <HiOutlinePlus className="w-5 h-5" />
                    Record Payment
                </Button>
            </div>

            {invoices.length === 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <p className="text-emerald-400">All invoices are paid! No pending payments.</p>
                </div>
            )}

            {/* Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700/50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Invoice #</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Payment Mode</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Transaction Ref</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Date & Time</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{payment.invoice?.invoiceNumber || '-'}</td>
                                    <td className="px-6 py-4 text-emerald-400 font-semibold">{formatCurrency(payment.amount)}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                                            {payment.paymentMode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{payment.transactionRef || '-'}</td>
                                    <td className="px-6 py-4 text-gray-300">{formatDateTime(payment.paymentDate)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(payment.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No payments recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Record Payment"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Invoice *</label>
                        <select
                            required
                            value={formData.invoiceId}
                            onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <option value="">Select an invoice</option>
                            {invoices.map((invoice) => (
                                <option key={invoice.id} value={invoice.id} className="bg-gray-800">
                                    {invoice.invoiceNumber} - {formatCurrency(invoice.total)} ({invoice.client?.name})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Amount (₹) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Payment Mode</label>
                            <select
                                value={formData.paymentMode}
                                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                {paymentModes.map((mode) => (
                                    <option key={mode} value={mode} className="bg-gray-800">
                                        {mode}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Reference</label>
                        <input
                            type="text"
                            value={formData.transactionRef}
                            onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                            placeholder="UPI ID, Cheque No., etc."
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
                        <Button type="button" variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="success">
                            Record Payment
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Payments;
