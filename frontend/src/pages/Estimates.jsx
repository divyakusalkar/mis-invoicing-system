import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineDocumentDuplicate } from 'react-icons/hi';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { estimateApi, clientApi } from '../services/api';

const Estimates = () => {
    const [estimates, setEstimates] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEstimate, setEditingEstimate] = useState(null);
    const [formData, setFormData] = useState({
        clientId: '',
        items: '',
        subtotal: '',
        status: 'DRAFT',
    });

    const statusColors = {
        DRAFT: 'bg-gray-500/20 text-gray-400',
        SENT: 'bg-blue-500/20 text-blue-400',
        APPROVED: 'bg-emerald-500/20 text-emerald-400',
        CONVERTED: 'bg-purple-500/20 text-purple-400',
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [estimatesRes, clientsRes] = await Promise.all([
                estimateApi.getAll(),
                clientApi.getAll(),
            ]);
            setEstimates(estimatesRes.data);
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
            const estimateData = {
                items: formData.items,
                subtotal: parseFloat(formData.subtotal),
                status: formData.status,
            };

            if (editingEstimate) {
                await estimateApi.update(editingEstimate.id, estimateData);
            } else {
                await estimateApi.create(formData.clientId, estimateData);
            }
            fetchData();
            closeModal();
        } catch (error) {
            console.error('Error saving estimate:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this estimate?')) {
            try {
                await estimateApi.delete(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting estimate:', error);
            }
        }
    };

    const handleConvert = async (id) => {
        if (window.confirm('Convert this estimate to an invoice?')) {
            try {
                await estimateApi.convertToInvoice(id);
                fetchData();
            } catch (error) {
                console.error('Error converting estimate:', error);
            }
        }
    };

    const openModal = (estimate = null) => {
        if (estimate) {
            setEditingEstimate(estimate);
            setFormData({
                clientId: estimate.client?.id || '',
                items: estimate.items || '',
                subtotal: estimate.subtotal?.toString() || '',
                status: estimate.status,
            });
        } else {
            setEditingEstimate(null);
            setFormData({
                clientId: clients[0]?.id || '',
                items: '',
                subtotal: '',
                status: 'DRAFT',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEstimate(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
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
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Estimates</h1>
                    <p className="text-sm sm:text-base text-gray-400 mt-1">Create and manage sales estimates</p>
                </div>
                <Button onClick={() => openModal()} className="w-full sm:w-auto justify-center">
                    <HiOutlinePlus className="w-5 h-5" />
                    New Estimate
                </Button>
            </div>

            {/* Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-700/50">
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Estimate #</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Client</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400 hidden md:table-cell">Subtotal</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400 hidden lg:table-cell">GST</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Total</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-400">Status</th>
                                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {estimates.map((estimate) => (
                                <tr key={estimate.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-medium text-sm">{estimate.estimateNumber}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm">{estimate.client?.name || '-'}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm hidden md:table-cell">{formatCurrency(estimate.subtotal)}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-300 text-sm hidden lg:table-cell">{formatCurrency(estimate.gstAmount)}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-semibold text-sm">{formatCurrency(estimate.total)}</td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${statusColors[estimate.status]}`}>
                                            {estimate.status}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                                            {estimate.status === 'APPROVED' && (
                                                <button
                                                    onClick={() => handleConvert(estimate.id)}
                                                    title="Convert to Invoice"
                                                    className="p-2 rounded-lg hover:bg-purple-500/20 text-gray-400 hover:text-purple-400 transition-colors"
                                                >
                                                    <HiOutlineDocumentDuplicate className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openModal(estimate)}
                                                className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(estimate.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {estimates.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-400 text-sm sm:text-base">
                                        No estimates found. Click "New Estimate" to create one.
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
                title={editingEstimate ? 'Edit Estimate' : 'New Estimate'}
            >
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {!editingEstimate && (
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
                    )}

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
                            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option value="DRAFT" className="bg-gray-800">Draft</option>
                                <option value="SENT" className="bg-gray-800">Sent</option>
                                <option value="APPROVED" className="bg-gray-800">Approved</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-gray-700/30 rounded-xl p-3 sm:p-4">
                        <p className="text-gray-400 text-xs sm:text-sm">GST (18%) will be calculated automatically on save.</p>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-700/50">
                        <Button type="button" variant="ghost" onClick={closeModal} className="w-full sm:w-auto justify-center">
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto justify-center">
                            {editingEstimate ? 'Update Estimate' : 'Create Estimate'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Estimates;
