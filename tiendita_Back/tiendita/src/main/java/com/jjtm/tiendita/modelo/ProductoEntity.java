package com.jjtm.tiendita.modelo;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "productos")
@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class ProductoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    @Column(length = 500)
    private String descripcion;
    @Column(nullable = false)
    private Double precio;
    @Column(nullable = false)
    private Integer stock;
    private String imagenUrl;

    //Relaciones de llaves FK
    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id") //Llave foranea de categoria
    private CategoriaEntity categoria;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id") //Llave foranea de proveedor
    private ProveedorEntity proveedor;

}