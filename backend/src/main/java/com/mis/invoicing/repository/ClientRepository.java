package com.mis.invoicing.repository;

import com.mis.invoicing.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByCategory(String category);
    List<Client> findByNameContainingIgnoreCase(String name);
}
