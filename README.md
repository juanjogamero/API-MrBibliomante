<div align="center">

[![MrBibliomante — THE BOOKS: descubrir libros](docs/readme-cover.svg)](https://juanjogamero.github.io/API-MrBibliomante/)

<br>

[![Abrir biblioteca interactiva](https://img.shields.io/badge/EXPLORAR_LA_BIBLIOTECA-FF795E?style=for-the-badge&logo=githubpages&logoColor=white)](https://juanjogamero.github.io/API-MrBibliomante/)

### Descubre tu próxima lectura.

**[Abrir MrBibliomante →](https://juanjogamero.github.io/API-MrBibliomante/)**

Una biblioteca digital para explorar libros reales, descubrir categorías y gestionar tus lecturas.

</div>

---

### Una biblioteca que puedes explorar

Fichas editoriales de libros con portada destacada, sinopsis, disponibilidad, ficha bibliográfica e historial de préstamos. Una interfaz **a pantalla completa**, inspirada en referencias de diseño reales.



| Descubrir libros | Mi biblioteca |
| :--- | :--- |
| Portadas de libros reales, recomendaciones, categorías y búsqueda. | Préstamos, devoluciones, fechas, estados e historial. |

| Eventos literarios | Lectores y favoritos |
| :--- | :--- |
| Encuentros, plazas e inscripciones para la comunidad. | Perfiles de lectores, fichas y tus libros guardados. |

> La web es una **demo interactiva**. Los cambios se guardan solo en tu navegador y puedes restablecerlos. La demo está separada de la API Java original.

### Sobre el proyecto

Proyecto académico de **Desarrollo de Aplicaciones Multiplataforma (DAM)**, convertido en una experiencia de portfolio. La API original gestiona libros, préstamos, usuarios y eventos utilizando Java, Spring Boot y PostgreSQL.

![Java](https://img.shields.io/badge/Java_21-333333?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)

[Explorar el backend](Codigo/src/main/java/com/mrbibliomante) · [Documentación técnica](Documentacion/GUIA_TECNICA.md) · [Requisitos y UML](Documentacion)

<details>
<summary><strong>Cómo ejecutar la API real en local</strong></summary>

Necesitas Java 21 y Docker. Desde la raíz del repositorio:

```bash
docker compose up -d
cd Codigo
./mvnw spring-boot:run
```

En Windows, ejecuta `mvnw.cmd spring-boot:run`.

Abre [Swagger UI](http://localhost:8080/swagger-ui.html) para probar la API.

</details>

---

<div align="center">
<sub>MrBibliomante · Proyecto académico DAM · Diseño de demostración inspirado en una referencia facilitada para este proyecto</sub>

<sub>Las portadas se consultan por ISBN en <a href="https://openlibrary.org/">Open Library</a>. Los datos de lectores y préstamos son ficticios.</sub>
</div>
