package com.mis.invoicing.service;

import com.mis.invoicing.model.Client;
import com.mis.invoicing.model.Invoice;
import com.mis.invoicing.repository.ClientRepository;
import com.mis.invoicing.repository.InvoiceRepository;
import com.mis.invoicing.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;
    private final PaymentRepository paymentRepository;
    
    private static final BigDecimal GST_RATE = new BigDecimal("0.18");
    
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
    
    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }
    
    public List<Invoice> getInvoicesByClientId(Long clientId) {
        return invoiceRepository.findByClientId(clientId);
    }
    
    public List<Invoice> getInvoicesByStatus(Invoice.InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }
    
    public Invoice createInvoice(Long clientId, Invoice invoice, boolean isInterState) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));
        
        invoice.setClient(client);
        calculateGst(invoice, isInterState);
        return invoiceRepository.save(invoice);
    }
    
    public Invoice updateInvoice(Long id, Invoice invoiceDetails, boolean isInterState) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        
        invoice.setItems(invoiceDetails.getItems());
        invoice.setSubtotal(invoiceDetails.getSubtotal());
        calculateGst(invoice, isInterState);
        invoice.setDueDate(invoiceDetails.getDueDate());
        
        return invoiceRepository.save(invoice);
    }
    
    public void updateInvoiceStatus(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        
        BigDecimal totalPayments = paymentRepository.getTotalPaymentsByInvoiceId(id);
        if (totalPayments != null && totalPayments.compareTo(invoice.getTotal()) >= 0) {
            invoice.setStatus(Invoice.InvoiceStatus.PAID);
            invoiceRepository.save(invoice);
        }
    }
    
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
    
    private void calculateGst(Invoice invoice, boolean isInterState) {
        if (invoice.getSubtotal() != null) {
            BigDecimal gstAmount = invoice.getSubtotal().multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
            
            if (isInterState) {
                // IGST for inter-state transactions
                invoice.setIgst(gstAmount);
                invoice.setCgst(BigDecimal.ZERO);
                invoice.setSgst(BigDecimal.ZERO);
            } else {
                // CGST + SGST for intra-state transactions (9% each)
                BigDecimal halfGst = gstAmount.divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);
                invoice.setCgst(halfGst);
                invoice.setSgst(halfGst);
                invoice.setIgst(BigDecimal.ZERO);
            }
            
            invoice.setTotal(invoice.getSubtotal().add(gstAmount));
        }
    }
}
