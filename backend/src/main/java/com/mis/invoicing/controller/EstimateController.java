package com.mis.invoicing.controller;

import com.mis.invoicing.model.Estimate;
import com.mis.invoicing.model.Invoice;
import com.mis.invoicing.service.EstimateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estimates")
@RequiredArgsConstructor
public class EstimateController {
    private final EstimateService estimateService;
    
    @GetMapping
    public ResponseEntity<List<Estimate>> getAllEstimates() {
        return ResponseEntity.ok(estimateService.getAllEstimates());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Estimate> getEstimateById(@PathVariable Long id) {
        return estimateService.getEstimateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Estimate>> getEstimatesByClientId(@PathVariable Long clientId) {
        return ResponseEntity.ok(estimateService.getEstimatesByClientId(clientId));
    }
    
    @PostMapping
    public ResponseEntity<Estimate> createEstimate(
            @RequestParam Long clientId,
            @RequestBody Estimate estimate) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(estimateService.createEstimate(clientId, estimate));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Estimate> updateEstimate(
            @PathVariable Long id,
            @RequestBody Estimate estimate) {
        return ResponseEntity.ok(estimateService.updateEstimate(id, estimate));
    }
    
    @PostMapping("/{id}/convert")
    public ResponseEntity<Invoice> convertToInvoice(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(estimateService.convertToInvoice(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstimate(@PathVariable Long id) {
        estimateService.deleteEstimate(id);
        return ResponseEntity.noContent().build();
    }
}
