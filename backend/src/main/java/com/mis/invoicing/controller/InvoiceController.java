package com.mis.invoicing.controller;

import com.mis.invoicing.model.Invoice;
import com.mis.invoicing.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;
    
    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable @NonNull Long id) {
        return invoiceService.getInvoiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Invoice>> getInvoicesByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(invoiceService.getInvoicesByClientId(clientId));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Invoice>> getInvoicesByStatus(@PathVariable Invoice.InvoiceStatus status) {
        return ResponseEntity.ok(invoiceService.getInvoicesByStatus(status));
    }
    
    @PostMapping
    public ResponseEntity<Invoice> createInvoice(
            @RequestParam @NonNull Long clientId,
            @RequestParam(defaultValue = "false") boolean isInterState,
            @RequestBody Invoice invoice) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(invoiceService.createInvoice(clientId, invoice, isInterState));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(
            @PathVariable @NonNull Long id,
            @RequestParam(defaultValue = "false") boolean isInterState,
            @RequestBody Invoice invoice) {
        return ResponseEntity.ok(invoiceService.updateInvoice(id, invoice, isInterState));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable @NonNull Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
