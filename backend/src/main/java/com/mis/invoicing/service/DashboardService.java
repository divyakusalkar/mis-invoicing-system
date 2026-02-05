package com.mis.invoicing.service;

import com.mis.invoicing.model.Invoice;
import com.mis.invoicing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ClientRepository clientRepository;
    private final EstimateRepository estimateRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total counts
        stats.put("totalClients", clientRepository.count());
        stats.put("totalEstimates", estimateRepository.count());
        stats.put("totalInvoices", invoiceRepository.count());
        stats.put("totalPayments", paymentRepository.count());
        
        // Invoice status counts
        stats.put("pendingInvoices", invoiceRepository.countByStatus(Invoice.InvoiceStatus.PENDING));
        stats.put("paidInvoices", invoiceRepository.countByStatus(Invoice.InvoiceStatus.PAID));
        stats.put("overdueInvoices", invoiceRepository.countByStatus(Invoice.InvoiceStatus.OVERDUE));
        
        // Financial summaries
        BigDecimal totalPaid = invoiceRepository.getTotalPaidAmount();
        BigDecimal totalPending = invoiceRepository.getTotalPendingAmount();
        stats.put("totalPaidAmount", totalPaid != null ? totalPaid : BigDecimal.ZERO);
        stats.put("totalPendingAmount", totalPending != null ? totalPending : BigDecimal.ZERO);
        
        // Recent activity (last 5 of each)
        stats.put("recentClients", clientRepository.findAll().stream().limit(5).toList());
        stats.put("recentInvoices", invoiceRepository.findAll().stream().limit(5).toList());
        
        return stats;
    }
}
