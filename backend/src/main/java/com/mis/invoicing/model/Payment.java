package com.mis.invoicing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;
    
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;
    
    @Column(length = 50)
    private String paymentMode; // Cash, UPI, Bank Transfer, Card, etc.
    
    @Column(length = 100)
    private String transactionRef;
    
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;
    
    @PrePersist
    protected void onCreate() {
        if (paymentDate == null) {
            paymentDate = LocalDateTime.now();
        }
    }
}
