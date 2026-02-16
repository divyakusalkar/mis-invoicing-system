import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineEye, HiOutlineTrash } from 'react-icons/hi';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { invoiceApi, clientApi } from '../services/api';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [formData, setFormData] = useState({
        clientId: '',
        items: '',
        subtotal: '',
        dueDate: '',
        isInterState: false,
    });

    const statusColors = {
        PENDING: 'bg-amber-500/20 text-amber-400',
        PAID: 'bg-emerald-500/20 text-emerald-400',
        OVERDUE: 'bg-red-500/20 text-red-400',
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [invoicesRes, clientsRes] = await Promise.all([
                invoiceApi.getAll(),
                clientApi.getAll(),
            ]);
            setInvoices(invoicesRes.data);
            setClients(clientsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const invoiceData = {
                items: formData.items,
                subtotal: parseFloat(formData.subtotal),
                dueDate: formData.dueDate || null,
            };

            await invoiceApi.create(formData.clientId, invoiceData, formData.isInterState);
            fetchData();
            closeModal();
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            try {
                await invoiceApi.delete(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting invoice:', error);
            }
        }
    };

    const openModal = () => {
        setFormData({
            clientId: clients[0]?.id || '',
            items: '',
            subtotal: '',
            dueDate: '',
            isInterState: false,
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

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-IN');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Invoices</h1>
                    <p className="text-sm sm:text-base text-gray-400 mt-1">Manage invoices and track payments</p>
                </div>
                <Button onClick={openModal} className="w-full sm:w-auto justify-center">
                    <HiOutlinePlus className="w-5 h-5" />
                    New Invoice
                </Button>
            </div>

            {/* Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-175">
                        <thead>
                            <tr className="border-b border-gray-700/50">
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Invoice #</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Client</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400 hidden md:table-cell">Subtotal</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400 hidden lg:table-cell">GST</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Total</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Status</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400 hidden sm:table-cell">Due Date</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-medium text-sm">{invoice.invoiceNumber}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm">{invoice.client?.name || '-'}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm hidden md:table-cell">{formatCurrency(invoice.subtotal)}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm hidden lg:table-cell">
                                        {invoice.igst > 0
                                            ? `IGST: ${formatCurrency(invoice.igst)}`
                                            : `CGST+SGST: ${formatCurrency((invoice.cgst || 0) + (invoice.sgst || 0))}`
                                        }
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-semibold text-sm">{formatCurrency(invoice.total)}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm hidden sm:table-cell">{formatDate(invoice.dueDate)}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                            <button
                                                onClick={() => setViewingInvoice(invoice)}
                                                className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <HiOutlineEye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(invoice.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-400 text-sm sm:text-base">
                                        No invoices found. Click "New Invoice" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="New Invoice"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Client *</label>
                        <select
                            required
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <option value="">Select a client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id} className="bg-gray-800">
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Items (Description)</label>
                        <textarea
                            rows={4}
                            value={formData.items}
                            onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                            placeholder="Item 1: ₹1000&#10;Item 2: ₹2000"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Subtotal (₹) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.subtotal}
                                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    </div>

                    <div className="flex items-start sm:items-center gap-3">
                        <input
                            type="checkbox"
                            id="isInterState"
                            checked={formData.isInterState}
                            onChange={(e) => setFormData({ ...formData, isInterState: e.target.checked })}
                            className="w-4 h-4 mt-0.5 sm:mt-0 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-indigo-500/50"
                        />
                        <label htmlFor="isInterState" className="text-gray-300 text-sm">
                            Inter-State Transaction (IGST instead of CGST+SGST)
                        </label>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-700/50">
                        <Button type="button" variant="ghost" onClick={closeModal} className="w-full sm:w-auto justify-center">
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto justify-center">
                            Create Invoice
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* View Invoice Modal */}
            <Modal
                isOpen={!!viewingInvoice}
                onClose={() => setViewingInvoice(null)}
                title={`Invoice ${viewingInvoice?.invoiceNumber}`}
            >
                {viewingInvoice && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">Client</p>
                                <p className="text-white font-medium">{viewingInvoice.client?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[viewingInvoice.status]}`}>
                                    {viewingInvoice.status}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p className="text-gray-400 text-sm mb-2">Items</p>
                            <div className="bg-gray-700/30 rounded-xl p-4">
                                <pre className="text-gray-300 whitespace-pre-wrap">{viewingInvoice.items || 'No items listed'}</pre>
                            </div>
                        </div>

                        <div className="bg-gray-700/30 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white">{formatCurrency(viewingInvoice.subtotal)}</span>
                            </div>
                            {viewingInvoice.igst > 0 ? (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">IGST (18%)</span>
                                    <span className="text-white">{formatCurrency(viewingInvoice.igst)}</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">CGST (9%)</span>
                                        <span className="text-white">{formatCurrency(viewingInvoice.cgst)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">SGST (9%)</span>
                                        <span className="text-white">{formatCurrency(viewingInvoice.sgst)}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between pt-3 border-t border-gray-600">
                                <span className="text-white font-semibold">Total</span>
                                <span className="text-white font-bold text-lg">{formatCurrency(viewingInvoice.total)}</span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-700/50">
                            <Button variant="ghost" onClick={() => setViewingInvoice(null)} className="w-full sm:w-auto justify-center">
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Invoices;
