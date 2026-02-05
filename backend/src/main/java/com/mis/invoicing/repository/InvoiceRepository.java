package com.mis.invoicing.repository;

import com.mis.invoicing.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByClientId(Long clientId);
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);
    
    @Query("SELECT SUM(i.total) FROM Invoice i WHERE i.status = 'PAID'")
    BigDecimal getTotalPaidAmount();
    
    @Query("SELECT SUM(i.total) FROM Invoice i WHERE i.status = 'PENDING'")
    BigDecimal getTotalPendingAmount();
    
    long countByStatus(Invoice.InvoiceStatus status);
}
