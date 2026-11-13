# MrBibliomante — Guía técnica de la API REST

![Java 21](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.5-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Swagger](https://img.shields.io/badge/OpenAPI-Swagger-85EA2D?logo=swagger&logoColor=black)

API REST para administrar el catálogo de una biblioteca, préstamos y devoluciones, lectores y actividades culturales. Proyecto desarrollado originalmente durante el ciclo de **Desarrollo de Aplicaciones Multiplataforma (DAM)**, ampliado a partir de la misma arquitectura para convertirlo en un proyecto de portfolio.

> **Alcance:** backend académico. No incorpora autenticación ni autorización. No se debe publicar como servicio con escritura abierta en Internet.


## Demo interactiva — GitHub Pages

**[Abrir la demo de MrBibliomante](https://juanjogamero.github.io/MrBibliomante-Sistema-de-Gestion-Bibliotecaria/)**

La interfaz web permite explorar el catálogo, abrir fichas individuales, gestionar préstamos, lectores y eventos de ejemplo, utilizar filtros y favoritos y ajustar el tamaño del texto. Los cambios se guardan en el navegador.

> **Importante:** es una **demostración independiente** desarrollada con HTML, CSS y JavaScript, no un frontend conectado a la API Spring Boot. Los datos iniciales son ficticios y los cambios se guardan en `localStorage` del navegador. No se envía la información de la biblioteca al servidor Java ni existe inicio de sesión en la demo. Las portadas externas se consultan mediante Open Library.

### Publicación

La interfaz vive en `docs/`. Para publicarla, entra en **Settings → Pages** y en **Build and deployment → Source** selecciona **GitHub Actions**. El workflow `.github/workflows/pages.yml` publica el contenido de `docs/` cuando hay cambios en `main`. No necesitas comprar ningún dominio.

## Funcionalidades

- Catálogo de libros: altas, consultas, modificaciones, bajas y búsqueda por título/autor.
- Control de ejemplares y consulta de disponibilidad.
- Préstamos asociados a lectores: alta, devolución, consulta por usuario y vencimientos.
- Bloqueo transaccional para evitar prestar el último ejemplar a dos solicitudes concurrentes.
- Eventos culturales: creación, inscripción, cancelación y control de aforo.
- Gestión básica de usuarios, bibliotecarios y administradores.
- Validación de datos, errores HTTP y documentación Swagger.

## Tecnologías

| Componente | Tecnología |
| --- | --- |
| Lenguaje | Java 21 |
| Backend | Spring Boot 3.5.5 |
| Persistencia | Spring Data JPA / Hibernate |
| Base de datos | PostgreSQL |
| Validación | Jakarta Bean Validation |
| Documentación | springdoc-openapi / Swagger UI |
| Build y pruebas | Maven / JUnit 5 / Mockito |

## Instalación

Requisitos: **Java 21** y **Docker** para la base de datos (o PostgreSQL instalado localmente).

```bash
# 1. Desde la raíz del repositorio
docker compose up -d

# 2. Arrancar la aplicación
cd Codigo
./mvnw spring-boot:run
```

En Windows, desde `Codigo`:

```powershell
.\mvnw.cmd spring-boot:run
```

La API estará disponible en **http://localhost:8080**.

- [Swagger UI](http://localhost:8080/swagger-ui.html): explorar y probar endpoints.
- [Especificación OpenAPI](http://localhost:8080/v3/api-docs): contrato JSON.

### Configuración

| Variable | Valor local por defecto | Descripción |
| --- | --- | --- |
| `PORT` | `8080` | Puerto de la API |
| `DB_URL` | `jdbc:postgresql://localhost:5432/mrbibliomante` | URL JDBC |
| `DB_USER` | `postgres` | Usuario de base de datos |
| `DB_PASSWORD` | `postgres` | Contraseña local de desarrollo |

Las credenciales predeterminadas son **solo para desarrollo local**. Cámbialas en cualquier otro entorno.

### Flujo rápido de uso

1. Crear un lector con `POST /usuario`.
2. Crear un título con `POST /libro`.
3. Consultar el stock con `GET /libro/{id}/disponibilidad`.
4. Crear un préstamo con `POST /prestamo/{idLibro}`, indicando fecha de devolución y lector.
5. Devolverlo con `PUT /prestamo/finish/{idPrestamo}`.

**Ejemplo: crear un libro**

```http
POST /libro
Content-Type: application/json

{
  "tituloLibro": "El nombre de la rosa",
  "autor": "Umberto Eco",
  "genero": "Novela",
  "idioma": "Español",
  "ISBN": "9788426418800",
  "numEjemplar": 3
}
```

**Ejemplo: crear un lector**

```http
POST /usuario
Content-Type: application/json

{
  "nombre": "Ana",
  "primerApellido": "López",
  "mail": "ana@example.com",
  "telefono": "612345678"
}
```

**Ejemplo: solicitar un préstamo** (sustituye los identificadores y utiliza una fecha futura respecto al momento en que lo pruebes):

```http
POST /prestamo/1
Content-Type: application/json

{
  "usuario": { "id": 1 },
  "fechaFin": "2027-06-30"
}
```

El servidor establece la fecha de inicio y el estado `ACTIVO`. Una devolución cambia el estado a `DEVUELTO`; los vencimientos se revisan automáticamente cada hora.

### Eventos

```http
POST /evento/1/usuarios/1
```

Para cancelar la inscripción: `DELETE /evento/1/usuarios/1`. Consultar plazas: `GET /evento/1/disponibilidad`. La identidad del usuario se recibe por URL, porque esta versión **no implementa inicio de sesión**.

## Referencia de endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET / POST | `/libro` | Listar, buscar (`?buscar=`) o crear |
| GET / PUT / DELETE | `/libro/{id}` | Consultar, actualizar o borrar |
| GET | `/libro/{id}/disponibilidad` | Stock libre |
| GET / POST | `/prestamo` / `/prestamo/{idLibro}` | Listar o crear |
| GET | `/prestamo/usuario/{idUser}` | Historial de un lector |
| GET | `/prestamo/vencidos` | Préstamos vencidos |
| PUT | `/prestamo/finish/{id}` | Registrar devolución |
| PUT | `/prestamo/mature/{id}` | Marcar como vencido si ya pasó el plazo |
| GET / POST | `/evento` | Listar o crear |
| GET / PUT / DELETE | `/evento/{id}` | Consultar, actualizar o borrar |
| GET | `/evento/{id}/disponibilidad` | Plazas libres |
| POST / DELETE | `/evento/{id}/usuarios/{idUsuario}` | Inscribir / cancelar |
| GET / POST | `/usuario`, `/admin`, `/bibliotecario` | Listar o crear actores |

El resto de operaciones CRUD de actores se puede explorar en Swagger UI. Las respuestas siguen las convenciones `201` (creación), `204` (operaciones sin cuerpo), `400` (validación), `404` (no encontrado) y `409` (conflicto) en las rutas revisadas.

## Tests

```bash
cd Codigo
./mvnw test
```

En GitHub Actions el workflow **Java checks** ejecuta los tests con un servicio PostgreSQL 16 para la prueba de contexto y las pruebas de negocio. En local necesitas tener la base de datos disponible para ejecutar la suite completa.

## Organización

```text
Codigo/
  src/main/java/com/mrbibliomante/
    controller/   # endpoints y respuestas HTTP
    service/      # reglas de negocio y transacciones
    repository/   # consultas JPA
    entity/       # modelo de datos
  src/test/       # pruebas
Documentacion/    # guía técnica, requisitos y UML originales
docker-compose.yml
```

## Limitaciones actuales

- No se ha implementado autenticación ni autorización: es una API académica, no un backend público endurecido.
- `ddl-auto=update` facilita el desarrollo local, pero no sustituye las migraciones SQL en producción.
- Al finalizar un préstamo se mantiene el historial; no se permite eliminarlo por API.
- La implementación guarda fechas de préstamo con `LocalDate` y estados como texto. Si ya existe una base PostgreSQL antigua, haz una copia y revisa las migraciones antes de utilizar esta versión.

## Origen y evolución

La versión original fue un proyecto de repaso de API RESTful para **PSP — DAM, curso 2025/26**. Esta ampliación conserva los dominios y las capas existentes, corrige las reglas de disponibilidad e inscripciones y añade herramientas de documentación y pruebas.

**Repositorio:** [MrBibliomante — Sistema de Gestión Bibliotecaria](https://github.com/juanjogamero/MrBibliomante-Sistema-de-Gestion-Bibliotecaria)

