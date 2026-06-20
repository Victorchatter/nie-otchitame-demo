# Polyglot utilities

This folder contains small, self-contained utilities written in the extra
languages and tools listed in the job posting.

## Folder overview

| Folder | Language / tool | Purpose |
|--------|----------------|---------|
| `java-report-utils/` | Java 17 + Maven + JUnit 5 | Report validation library and lifecycle checks |
| `php/` | PHP 8.1+ | CLI health checker for the backend |
| `node/` | Node.js 18+ | Seed script that POSTs sample reports |

## Job posting skill mapping

The **"Разработчик софтуерни продукти и системи, проект Ние Отчитаме"**
posting lists Java, Maven/JUnit, PHP, and Node.js among the desired
competencies. These utilities demonstrate each one concretely against the
demo domain.

| Job posting skill | Artifact |
|-------------------|----------|
| Java / Maven | `java-report-utils/pom.xml` |
| Unit testing / JUnit | `java-report-utils/src/test/java/com/nieotchitame/ReportValidatorTest.java` |
| PHP | `php/health_check.php` |
| Node.js | `node/seed_reports.js` + `node/package.json` |

## Running everything

```bash
# Java (Maven 3.6+ and JDK 17 required)
cd java-report-utils
mvn test
mvn package
java -jar target/java-report-utils-1.0.0.jar

# PHP (PHP 8.1+ required)
cd ../php
php health_check.php --url=http://localhost:8000/health
php health_check.php --url=http://localhost:8000/health --log=../../backend/app.log

# Node.js (Node 18+ required)
cd ../node
npm start
```

## Design notes

- **No external runtime dependencies** beyond the standard toolchains (Maven,
  JDK, PHP, Node). The PHP script uses `file_get_contents`; the Node script
  uses built-in `fetch`.
- Each utility is small and focused: Java handles domain validation, PHP checks
  operational health, and Node seeds test data.
- Exit codes are meaningful so these scripts can be wired into CI or shell
  orchestration later.
