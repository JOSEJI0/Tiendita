# Etapa 1: Construcción (Builder)
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
# Copiar el wrapper de Maven y los archivos de configuracion
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
# Dar permisos de ejecucion al wrapper y compilar el proyecto omitiendo los tests
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests
# Etapa 2: Imagen final para produccion (ligera)
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copiar solo el archivo .jar generado en la etapa anterior
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8081
# Comando para ejecutar la aplicacion
ENTRYPOINT ["java","-jar","app.jar"]