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

import com.jjtm.tiendita.modelo.CategoriaEntity;
import com.jjtm.tiendita.service.CategoriaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService servicio;

    // Acepta tanto "/api/v1/categorias" como "/api/v1/categorias/"
    @GetMapping(value = {"", "/"})
    public ResponseEntity<List<CategoriaEntity>> listar() {
        return ResponseEntity.ok(servicio.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaEntity> obtenerDetalles(@PathVariable Long id) {
        return ResponseEntity.ok(servicio.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CategoriaEntity> eliminar(@PathVariable Long id) {
        servicio.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }

    // Acepta tanto "/api/v1/categorias" como "/api/v1/categorias/"
    @PostMapping(value = {"", "/"})
    public ResponseEntity<CategoriaEntity> agregar(@RequestBody CategoriaEntity categoria) {
        CategoriaEntity nuevo = servicio.guardarCategoria(categoria);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody CategoriaEntity categoria) {
        try {
            CategoriaEntity actualizado = servicio.actualizarCategoria(id, categoria);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}