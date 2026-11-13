<div align="center">

[![MrBibliomante — Explora la biblioteca digital](docs/readme-cover.svg)](https://juanjogamero.github.io/API-MrBibliomante/)

<br>

[![Abrir demo interactiva](https://img.shields.io/badge/ABRIR_LA_DEMO_INTERACTIVA-E98262?style=for-the-badge&logo=githubpages&logoColor=white)](https://juanjogamero.github.io/API-MrBibliomante/)

### Una biblioteca digital que puedes explorar desde el navegador.

**[juanjogamero.github.io/API-MrBibliomante](https://juanjogamero.github.io/API-MrBibliomante/)**

Una experiencia con diseño editorial, fotografías, fichas interactivas y gestión de préstamos y eventos. **Sin instalar nada.**

</div>

---

### ¿Qué puedes hacer?

| Explorar la biblioteca | Gestionar préstamos |
| :--- | :--- |
| Explora libros con fotografías, filtros, favoritos y fichas individuales con disponibilidad. | Registra préstamos y devoluciones; consulta cada movimiento con su estado e historial. |

| Organizar eventos | Registrar lectores |
| :--- | :--- |
| Explora la agenda cultural, abre fichas de eventos y gestiona plazas e inscripciones. | Da de alta lectores y revisa sus perfiles, préstamos y actividades. |

> **Prueba libremente.** La web es una demo interactiva con datos ficticios: los cambios se guardan solo en tu navegador y puedes restablecerlos cuando quieras. La demo no está conectada a la API Java.

### Diseño renovado

Una interfaz minimalista y más cuidada: botones, tarjetas, filtros, formularios y estados coherentes en móvil y escritorio. **[Explorar la demo →](https://juanjogamero.github.io/API-MrBibliomante/)**

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
