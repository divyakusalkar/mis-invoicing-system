import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Client API
export const clientApi = {
    getAll: () => api.get('/clients'),
    getById: (id) => api.get(`/clients/${id}`),
    getByCategory: (category) => api.get(`/clients/category/${category}`),
    search: (name) => api.get('/clients/search', { params: { name } }),
    create: (client) => api.post('/clients', client),
    update: (id, client) => api.put(`/clients/${id}`, client),
    delete: (id) => api.delete(`/clients/${id}`),
};

// Estimate API
export const estimateApi = {
    getAll: () => api.get('/estimates'),
    getById: (id) => api.get(`/estimates/${id}`),
    getByClientId: (clientId) => api.get(`/estimates/client/${clientId}`),
    create: (clientId, estimate) => api.post('/estimates', estimate, { params: { clientId } }),
    update: (id, estimate) => api.put(`/estimates/${id}`, estimate),
    convertToInvoice: (id) => api.post(`/estimates/${id}/convert`),
    delete: (id) => api.delete(`/estimates/${id}`),
};

// Invoice API
export const invoiceApi = {
    getAll: () => api.get('/invoices'),
    getById: (id) => api.get(`/invoices/${id}`),
    getByClientId: (clientId) => api.get(`/invoices/client/${clientId}`),
    getByStatus: (status) => api.get(`/invoices/status/${status}`),
    create: (clientId, invoice, isInterState = false) =>
        api.post('/invoices', invoice, { params: { clientId, isInterState } }),
    update: (id, invoice, isInterState = false) =>
        api.put(`/invoices/${id}`, invoice, { params: { isInterState } }),
    delete: (id) => api.delete(`/invoices/${id}`),
};

// Payment API
export const paymentApi = {
    getAll: () => api.get('/payments'),
    getById: (id) => api.get(`/payments/${id}`),
    getByInvoiceId: (invoiceId) => api.get(`/payments/invoice/${invoiceId}`),
    record: (invoiceId, payment) => api.post('/payments', payment, { params: { invoiceId } }),
    delete: (id) => api.delete(`/payments/${id}`),
};

// Dashboard API
export const dashboardApi = {
    getStats: () => api.get('/dashboard/stats'),
};

export default api;
