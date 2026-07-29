package com.jjtm.tiendita.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jjtm.tiendita.modelo.ProductoEntity;
import com.jjtm.tiendita.service.ProductoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/productos") // Mapeo general de productos
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService servicio;

    // Endpoint para listar todos los productos
    // Acepta tanto "/api/v1/productos" como "/api/v1/productos/"
    @GetMapping(value = {"", "/"})
    public ResponseEntity<List<ProductoEntity>> listar(){
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    //Consultar por Id
    @GetMapping("/{id}")
    public ResponseEntity<ProductoEntity> obtenerDetalles(@PathVariable Long id){
        return ResponseEntity.ok(servicio.obtenerPorId(id));
    }

    //Eliminar por Id
    @DeleteMapping("/{id}")
    public ResponseEntity<ProductoEntity> eliminar(@PathVariable Long id){
        servicio.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    //Agregar un producto
    // Acepta tanto "/api/v1/productos" como "/api/v1/productos/"
    @PostMapping(value = {"", "/"})
    public ResponseEntity<ProductoEntity> agregar(@RequestBody ProductoEntity producto){
        ProductoEntity nuevo = servicio.guardarProducto(producto);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    //Actualizar un producto
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ProductoEntity producto){
        try{
        ProductoEntity actualizado = servicio.actualizarProducto(id, producto);
        return ResponseEntity.ok(actualizado);
        }catch(RuntimeException e){
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}