package com.mis.invoicing.controller;

import com.mis.invoicing.model.Client;
import com.mis.invoicing.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {
    private final ClientService clientService;
    
    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable @NonNull Long id) {
        return clientService.getClientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Client>> getClientsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(clientService.getClientsByCategory(category));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Client>> searchClients(@RequestParam String name) {
        return ResponseEntity.ok(clientService.searchClients(name));
    }
    
    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody @NonNull Client client) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientService.createClient(client));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable @NonNull Long id, @RequestBody Client client) {
        return ResponseEntity.ok(clientService.updateClient(id, client));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable @NonNull Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
