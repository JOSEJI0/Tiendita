package com.jjtm.tiendita.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jjtm.tiendita.modelo.ClientesEntity;

@Repository
public interface ClientesRepository extends JpaRepository<ClientesEntity, Long> {

    Optional<ClientesEntity> findFirstByEmail(String email);

    List<ClientesEntity> findAllByEmail(String email);
}