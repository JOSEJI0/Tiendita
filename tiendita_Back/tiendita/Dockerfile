# Stage 1: Build frontend
FROM node:20 AS frontend-builder
WORKDIR /app
COPY tiendita_Front/tiendita/package*.json ./
RUN npm install
COPY tiendita_Front/tiendita/ ./
RUN npm run build

# Stage 2: Build backend
FROM eclipse-temurin:21-jdk AS backend-builder
WORKDIR /app
COPY tiendita_Back/tiendita/mvnw .
COPY tiendita_Back/tiendita/.mvn .mvn
COPY tiendita_Back/tiendita/pom.xml .
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline
COPY tiendita_Back/tiendita/src src
RUN rm -rf src/main/resources/static
COPY --from=frontend-builder /app/dist src/main/resources/static
RUN ./mvnw clean package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend-builder /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]