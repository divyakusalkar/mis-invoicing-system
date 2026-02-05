package com.mis.invoicing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "estimates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Estimate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @Column(unique = true)
    private String estimateNumber;
    
    @Column(columnDefinition = "TEXT")
    private String items; // JSON string for line items
    
    @Column(precision = 12, scale = 2)
    private BigDecimal subtotal;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal gstAmount;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal total;
    
    @Enumerated(EnumType.STRING)
    private EstimateStatus status = EstimateStatus.DRAFT;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (estimateNumber == null) {
            estimateNumber = "EST-" + System.currentTimeMillis();
        }
    }
    
    public enum EstimateStatus {
        DRAFT, SENT, APPROVED, CONVERTED
    }
}
