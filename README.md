<div align="center">

<a href="https://juanjogamero.github.io/MrBibliomante-Sistema-de-Gestion-Bibliotecaria/">
  <img src="docs/readme-cover.svg" alt="MrBibliomante: biblioteca digital con catálogo de libros y panel de gestión" width="100%">
</a>

# MrBibliomante

**Sistema de Gestión Bibliotecaria**

Una biblioteca digital para descubrir libros, gestionar préstamos, organizar eventos y explorar una API REST desarrollada con Java y Spring Boot.

### [Explorar la plataforma web](https://juanjogamero.github.io/MrBibliomante-Sistema-de-Gestion-Bibliotecaria/)

[Ver la demostración interactiva](https://juanjogamero.github.io/MrBibliomante-Sistema-de-Gestion-Bibliotecaria/) · [Documentación técnica](Documentacion/GUIA_TECNICA.md) · [Código de la API](Codigo/src/main/java/com/mrbibliomante)

</div>

---

## Descubre el proyecto

MrBibliomante nació como un proyecto académico de **Desarrollo de Aplicaciones Multiplataforma (DAM)** y se amplió para mostrar una experiencia visual de biblioteca y las reglas de negocio de su API.

| Explora desde el navegador | Gestiona desde la API |
| :--- | :--- |
| Catálogo, búsqueda, categorías y favoritos | Libros, ejemplares y disponibilidad |
| Fichas individuales con información de cada libro | Préstamos, devoluciones y vencimientos |
| Lectores, eventos e inscripciones | Usuarios y control del aforo en eventos |
| Diseño adaptable y ajuste de tamaño de letra | Validaciones, PostgreSQL y documentación OpenAPI |

**La interfaz y la API son dos partes independientes.** La [plataforma web](https://juanjogamero.github.io/MrBibliomante-Sistema-de-Gestion-Bibliotecaria/) funciona con HTML, CSS y JavaScript y guarda los cambios **solo en tu navegador**. No requiere registro ni se conecta al servidor Java. Incluye datos ficticios para probar las funciones; puedes restablecerlos cuando quieras.

## Tecnologías

<p>
<img src="https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white" alt="Java 21">
<img src="https://img.shields.io/badge/Spring_Boot-3.5.5-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot 3.5.5">
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E" alt="JavaScript">
<img src="https://img.shields.io/badge/GitHub_Pages-222222?logo=githubpages&logoColor=white" alt="GitHub Pages">
</p>

**Backend:** Java 21, Spring Boot, Spring Data JPA, PostgreSQL, Jakarta Validation y Swagger/OpenAPI.

**Web interactiva:** HTML, CSS y JavaScript, publicada con GitHub Pages y con almacenamiento local.

## Ejecutar la API en local

Necesitas Java 21 y Docker. Desde la raíz del repositorio:

```bash
docker compose up -d
cd Codigo
./mvnw spring-boot:run
```

En Windows, desde `Codigo`, utiliza `mvnw.cmd spring-boot:run`.

La documentación interactiva del backend estará en **http://localhost:8080/swagger-ui.html**. Las credenciales de PostgreSQL incluidas en la configuración son únicamente para desarrollo local.

Para ejecutar las pruebas, entra en `Codigo` y utiliza `./mvnw test` (en Windows, `mvnw.cmd test`).

## Estructura del repositorio

```text
Codigo/          API REST, entidades, servicios, repositorios y pruebas
docs/            Interfaz web interactiva publicada con GitHub Pages
Documentacion/   Guía técnica, requisitos originales y diagramas UML
scripts/         Pruebas de funcionamiento de la interfaz
.github/         Automatización de pruebas y publicación
```

La guía técnica incluye los endpoints y ejemplos para probar la API: **[ver documentación completa](Documentacion/GUIA_TECNICA.md)**.

## Origen y alcance

Proyecto académico de **PSP · DAM, curso 2025/26**, evolucionado para portfolio manteniendo la arquitectura y funcionalidad original de la API.

La interfaz es una demostración con datos de ejemplo; **no debe confundirse con un frontend conectado a Spring Boot**. El backend no incorpora autenticación ni autorización y está pensado para ejecutarse en un entorno de aprendizaje, no para publicarlo sin protección.

Las cubiertas de la biblioteca pueden proceder de [Open Library](https://openlibrary.org/) o ser ilustraciones editoriales alternativas elaboradas para la demostración. Algunas imágenes externas pueden no estar disponibles.

---

<div align="center">

**[Abrir MrBibliomante](https://juanjogamero.github.io/MrBibliomante-Sistema-de-Gestion-Bibliotecaria/)**

<sub>MrBibliomante · Sistema de Gestión Bibliotecaria · Java / Spring Boot / PostgreSQL</sub>

</div>
