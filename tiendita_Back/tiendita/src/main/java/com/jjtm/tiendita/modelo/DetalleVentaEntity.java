package com.jjtm.tiendita.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "detalle_venta")
@Getter @Setter
@ToString(exclude = "venta")
public class DetalleVentaEntity {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;

    //Relaciones de llaves FK
    @ManyToOne
    @JoinColumn(name = "venta_id")
    @JsonIgnore
    private VentaEntity venta;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private ProductoEntity producto;
}
