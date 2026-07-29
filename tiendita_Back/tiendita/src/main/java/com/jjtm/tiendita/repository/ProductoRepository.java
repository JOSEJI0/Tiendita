package com.jjtm.tiendita.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jjtm.tiendita.modelo.ProductoEntity;

public interface ProductoRepository extends JpaRepository<ProductoEntity, Long> {
}