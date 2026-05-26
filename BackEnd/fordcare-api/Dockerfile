FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8443

ENTRYPOINT ["java", "-jar", "target/fordcare-api-0.0.1-SNAPSHOT.jar"]