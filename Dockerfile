FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
ENV MAVEN_OPTS="-Xmx300m -XX:+UseSerialGC -XX:+TieredCompilation"
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B 2>&1 | grep -E "SUCCESS|ERROR|FAILURE" || true
COPY backend/src ./src
RUN mvn clean package -DskipTests -B -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/target/interview-prep-backend-*.jar app.jar
EXPOSE 8080
CMD ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
