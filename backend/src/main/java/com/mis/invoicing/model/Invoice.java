package com.mis.invoicing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estimate_id")
    private Estimate estimate;
    
    @Column(unique = true)
    private String invoiceNumber;
    
    @Column(columnDefinition = "TEXT")
    private String items; // JSON string for line items
    
    @Column(precision = 12, scale = 2)
    private BigDecimal subtotal;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal cgst; // Central GST
    
    @Column(precision = 12, scale = 2)
    private BigDecimal sgst; // State GST
    
    @Column(precision = 12, scale = 2)
    private BigDecimal igst; // Integrated GST (for inter-state)
    
    @Column(precision = 12, scale = 2)
    private BigDecimal total;
    
    @Enumerated(EnumType.STRING)
    private InvoiceStatus status = InvoiceStatus.PENDING;
    
    private LocalDate dueDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (invoiceNumber == null) {
            invoiceNumber = "INV-" + System.currentTimeMillis();
        }
    }
    
    public enum InvoiceStatus {
        PENDING, PAID, OVERDUE
    }
}
