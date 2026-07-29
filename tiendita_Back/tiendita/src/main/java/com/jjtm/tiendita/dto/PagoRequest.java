package com.jjtm.tiendita.dto;

import lombok.Data;

@Data
public class PagoRequest {
    private Long idVenta;
    private String moneda;
}
