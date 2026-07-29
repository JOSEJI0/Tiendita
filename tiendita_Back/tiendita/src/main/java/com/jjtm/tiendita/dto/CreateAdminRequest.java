package com.jjtm.tiendita.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreateAdminRequest {
    private String username;
    private String password;
    private String nombre;
    private String direccion;
    private String telefono;
}
