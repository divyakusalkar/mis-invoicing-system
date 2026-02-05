package com.mis.invoicing.service;

import com.mis.invoicing.model.Client;
import com.mis.invoicing.model.Estimate;
import com.mis.invoicing.model.Invoice;
import com.mis.invoicing.repository.ClientRepository;
import com.mis.invoicing.repository.EstimateRepository;
import com.mis.invoicing.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EstimateService {
    private final EstimateRepository estimateRepository;
    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;
    
    private static final BigDecimal GST_RATE = new BigDecimal("0.18"); // 18% GST
    
    public List<Estimate> getAllEstimates() {
        return estimateRepository.findAll();
    }
    
    public Optional<Estimate> getEstimateById(Long id) {
        return estimateRepository.findById(id);
    }
    
    public List<Estimate> getEstimatesByClientId(Long clientId) {
        return estimateRepository.findByClientId(clientId);
    }
    
    public Estimate createEstimate(Long clientId, Estimate estimate) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + clientId));
        
        estimate.setClient(client);
        calculateGst(estimate);
        return estimateRepository.save(estimate);
    }
    
    public Estimate updateEstimate(Long id, Estimate estimateDetails) {
        Estimate estimate = estimateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estimate not found with id: " + id));
        
        estimate.setItems(estimateDetails.getItems());
        estimate.setSubtotal(estimateDetails.getSubtotal());
        calculateGst(estimate);
        estimate.setStatus(estimateDetails.getStatus());
        
        return estimateRepository.save(estimate);
    }
    
    public Invoice convertToInvoice(Long estimateId) {
        Estimate estimate = estimateRepository.findById(estimateId)
                .orElseThrow(() -> new RuntimeException("Estimate not found with id: " + estimateId));
        
        if (estimate.getStatus() != Estimate.EstimateStatus.APPROVED) {
            throw new RuntimeException("Only approved estimates can be converted to invoices");
        }
        
        Invoice invoice = new Invoice();
        invoice.setClient(estimate.getClient());
        invoice.setEstimate(estimate);
        invoice.setItems(estimate.getItems());
        invoice.setSubtotal(estimate.getSubtotal());
        
        // Split GST into CGST and SGST (9% each for intra-state)
        BigDecimal halfGst = estimate.getGstAmount().divide(new BigDecimal("2"), 2, RoundingMode.HALF_UP);
        invoice.setCgst(halfGst);
        invoice.setSgst(halfGst);
        invoice.setIgst(BigDecimal.ZERO);
        invoice.setTotal(estimate.getTotal());
        
        estimate.setStatus(Estimate.EstimateStatus.CONVERTED);
        estimateRepository.save(estimate);
        
        return invoiceRepository.save(invoice);
    }
    
    public void deleteEstimate(Long id) {
        estimateRepository.deleteById(id);
    }
    
    private void calculateGst(Estimate estimate) {
        if (estimate.getSubtotal() != null) {
            BigDecimal gstAmount = estimate.getSubtotal().multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
            estimate.setGstAmount(gstAmount);
            estimate.setTotal(estimate.getSubtotal().add(gstAmount));
        }
    }
}
