package com.jjtm.tiendita.modelo;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "ventas")
@Getter @Setter
@ToString(exclude = "detalles")
public class VentaEntity {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fecha;
    private Double total;
    private String estadoPago;
    //Relaciones de llaves FK
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private ClientesEntity cliente;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL)
    private List<DetalleVentaEntity> detalles = new ArrayList<>();
}