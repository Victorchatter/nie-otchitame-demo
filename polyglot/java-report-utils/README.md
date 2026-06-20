# java-report-utils

Java validation utilities for the Nie Otchitame reporting module.
Demonstrates Java 17, Maven, and JUnit 5 from the job posting.

## Build & test

```bash
cd polyglot/java-report-utils
mvn test
```

## Package as JAR

```bash
mvn package
```

The packaged JAR is written to `target/java-report-utils-1.0.0.jar`.

## Run the validator demo

```bash
java -jar target/java-report-utils-1.0.0.jar
```

## What it contains

- `Report` — simple POJO matching the backend report schema.
- `ReportValidator` — validates report type, positive amount, required fields,
  and enforces status lifecycle transitions (`draft` → `submitted` → `approved`).
- `ReportValidatorTest` — JUnit 5 tests for valid/invalid reports and transitions.
