package com.mis.invoicing.controller;

import com.mis.invoicing.model.Payment;
import com.mis.invoicing.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<Payment>> getPaymentsByInvoiceId(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(paymentService.getPaymentsByInvoiceId(invoiceId));
    }
    
    @PostMapping
    public ResponseEntity<Payment> recordPayment(
            @RequestParam Long invoiceId,
            @RequestBody Payment payment) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.recordPayment(invoiceId, payment));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
