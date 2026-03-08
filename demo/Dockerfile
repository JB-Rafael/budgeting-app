FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn -q -e -B -DskipTests dependency:go-offline

COPY src ./src

RUN mvn -q -e -B -DskipTests package


FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["java","-jar","app.jar"]