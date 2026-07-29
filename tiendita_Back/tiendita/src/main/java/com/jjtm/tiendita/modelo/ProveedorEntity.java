package com.jjtm.tiendita.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "proveedores")
@Data
public class ProveedorEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;
    @Column(nullable = false, length = 100)
    private String email;
    @Column(length = 200)
    private String direccion;
    @Column(nullable = false, length = 10)
    private String telefono;
}
