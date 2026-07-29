package com.jjtm.tiendita.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jjtm.tiendita.modelo.VentaEntity;

public interface VentaRepository extends JpaRepository<VentaEntity, Long> {

       List<VentaEntity> findAllByClienteEmail(String email);

}
