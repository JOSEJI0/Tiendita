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

import com.jjtm.tiendita.modelo.ProveedorEntity;
import com.jjtm.tiendita.service.ProveedorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/proveedores")
@RequiredArgsConstructor
public class ProveedorController {

    private final ProveedorService servicio;

    // Acepta tanto "/api/v1/proveedores" como "/api/v1/proveedores/"
    @GetMapping(value = {"", "/"})
    public ResponseEntity<List<ProveedorEntity>> listar() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProveedorEntity> obtenerDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProveedorEntity> eliminar(@PathVariable Long id) {
        servicio.eliminarProveedor(id);
        return ResponseEntity.noContent().build();
    }

    // Acepta tanto "/api/v1/proveedores" como "/api/v1/proveedores/"
    @PostMapping(value = {"", "/"})
    public ResponseEntity<ProveedorEntity> agregar(@RequestBody ProveedorEntity proveedor) {
        ProveedorEntity nuevo = servicio.guardarProveedor(proveedor);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ProveedorEntity proveedor) {
        try {
            ProveedorEntity actualizado = servicio.actualizarProveedor(id, proveedor);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}