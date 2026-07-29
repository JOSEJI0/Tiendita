package com.jjtm.tiendita.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateUsuarioRequest {
    private String username;
    private String nombre;
    private String direccion;
    private String telefono;
}
