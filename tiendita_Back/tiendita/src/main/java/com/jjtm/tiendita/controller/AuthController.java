package com.jjtm.tiendita.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jjtm.tiendita.dto.AuthRequest;
import com.jjtm.tiendita.dto.AuthResponse;
import com.jjtm.tiendita.dto.RegistroRequest;
import com.jjtm.tiendita.dto.RegistroResponse;
import com.jjtm.tiendita.modelo.UsuarioEntity;
import com.jjtm.tiendita.repository.UsuarioRepository;
import com.jjtm.tiendita.security.JwtTokenProvider;
import com.jjtm.tiendita.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
            UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request){
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken
            (request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        User userPrincipal = (User) authentication.getPrincipal();
        String authority = userPrincipal.getAuthorities().stream()
        .findFirst()
        .map(auth -> auth.getAuthority())
        .orElse("ROLE_CLIENTE");

        UsuarioEntity usuario = usuarioRepository.findByUsername(userPrincipal.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado: " + userPrincipal.getUsername()));

        return ResponseEntity.ok(new AuthResponse(token,
            usuario.getUsername(), usuario.getNombre(), authority));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest request){
        try{
            UsuarioEntity usuario = usuarioService.saveUsuario(request);
            return ResponseEntity.ok(new RegistroResponse(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getNombre(),
                usuario.getRole().name()
            ));
        } catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Authentication authentication){
        String username = authentication.getName();
        UsuarioEntity usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado: " + username));
        return ResponseEntity.ok(new AuthResponse(null,
                usuario.getUsername(), usuario.getNombre(), usuario.getRole().name()));
    }
}