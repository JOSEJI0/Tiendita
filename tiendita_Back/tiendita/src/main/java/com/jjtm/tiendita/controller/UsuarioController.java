package com.jjtm.tiendita.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jjtm.tiendita.dto.ChangePasswordRequest;
import com.jjtm.tiendita.dto.CreateAdminRequest;
import com.jjtm.tiendita.dto.UpdateUsuarioRequest;
import com.jjtm.tiendita.modelo.UsuarioEntity;
import com.jjtm.tiendita.repository.UsuarioRepository;
import com.jjtm.tiendita.security.CustomUserDetailsService;
import com.jjtm.tiendita.security.JwtTokenProvider;
import com.jjtm.tiendita.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @GetMapping
    public ResponseEntity<List<UsuarioEntity>> listar() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id, Authentication authentication) {
        String usernameActual = authentication.getName();
        UsuarioEntity target = usuarioService.obtenerUsuario(id);
        boolean esMismoUsuario = target.getUsername().equals(usernameActual);
        boolean esAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!esMismoUsuario && !esAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No tienes permiso para ver este usuario.");
        }
        return ResponseEntity.ok(target);
    }

    @PostMapping
    public ResponseEntity<UsuarioEntity> crearAdmin(@RequestBody CreateAdminRequest request) {
        UsuarioEntity nuevo = usuarioService.crearAdmin(request);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody UpdateUsuarioRequest request,
            Authentication authentication) {
        try {
            String usernameActual = authentication.getName();
            UsuarioEntity target = usuarioService.obtenerUsuario(id);
            boolean esMismoUsuario = target.getUsername().equals(usernameActual);
            boolean esAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!esMismoUsuario && !esAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("No tienes permiso para actualizar este usuario.");
            }
            UsuarioEntity actualizado = usuarioService.actualizarUsuario(id, request);

            String newToken = null;
            if (esMismoUsuario && !actualizado.getUsername().equals(usernameActual)) {
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(actualizado.getUsername());
                UsernamePasswordAuthenticationToken newAuth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                newToken = jwtTokenProvider.generateToken(newAuth);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("usuario", actualizado);
            if (newToken != null) {
                response.put("token", newToken);
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        try {
            String usernameActual = authentication.getName();
            UsuarioEntity target = usuarioService.obtenerUsuario(id);
            boolean esMismoUsuario = target.getUsername().equals(usernameActual);
            boolean esAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!esMismoUsuario && !esAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("No tienes permiso para cambiar la contraseña de este usuario.");
            }
            usuarioService.cambiarPassword(id, request);
            return ResponseEntity.ok("Contraseña actualizada correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
