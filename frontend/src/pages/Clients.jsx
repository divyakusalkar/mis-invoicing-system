import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { clientApi } from '../services/api';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gstNumber: '',
        category: 'group',
    });

    const categories = ['group', 'chain', 'brand'];

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await clientApi.getAll();
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingClient) {
                await clientApi.update(editingClient.id, formData);
            } else {
                await clientApi.create(formData);
            }
            fetchClients();
            closeModal();
        } catch (error) {
            console.error('Error saving client:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await clientApi.delete(id);
                fetchClients();
            } catch (error) {
                console.error('Error deleting client:', error);
            }
        }
    };

    const openModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                email: client.email || '',
                phone: client.phone || '',
                address: client.address || '',
                gstNumber: client.gstNumber || '',
                category: client.category || 'group',
            });
        } else {
            setEditingClient(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                gstNumber: '',
                category: 'group',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h1 className="text-3xl font-bold text-white">Clients</h1>
                    <p className="text-gray-400 mt-1">Manage your client database</p>
                </div>
                <Button onClick={() => openModal()}>
                    <HiOutlinePlus className="w-5 h-5" />
                    Add Client
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                />
            </div>

            {/* Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700/50">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Phone</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Category</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">GST Number</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{client.name}</td>
                                    <td className="px-6 py-4 text-gray-300">{client.email || '-'}</td>
                                    <td className="px-6 py-4 text-gray-300">{client.phone || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 capitalize">
                                            {client.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{client.gstNumber || '-'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openModal(client)}
                                                className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(client.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <HiOutlineTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredClients.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No clients found. Click "Add Client" to create one.
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
                title={editingClient ? 'Edit Client' : 'Add New Client'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-gray-800">
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">GST Number</label>
                            <input
                                type="text"
                                value={formData.gstNumber}
                                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                            <textarea
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
                        <Button type="button" variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingClient ? 'Update Client' : 'Add Client'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Clients;
