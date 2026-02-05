package com.mis.invoicing.repository;

import com.mis.invoicing.model.Estimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EstimateRepository extends JpaRepository<Estimate, Long> {
    List<Estimate> findByClientId(Long clientId);
    List<Estimate> findByStatus(Estimate.EstimateStatus status);
}
