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

import com.jjtm.tiendita.modelo.DetalleVentaEntity;
import com.jjtm.tiendita.service.DetalleVentaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/detalleventas")
@RequiredArgsConstructor
public class DetalleVentasController {

    private final DetalleVentaService servicio;

    // Acepta tanto "/api/v1/detalleventas" como "/api/v1/detalleventas/"
    @GetMapping(value = {"", "/"})
    public ResponseEntity<List<DetalleVentaEntity>> listar() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleVentaEntity> obtenerDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DetalleVentaEntity> eliminar(@PathVariable Long id) {
        servicio.eliminarDetalleVenta(id);
        return ResponseEntity.noContent().build();
    }

    // Acepta tanto "/api/v1/detalleventas" como "/api/v1/detalleventas/"
    @PostMapping(value = {"", "/"})
    public ResponseEntity<DetalleVentaEntity> agregar(@RequestBody DetalleVentaEntity detalleVenta) {
        DetalleVentaEntity nuevo = servicio.guardarDetalleVenta(detalleVenta);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody DetalleVentaEntity detalleVenta) {
        try {
            DetalleVentaEntity actualizado = servicio.actualizarDetalleVenta(id, detalleVenta);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}