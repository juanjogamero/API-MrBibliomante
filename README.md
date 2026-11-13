<div align="center">

[![MrBibliomante — Explora la biblioteca digital](docs/readme-cover.svg)](https://juanjogamero.github.io/API-MrBibliomante/)

<br>

[![Abrir demo interactiva](https://img.shields.io/badge/ABRIR_LA_DEMO_INTERACTIVA-E98262?style=for-the-badge&logo=githubpages&logoColor=white)](https://juanjogamero.github.io/API-MrBibliomante/)

### Prueba MrBibliomante desde tu navegador, sin instalar nada.

**[juanjogamero.github.io/API-MrBibliomante](https://juanjogamero.github.io/API-MrBibliomante/)**

Un pequeño proyecto de biblioteca convertido en una experiencia que puedes explorar, probar y utilizar.

</div>

---

### ¿Qué puedes hacer?

| Explorar la biblioteca | Gestionar préstamos |
| :--- | :--- |
| Descubre libros, busca por título y comprueba los ejemplares disponibles. | Presta libros a lectores, registra devoluciones y consulta los vencimientos. |

| Organizar eventos | Registrar lectores |
| :--- | :--- |
| Crea encuentros literarios y gestiona inscripciones y aforos. | Da de alta lectores y consulta sus préstamos. |

> **Prueba libremente.** La web es una demo interactiva con datos ficticios: los cambios se guardan solo en tu navegador y puedes restablecerlos cuando quieras. La demo no está conectada a la API Java.

### Detrás del proyecto

MrBibliomante nació como un ejercicio de **Desarrollo de Aplicaciones Multiplataforma (DAM)** y ha evolucionado hasta convertirse en un proyecto de portfolio. La aplicación real es una **API REST de biblioteca** desarrollada con Java, Spring Boot y PostgreSQL.

<div align="left">

![Java](https://img.shields.io/badge/Java-21-303f54?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)

</div>

**¿Quieres explorar cómo funciona por dentro?**

[Ver código de la API](Codigo/src/main/java/com/mrbibliomante) · [Consultar documentación técnica](Documentacion/GUIA_TECNICA.md) · [Ver documentación y diagramas originales](Documentacion)

<details>
<summary><strong>Ejecutar el backend en tu ordenador</strong></summary>

Necesitas Java 21 y Docker. Desde la raíz del repositorio:

```bash
docker compose up -d
cd Codigo
./mvnw spring-boot:run
```

En Windows sustituye el último comando por `mvnw.cmd spring-boot:run`.

Abre [Swagger UI](http://localhost:8080/swagger-ui.html) para probar la API real.

</details>

---

<div align="center">
<sub>Proyecto académico ampliado para portfolio · Juan José Gamero López</sub>
</div>
