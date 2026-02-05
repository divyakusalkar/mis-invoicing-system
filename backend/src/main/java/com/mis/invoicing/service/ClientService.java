package com.mis.invoicing.service;

import com.mis.invoicing.model.Client;
import com.mis.invoicing.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;
    
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }
    
    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }
    
    public List<Client> getClientsByCategory(String category) {
        return clientRepository.findByCategory(category);
    }
    
    public List<Client> searchClients(String name) {
        return clientRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Client createClient(Client client) {
        return clientRepository.save(client);
    }
    
    public Client updateClient(Long id, Client clientDetails) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));
        
        client.setName(clientDetails.getName());
        client.setEmail(clientDetails.getEmail());
        client.setPhone(clientDetails.getPhone());
        client.setAddress(clientDetails.getAddress());
        client.setGstNumber(clientDetails.getGstNumber());
        client.setCategory(clientDetails.getCategory());
        
        return clientRepository.save(client);
    }
    
    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }
}
