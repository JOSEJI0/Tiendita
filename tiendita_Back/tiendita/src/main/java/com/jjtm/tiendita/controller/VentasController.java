package com.jjtm.tiendita.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jjtm.tiendita.modelo.VentaEntity;
import com.jjtm.tiendita.service.VentaService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/v1/ventas")
@RequiredArgsConstructor
public class VentasController {

    private final VentaService service;

    // Acepta tanto "/api/v1/ventas" como "/api/v1/ventas/"
    @GetMapping(value = {"", "/"})
    public ResponseEntity<List<VentaEntity>> listar() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaEntity> obtenerDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminarVenta(id);
        return ResponseEntity.noContent().build();
    }

    // Acepta tanto "/api/v1/ventas" como "/api/v1/ventas/" para crear una venta
    @PostMapping
    public ResponseEntity<?> crearVenta(@RequestBody VentaEntity venta, Principal principal) {
        try {
            String email = principal.getName();
            VentaEntity nuevaVenta = service.procesarVenta(venta, email);
            return ResponseEntity.ok(nuevaVenta);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/mis-compras")
    public ResponseEntity<List<VentaEntity>> listarMisCompras(Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(service.obtenerVentasPorCliente(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody VentaEntity venta) {
        try {
            VentaEntity actualizado = service.actualizarVenta(id, venta);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}