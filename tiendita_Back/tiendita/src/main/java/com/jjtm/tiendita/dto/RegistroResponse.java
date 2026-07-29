package com.jjtm.tiendita.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegistroResponse {
    private Long id;
    private String username;
    private String nombre;
    private String role;
}