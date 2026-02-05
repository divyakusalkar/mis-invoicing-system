package com.mis.invoicing.service;

import com.mis.invoicing.model.Invoice;
import com.mis.invoicing.model.Payment;
import com.mis.invoicing.repository.InvoiceRepository;
import com.mis.invoicing.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }
    
    public List<Payment> getPaymentsByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId);
    }
    
    public Payment recordPayment(Long invoiceId, Payment payment) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));
        
        payment.setInvoice(invoice);
        Payment savedPayment = paymentRepository.save(payment);
        
        // Check if invoice is fully paid
        updateInvoiceStatus(invoiceId);
        
        return savedPayment;
    }
    
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        Long invoiceId = payment.getInvoice().getId();
        
        paymentRepository.deleteById(id);
        
        // Recalculate invoice status after deleting payment
        updateInvoiceStatus(invoiceId);
    }
    
    private void updateInvoiceStatus(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
        BigDecimal totalPayments = paymentRepository.getTotalPaymentsByInvoiceId(invoiceId);
        
        if (totalPayments != null && totalPayments.compareTo(invoice.getTotal()) >= 0) {
            invoice.setStatus(Invoice.InvoiceStatus.PAID);
        } else {
            invoice.setStatus(Invoice.InvoiceStatus.PENDING);
        }
        invoiceRepository.save(invoice);
    }
}
