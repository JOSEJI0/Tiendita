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

import com.jjtm.tiendita.modelo.ClientesEntity;
import com.jjtm.tiendita.service.ClientesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/clientes")
@RequiredArgsConstructor
public class ClientesController {

    private final ClientesService servicio;

    // Acepta tanto "/api/v1/clientes" como "/api/v1/clientes/"
    @GetMapping(value = {"", "/"})
    public ResponseEntity<List<ClientesEntity>> listar() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientesEntity> obtenerDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ClientesEntity> eliminar(@PathVariable Long id) {
        servicio.eliminarCliente(id);
        return ResponseEntity.noContent().build();
    }

    // Acepta tanto "/api/v1/clientes" como "/api/v1/clientes/"
    @PostMapping(value = {"", "/"})
    public ResponseEntity<ClientesEntity> agregar(@RequestBody ClientesEntity cliente) {
        ClientesEntity nuevo = servicio.guardarCliente(cliente);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ClientesEntity cliente) {
        try {
            ClientesEntity actualizado = servicio.actualizarCliente(id, cliente);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}