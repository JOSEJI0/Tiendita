# Tiendita - Backend

API REST del sistema **Tiendita** (gestion de productos, categorias, proveedores, clientes y ventas). Construida con Spring Boot y persistencia en MySQL mediante JPA/Hibernate.

## Stack

- Java 21
- Spring Boot 4.1.0
- Spring Web MVC
- Spring Data JPA (Hibernate)
- MySQL 8 (driver mysql-connector-j)
- Lombok
- Maven (./mvnw)

## Estructura

`
src/main/java/com/jjtm/tiendita
+- TienditaApplication.java     # Clase principal (main)
+- modelo/                      # Entidades JPA
|  +- CategoriaEntity.java      #   -> tabla categorias
|  +- ClientesEntity.java       #   -> tabla clientes
|  +- ProductoEntity.java       #   -> tabla productos
|  +- ProveedorEntity.java      #   -> tabla proveedores
|  +- VentaEntity.java          #   -> tabla ventas
|  +- DetalleVentaEntity.java   #   -> tabla detalle_venta
+- repository/                  # Repositorios JpaRepository<..., Long>
|  +- CategoriaRepository.java
|  +- ClientesRepository.java
|  +- ProductoRepository.java
|  +- ProveedorRepository.java
|  +- VentaRepository.java
|  +- DetalleVentaRepository.java
+- service/                     # Logica de negocio
|  +- CategoriaService.java     # CRUD generico
|  +- ClientesService.java
|  +- ProductoService.java
|  +- ProveedorService.java
|  +- VentaService.java
|  +- DetalleVentaService.java
|  +- ProcesarVenta.java        # Reglas de venta (stock, totales, fecha)
+- controller/                  # Endpoints REST (/api/v1/...)
   +- CategoriaController.java     #   /api/v1/categorias
   +- ClientesController.java      #   /api/v1/clientes
   +- ProductoController.java      #   /api/v1/productos
   +- ProveedorController.java     #   /api/v1/proveedores
   +- VentasController.java        #   /api/v1/ventas
   +- DetalleVentasController.java #   /api/v1/detalles
`

src/main/resources/application.properties contiene la configuracion de puerto, base de datos y CORS.

## Configuracion

pplication.properties:

| Propiedad | Valor |
| --- | --- |
| server.port | 8080 |
| spring.datasource.url | jdbc:mysql://localhost:3307/tiendita_db |
| spring.datasource.username | 
oot |
| spring.datasource.password | *(vacio)* |
| spring.jpa.hibernate.ddl-auto | update (crea/actualiza tablas al arrancar) |
| spring.jpa.show-sql | 	rue |
| spring.mvc.cors.allowed-origins | http://localhost:3000 (frontend Vite) |

> Antes de arrancar, crea la base de datos en MySQL: CREATE DATABASE tiendita_db;

## Requisitos

- JDK 21
- MySQL corriendo en localhost:3307 con la BD 	iendita_db
- *(Opcional)* Maven instalado; si no, usar el wrapper ./mvnw

## Ejecutar

`ash
# desarrollo
./mvnw spring-boot:run

# o compilar y correr el jar
./mvnw clean package
java -jar target/tiendita-0.0.1-SNAPSHOT.jar
`

La API queda disponible en http://localhost:8080.

## Endpoints

Prefijo comun: /api/v1. Cada recurso expone el mismo patron CRUD (GET, GET/{id}, POST, PUT/{id}, DELETE/{id}).

| Recurso | Prefijo | Notas |
| --- | --- | --- |
| Categorias | /api/v1/categorias | CRUD completo |
| Clientes | /api/v1/clientes | CRUD completo |
| Productos | /api/v1/productos | CRUD completo |
| Proveedores | /api/v1/proveedores | CRUD completo |
| Detalles de venta | /api/v1/detalles | CRUD completo |
| Ventas | /api/v1/ventas | POST / usa ProcesarVenta para crear la venta, descontar stock y calcular totales |

### Procesar venta

POST /api/v1/ventas/ recibe un VentaEntity con sus detalles (cada uno con su producto.id). El servicio:

1. Asigna echa actual y estadoPago = "PENDIENTE".
2. Recorre los detalles: descuenta stock del producto, fija precioUnitario desde el producto y calcula subtotal.
3. Suma el 	otal y guarda la venta (con cascade = ALL se persisten los detalles).

Ejemplo de cuerpo:

`json
{
  "cliente": { "id": 1 },
  "detalles": [
    { "producto": { "id": 1 }, "cantidad": 2 }
  ]
}
`

## CORS

Abierto para el origen del frontend (http://localhost:3000). Para produccion, ajustar spring.mvc.cors.allowed-origins.
