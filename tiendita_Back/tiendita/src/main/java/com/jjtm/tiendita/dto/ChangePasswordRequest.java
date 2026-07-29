package com.jjtm.tiendita.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangePasswordRequest {
    private String passwordActual;
    private String nuevoPassword;
}
