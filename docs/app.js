/* MrBibliomante — Demo local de portfolio. No envía datos a ningún servidor. */
(() => {
  "use strict";
  const STORAGE = "mrbibliomante-demo-v1";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const icon = (name) => '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
  const daysFromNow = (d) => { const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() + d); return date.toISOString().slice(0, 10); };
  const today = () => daysFromNow(0);
  const prettyDate = (s) => new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(s + "T12:00:00Z"));
  const until = (s) => Math.round((new Date(s + "T12:00:00Z") - new Date(today() + "T12:00:00Z")) / 86400000);
  const plural = (n, single, many = single + "s") => n === 1 ? single : many;
  const nextId = (arr) => Math.max(0, ...arr.map(x => Number(x.id) || 0)) + 1;
  const palette = [
    ["#dbe6e8", "#486570", "✧"], ["#f1e0d6", "#9c6b68", "◈"],
    ["#e8e4d8", "#63765b", "✦"], ["#e6e2ef", "#665b88", "◇"],
    ["#dee8ef", "#46637c", "✳"], ["#efe2d9", "#986850", "✹"]
  ];

  function seed() {
    return {
      books: [
        {id:1, title:"La sombra del viento", author:"Carlos Ruiz Zafón", genre:"Novela", language:"Español", isbn:"9788408172178", copies:4, color:1},
        {id:2, title:"Cien años de soledad", author:"Gabriel García Márquez", genre:"Realismo mágico", language:"Español", isbn:"9788437604947", copies:3, color:2},
        {id:3, title:"El nombre del viento", author:"Patrick Rothfuss", genre:"Fantasía", language:"Español", isbn:"9788401352836", copies:2, color:3},
        {id:4, title:"1984", author:"George Orwell", genre:"Distopía", language:"Español", isbn:"9788499890944", copies:3, color:4},
        {id:5, title:"El principito", author:"Antoine de Saint-Exupéry", genre:"Fábula", language:"Español", isbn:"9788478887194", copies:5, color:0},
        {id:6, title:"Los pilares de la Tierra", author:"Ken Follett", genre:"Histórica", language:"Español", isbn:"9788401328513", copies:2, color:5}
      ],
      users: [
        {id:1,name:"Lucía Martínez",email:"lucia@example.com"},
        {id:2,name:"Daniel García",email:"daniel@example.com"},
        {id:3,name:"Elena Rodríguez",email:"elena@example.com"},
        {id:4,name:"Pablo Fernández",email:"pablo@example.com"},
        {id:5,name:"Marta Sánchez",email:"marta@example.com"}
      ],
      loans: [
        {id:1,bookId:1,userId:1,start:daysFromNow(-8),end:daysFromNow(6),returned:null},
        {id:2,bookId:3,userId:2,start:daysFromNow(-20),end:daysFromNow(-4),returned:null},
        {id:3,bookId:4,userId:3,start:daysFromNow(-5),end:daysFromNow(9),returned:null},
        {id:4,bookId:5,userId:4,start:daysFromNow(-12),end:daysFromNow(-2),returned:daysFromNow(-3)},
        {id:5,bookId:2,userId:5,start:daysFromNow(-1),end:daysFromNow(13),returned:null}
      ],
      events: [
        {id:1,title:"Club de lectura: historias que nos unen",description:"Un encuentro para descubrir nuevas historias y compartir nuestras lecturas favoritas.",date:daysFromNow(12),capacity:12,users:[1,3,4]},
        {id:2,title:"Taller de escritura creativa",description:"Ideas, personajes y pequeños relatos en una sesión práctica para todos los niveles.",date:daysFromNow(19),capacity:8,users:[2,5]},
        {id:3,title:"Una tarde de poesía",description:"Versos, autores y conversaciones alrededor de la palabra.",date:daysFromNow(28),capacity:15,users:[1,2,3,5]}
      ],
      activity: [
        {text:"Nuevo préstamo registrado",detail:"La sombra del viento · Lucía Martínez",kind:"book",date:daysFromNow(-1)},
        {text:"Nuevo evento programado",detail:"Una tarde de poesía",kind:"calendar",date:daysFromNow(-2)},
        {text:"Libro incorporado al catálogo",detail:"Los pilares de la Tierra",kind:"book",date:daysFromNow(-3)}
      ]
    };
  }
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE));
      if (saved && ["books","users","loans","events","activity"].every(key => Array.isArray(saved[key]))) return saved;
    } catch (_) { /* Storage may be blocked in privacy mode. */ }
    return seed();
  }
  let db = load(), view = "inicio", search = "", filter = "todos";
  let toastTimer = null;
  const save = () => { try { localStorage.setItem(STORAGE, JSON.stringify(db)); } catch (_) { /* In-memory fallback. */ } };
  const book = id => db.books.find(x => x.id === Number(id));
  const user = id => db.users.find(x => x.id === Number(id));
  const event = id => db.events.find(x => x.id === Number(id));
  const liveLoans = id => db.loans.filter(x => x.bookId === Number(id) && !x.returned);
  const available = b => Math.max(0, b.copies - liveLoans(b.id).length);
  const loanStatus = p => p.returned ? "devuelto" : p.end < today() ? "vencido" : "activo";
  const activeLoans = () => db.loans.filter(p => !p.returned);
  const head = (label, title, subtitle, buttons = "") =>
    '<header class="page-head"><div><span class="eyebrow">' + label +
    '</span><h1>' + title + '</h1><p>' + subtitle + '</p></div>' +
    (buttons ? '<div class="buttons">' + buttons + '</div>' : "") + '</header>';
  const actionButton = (label, action, iconName = "plus", classes = "btn btn-primary", extra = "") =>
    '<button type="button" class="' + classes + '" data-action="' + action + '" ' + extra + '>' +
    icon(iconName) + label + '</button>';
  const badge = (label, tone) => '<span class="badge badge-' + tone + '">' + esc(label) + '</span>';
  const section = (title, action, label) =>
    '<div class="section-head"><h2>' + title + '</h2>' + (action ? '<button class="link-button" data-go="' + action + '">' + label + ' &rarr;</button>' : "") + '</div>';
  const empty = (title, detail) =>
    '<div class="empty"><div class="empty-icon">' + icon("search") + '</div><h3>' + title + '</h3><p>' + detail + '</p></div>';
  const addActivity = (text, detail, kind) => {
    db.activity.unshift({ text, detail, kind, date: today() });
    db.activity = db.activity.slice(0, 12);
  };
  const matches = (...fields) => fields.some(f => String(f ?? "").toLowerCase().includes(search.toLowerCase()));

  function bookCard(b) {
    const [bg, cover, symbol] = palette[(b.color ?? 0) % palette.length];
    const free = available(b), availableBadge = free ? badge(free + " " + plural(free, "disponible", "disponibles"), "green") : badge("Sin ejemplares", "red");
    return '<article class="book-card"><div class="cover-area" style="--cover-bg:' + bg + '"><div class="book-cover" style="--cover:' + cover + '">' +
      '<span class="cover-rule"></span><span class="cover-symbol">' + symbol + '</span><span class="cover-title">' + esc(b.title) +
      '</span><span class="cover-rule"></span></div></div><div class="book-info"><span class="category">' + esc(b.genre) +
      '</span><h3>' + esc(b.title) + '</h3><p class="author-name">' + esc(b.author) + '</p><div class="book-bottom">' +
      availableBadge + '<button class="btn btn-sm" data-action="loan" data-id="' + b.id + '"' + (!free ? " disabled" : "") +
      '>Prestar ' + icon("arrow") + '</button></div></div></article>';
  }
  function stats() {
    const values = [
      {title:"Libros en catálogo",value:db.books.length,desc:"Títulos registrados",icon:"book",color:"peach"},
      {title:"Préstamos activos",value:activeLoans().length,desc:"Ejemplares en circulación",icon:"return",color:"blue"},
      {title:"Lectores",value:db.users.length,desc:"Usuarios registrados",icon:"users",color:"mint"},
      {title:"Próximos eventos",value:db.events.filter(e => e.date >= today()).length,desc:"Actividades programadas",icon:"calendar",color:"purple"}
    ];
    return '<div class="stats-grid">' + values.map(s => '<article class="stat-card"><div class="stat-top"><span class="stat-icon ' +
      s.color + '">' + icon(s.icon) + '</span>' + badge("Demo", "gray") + '</div><div class="stat-value">' +
      s.value + '</div><div class="stat-label">' + s.title + '</div><div class="stat-foot">' + s.desc + '</div></article>').join("") + '</div>';
  }
  function recentActivity() {
    return '<div class="activity-list">' + (db.activity.length ? db.activity.slice(0, 5).map(a =>
      '<div class="activity-item"><span class="activity-icon">' + icon(a.kind || "book") + '</span><div><strong>' +
      esc(a.text) + '</strong><small>' + esc(a.detail) + '</small></div><span class="badge badge-gray">' +
      esc(prettyDate(a.date)) + '</span></div>').join("") : '<p class="results-note">Sin actividad reciente.</p>') + '</div>';
  }
  function homeView() {
    const sample = db.books.slice(0, 3);
    return '<section class="hero"><div class="hero-copy"><span class="eyebrow">UNA NUEVA FORMA DE EXPLORAR</span>' +
      '<h1>Las mejores historias empiezan aquí.</h1><p>Gestiona tu biblioteca en un solo lugar. Explora el catálogo, ' +
      'organiza préstamos y descubre actividades culturales.</p>' +
      actionButton("Explorar catálogo", "browse", "arrow", "btn btn-coral") +
      '</div><div class="hero-art" aria-hidden="true"><div class="hero-visual">' + icon("book") +
      '</div><span class="hero-star star-a">✧</span><span class="hero-star star-b">✦</span></div></section>' +
      head("TU ESPACIO DE LECTURA", "Bienvenido a MrBibliomante", "Un vistazo a lo que está pasando en tu biblioteca.") +
      stats() +
      section("Descubre nuestro catálogo", "libros", "Ver todos los libros") +
      (sample.length ? '<div class="card-grid">' + sample.map(bookCard).join("") + '</div>' : empty("Aún no hay libros", "Añade el primero desde el catálogo.")) +
      section("Actividad de tu biblioteca") +
      '<div class="grid-two"><section class="panel"><h3>Últimos movimientos</h3>' + recentActivity() +
      '</section><section class="panel"><h3>Accesos rápidos</h3><div class="quick-links">' +
      [['Nuevo préstamo',"loan","book"],["Registrar libro","new-book","plus"],["Añadir lector","new-user","users"],["Programar evento","new-event","calendar"]].map(x =>
        '<button type="button" data-action="' + x[1] + '">' + icon(x[2]) + '<span>' + x[0] +
        '</span><span class="arrow-end">' + icon("arrow") + '</span></button>').join("") + '</div></section></div>';
  }
  function booksView() {
    const list = db.books.filter(b => matches(b.title,b.author,b.genre,b.isbn) && (filter === "todos" || (filter === "disponibles" ? available(b) > 0 : available(b) === 0)));
    return head("GESTIÓN DE CATÁLOGO", "Nuestra colección", "Descubre los libros disponibles en la biblioteca.",
      actionButton("Añadir libro", "new-book")) +
      '<div class="filters">' + [["todos","Todos los libros"],["disponibles","Disponibles"],["agotados","Sin ejemplares"]].map(x =>
        '<button class="filter-button' + (filter === x[0] ? " active" : "") + '" data-filter="' + x[0] + '">' + x[1] + '</button>').join("") +
      '</div><p class="results-note">Mostrando ' + list.length + ' de ' + db.books.length + ' títulos · ' +
      db.books.reduce((n,b) => n + available(b),0) + ' ejemplares libres en total</p>' +
      (list.length ? '<div class="card-grid">' + list.map(bookCard).join("") + '</div>' : empty("No encontramos libros", "Prueba con otra búsqueda o añade un título.")); 
  }
  function loansView() {
    const filtered = db.loans.filter(p => matches(book(p.bookId)?.title,user(p.userId)?.name,p.id,loanStatus(p)));
    return head("CIRCULACIÓN Y CONTROL", "Gestión de préstamos",
      "Consulta quién tiene cada ejemplar y registra devoluciones.",
      actionButton("Nuevo préstamo", "loan")) +
      '<div class="table-wrap"><table><thead><tr><th>LIBRO</th><th>LECTOR</th><th>DEVOLUCIÓN PREVISTA</th><th>ESTADO</th><th>ACCIÓN</th></tr></thead><tbody>' +
      (filtered.length ? [...filtered].reverse().map(p => {
        const s = loanStatus(p), label = s === "devuelto" ? "Devuelto" : s === "vencido" ? "Vencido" : "En préstamo";
        return '<tr><td><strong>' + esc(book(p.bookId)?.title || "Libro eliminado") + '</strong><span class="cell-muted">#' +
          p.id + ' · Desde ' + prettyDate(p.start) + '</span></td><td>' + esc(user(p.userId)?.name || "Usuario eliminado") +
          '</td><td>' + prettyDate(p.end) + '</td><td>' + badge(label,s === "devuelto" ? "green" : s === "vencido" ? "red" : "blue") +
          '</td><td>' + (p.returned ? '<span class="cell-muted">Finalizado</span>' :
          '<button class="table-action" data-action="return" data-id="' + p.id + '">Registrar devolución</button>') + '</td></tr>';
      }).join("") : '<tr><td colspan="5">No hay préstamos que coincidan con tu búsqueda.</td></tr>') +
      '</tbody></table></div>';
  }
  function eventsView() {
    const list = db.events.filter(e => matches(e.title,e.description));
    return head("COMUNIDAD Y CULTURA", "Próximos eventos", "Actividades para compartir el placer de leer.",
      actionButton("Crear evento", "new-event")) +
      (list.length ? '<div class="event-grid">' + list.map(e => {
        const date = new Date(e.date + "T12:00:00Z"), day = date.getUTCDate(),
              month = new Intl.DateTimeFormat("es-ES",{month:"short",timeZone:"UTC"}).format(date).toUpperCase().replace(".","");
        const full = e.users.length >= e.capacity, old = e.date < today();
        return '<article class="event-card"><div class="event-top"><div class="event-date"><span class="event-datebox"><b>' +
          day + '</b><small>' + month + '</small></span><span class="eyebrow">ENCUENTRO LITERARIO</span></div>' +
          badge(old ? "Finalizado" : full ? "Completo" : "Plazas abiertas", old ? "gray" : full ? "red" : "green") +
          '</div><h3>' + esc(e.title) + '</h3><p>' + esc(e.description) + '</p>' +
          '<div class="event-meta"><span>' + icon("users") + ' ' + e.users.length + ' de ' + e.capacity + ' inscritos</span><span>' +
          prettyDate(e.date) + '</span></div><div class="progress"><span style="width:' + Math.min(100,e.users.length / Math.max(1,e.capacity) * 100) +
          '%"></span></div><div class="event-actions"><button class="btn btn-primary" data-action="signup" data-id="' + e.id +
          '"' + (old ? " disabled" : "") + '>Gestionar inscripciones ' + icon("arrow") +
          '</button></div></article>';
      }).join("") + '</div>' : empty("Sin eventos disponibles", "Puedes organizar el siguiente encuentro desde aquí."));
  }
  function usersView() {
    const list = db.users.filter(u => matches(u.name,u.email));
    return head("NUESTRA COMUNIDAD", "Lectores de la biblioteca", "Personas que dan vida a cada historia.",
      actionButton("Añadir lector", "new-user")) +
      (list.length ? '<div class="person-list">' + list.map((u,i) => {
        const number = db.loans.filter(p => p.userId === u.id && !p.returned).length;
        const initials = u.name.trim().split(/\s+/).slice(0,2).map(x => x[0]?.toUpperCase() || "").join("");
        const color = palette[i % palette.length];
        return '<article class="person-card"><span class="avatar" style="--avatar-bg:' + color[0] + ';--avatar-color:' + color[1] + '">' +
          esc(initials) + '</span><div><h3>' + esc(u.name) + '</h3><p>' + esc(u.email) + '</p></div>' +
          '<span class="person-stat"><strong>' + number + '</strong>' + plural(number,"préstamo") + '</span></article>';
      }).join("") + '</div>' : empty("No hay lectores", "Puedes añadir un lector nuevo para empezar."));
  }
  function projectView() {
    return head("EL PROYECTO", "Una API, muchas historias", "Conoce la tecnología detrás de MrBibliomante.") +
      '<div class="info-grid"><article class="info-card"><h3>' + icon("book") + ' Backend original</h3><p>' +
      'API REST real desarrollada en Java 21, Spring Boot y Spring Data JPA, con PostgreSQL y una arquitectura organizada ' +
      'en controladores, servicios, repositorios y entidades.</p></article>' +
      '<article class="info-card"><h3>' + icon("spark") + ' Demo interactiva</h3><p>' +
      'Esta interfaz utiliza JavaScript y almacenamiento local para simular el comportamiento de la biblioteca. ' +
      'No ejecuta la API ni modifica ninguna base de datos del servidor.</p></article>' +
      '<article class="info-card"><h3>' + icon("check") + ' Reglas de biblioteca</h3><p>' +
      'Gestiona existencias, préstamos, devoluciones, vencimientos, lectores, eventos e inscripciones. ' +
      'La versión Java implementa estas reglas en su capa de servicios.</p></article>' +
      '<article class="info-card"><h3>' + icon("external") + ' Código abierto</h3><p>' +
      'Puedes revisar los controladores REST, entidades JPA, pruebas automatizadas y documentación técnica en el repositorio.</p>' +
      '<p style="margin-top:14px"><a class="btn btn-primary" target="_blank" rel="noopener noreferrer" ' +
      'href="https://github.com/juanjogamero/API-MrBibliomante">Ver en GitHub ' + icon("external") + '</a></p></article></div>' +
      section("Ejecuta la API auténtica en tu equipo") +
      '<div class="panel"><p class="modal-desc">El backend utiliza PostgreSQL. Para probar sus endpoints reales, ' +
      'descarga el repositorio y ejecuta desde su carpeta raíz:</p><pre class="code-box">docker compose up -d\n' +
      'cd Codigo\n./mvnw spring-boot:run</pre><div class="steps"><div class="step"><span>1</span><div><strong>Levanta PostgreSQL</strong> ' +
      'con Docker Compose.</div></div><div class="step"><span>2</span><div><strong>Ejecuta Spring Boot</strong> ' +
      'utilizando Java 21.</div></div><div class="step"><span>3</span><div><strong>Abre Swagger UI</strong> ' +
      'en http://localhost:8080/swagger-ui.html.</div></div></div></div>';
  }
  const views = {inicio:homeView,libros:booksView,prestamos:loansView,eventos:eventsView,usuarios:usersView,proyecto:projectView};
  const labels = {inicio:"Vista general",libros:"Catálogo",prestamos:"Préstamos",eventos:"Eventos",usuarios:"Lectores",proyecto:"Sobre la API"};
  function render() {
    view = location.hash.replace(/^#/, "") in views ? location.hash.slice(1) : "inicio";
    if (view === "inicio" && location.hash && !views[location.hash.slice(1)]) history.replaceState(null,"","#inicio");
    $("#crumb-name").textContent = labels[view];
    $$(".nav-link[data-view]").forEach(el => {
      const isActive = el.dataset.view === view;
      el.classList.toggle("active", isActive);
      if (isActive) el.setAttribute("aria-current","page");
      else el.removeAttribute("aria-current");
    });
    $("#view").innerHTML = views[view]();
    $("#year").textContent = String(new Date().getFullYear());
  }
  const modal = $("#modal");
  function openModal(title, body) {
    $("#modal-title").textContent = title;
    $("#modal-body").innerHTML = body;
    if (!modal.open) modal.showModal();
    $("#modal-body").querySelector("input:not([type=hidden]),select")?.focus();
  }
  function closeModal() { if (modal.open) modal.close(); }
  function toast(message, error = false) {
    const target = $("#toast");
    target.textContent = message;
    target.className = error ? "show error" : "show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => target.className = "", 3500);
  }
  function field(name,label,kind = "text",required = true,extra = "") {
    return '<div class="form-field"><label for="field-' + name + '">' + label + '</label>' +
      '<input id="field-' + name + '" name="' + name + '" type="' + kind + '"' +
      (required ? " required" : "") + ' ' + extra + '></div>';
  }
  function form(id,fields,submitLabel) {
    return '<form class="form-stack" id="' + id + '">' + fields +
      '<div class="form-actions"><button class="btn" type="button" data-action="close">Cancelar</button>' +
      '<button class="btn btn-primary" type="submit">' + submitLabel + ' ' + icon("arrow") + '</button></div></form>';
  }
  const opt = (id,label) => '<option value="' + id + '">' + esc(label) + '</option>';
  function selectField(name,label,options) {
    return '<div class="form-field"><label for="field-' + name + '">' + label + '</label><select id="field-' +
      name + '" name="' + name + '" required><option value="">Selecciona una opción</option>' + options + '</select></div>';
  }
  function openAction(action, id) {
    if (action === "browse") { location.hash = "#libros"; return; }
    if (action === "close") { closeModal(); return; }
    if (action === "info") {
      openModal("Así funciona esta demo", '<p class="modal-desc">Todo lo que hagas aquí —nuevos libros, préstamos, ' +
        'devoluciones, lectores y eventos— se almacena únicamente en este navegador mediante localStorage. No se ' +
        'conecta a Spring Boot ni envía información a ningún servidor.</p>' +
        '<p class="modal-desc">Usa «Restablecer datos» para volver a los ejemplos iniciales. ' +
        'El backend real está disponible en el repositorio GitHub.</p>' +
        '<div class="form-actions"><button class="btn btn-primary" data-action="close">Entendido</button></div>'); return;
    }
    if (action === "reset") {
      openModal("¿Restablecer la biblioteca?",
        '<p class="modal-desc">Se perderán los cambios guardados en este navegador y volverán los libros, ' +
        'préstamos y eventos de ejemplo.</p><div class="form-actions">' +
        '<button class="btn" data-action="close">Cancelar</button>' +
        '<button class="btn btn-coral" data-action="confirm-reset">Restablecer datos</button></div>'); return;
    }
    if (action === "confirm-reset") { db = seed(); save(); search = ""; $("#global-search").value = ""; filter = "todos"; closeModal(); render(); toast("Biblioteca restablecida correctamente."); return; }
    if (action === "new-book") {
      openModal("Añadir un nuevo libro", '<p class="modal-desc">Incorpora un título al catálogo de la biblioteca.</p>' +
        form("form-book",field("title","Título del libro", "text",true,'maxlength="110"') +
        field("author","Autor", "text",true,'maxlength="100"') +
        selectField("genre","Género",["Novela","Fantasía","Histórica","Distopía","Fábula","Realismo mágico","Ensayo","Poesía","Otros"].map(x=>opt(x,x)).join("")) +
        field("isbn","ISBN (13 dígitos)", "text",true,'pattern="[0-9]{13}" inputmode="numeric" maxlength="13"') +
        field("copies","Número de ejemplares", "number",true,'min="1" max="999" value="1"'),
        "Guardar libro")); return;
    }
    if (action === "new-user") {
      openModal("Registrar lector", '<p class="modal-desc">Crea un lector para poder asociarle préstamos e inscripciones.</p>' +
        form("form-user",field("name","Nombre y apellidos","text",true,'maxlength="100"') +
        field("email","Correo electrónico","email",true,'maxlength="120"'),"Registrar lector")); return;
    }
    if (action === "new-event") {
      openModal("Programar un evento", '<p class="modal-desc">Invita a la comunidad a una nueva actividad cultural.</p>' +
        form("form-event",field("title","Título del evento","text",true,'maxlength="140"') +
        field("description","Descripción","text",true,'maxlength="240"') +
        field("date","Fecha del evento","date",true,'min="' + daysFromNow(1) + '"') +
        field("capacity","Aforo máximo","number",true,'min="1" max="999" value="15"'),"Crear evento")); return;
    }
    if (action === "loan") {
      if (!db.users.length || !db.books.some(b => available(b))) {
        toast("Añade un lector y un libro disponible antes de prestar.",true); return;
      }
      const availableBooks = db.books.filter(b => available(b));
      openModal("Registrar nuevo préstamo", '<p class="modal-desc">Elige un ejemplar disponible y la persona que lo solicita.</p>' +
        form("form-loan",selectField("bookId","Libro",availableBooks.map(b=>opt(b.id,b.title + " (" + available(b) + " disponibles)")).join("")) +
        selectField("userId","Lector",db.users.map(u=>opt(u.id,u.name)).join("")) +
        field("end","Fecha prevista de devolución","date",true,'min="' + daysFromNow(1) + '" value="' + daysFromNow(14) + '"'),
        "Confirmar préstamo"));
      if (id && availableBooks.some(b => b.id === Number(id))) $("#field-bookId").value = String(id);
      return;
    }
    if (action === "return") {
      const loan = db.loans.find(p => p.id === Number(id));
      if (!loan || loan.returned) { toast("Este préstamo ya no está activo.",true); return; }
      openModal("Registrar devolución",'<p class="modal-desc">¿Confirmas que <strong>' +
        esc(user(loan.userId)?.name) + '</strong> ha devuelto <strong>' +
        esc(book(loan.bookId)?.title) + '</strong>? El ejemplar volverá a estar disponible.</p>' +
        '<div class="form-actions"><button class="btn" data-action="close">Cancelar</button>' +
        '<button class="btn btn-primary" data-action="confirm-return" data-id="' + loan.id +
        '">Confirmar devolución ' + icon("check") + '</button></div>'); return;
    }
    if (action === "confirm-return") {
      const loan = db.loans.find(p => p.id === Number(id));
      if (!loan || loan.returned) return;
      loan.returned = today();
      addActivity("Préstamo devuelto",book(loan.bookId)?.title || "Libro","return");
      save(); closeModal(); render(); toast("Devolución registrada. Ejemplar disponible."); return;
    }
    if (action === "signup") {
      const e = event(id);
      if (!e) return;
      const members = e.users.map(uid => user(uid)).filter(Boolean);
      const options = db.users.filter(u => !e.users.includes(u.id));
      const full = e.users.length >= e.capacity;
      openModal("Inscripciones del evento",
        '<p class="modal-desc"><strong>' + esc(e.title) + '</strong><br>' +
        e.users.length + ' inscritos de ' + e.capacity + ' plazas disponibles.</p>' +
        (members.length ? '<div class="modal-list"><label class="form-field">Lectores inscritos</label>' +
        members.map(u=>'<div class="modal-person"><span>' + esc(u.name) + '</span><button type="button" data-action="unregister" data-id="' + e.id +
        '" data-user="' + u.id + '">Cancelar inscripción</button></div>').join("") + '</div>' :
        '<p class="modal-desc">Todavía no hay inscritos.</p>') +
        (full ? '<p class="modal-desc" style="margin-top:16px">El aforo está completo.</p>' :
         '<div style="margin-top:18px">' + (options.length ? form("form-signup",
           '<input type="hidden" name="eventId" value="' + e.id + '">' +
           selectField("userId","Inscribir nuevo lector",options.map(u=>opt(u.id,u.name)).join("")),"Inscribir lector") :
           '<p class="modal-desc">Todos los lectores registrados están inscritos.</p>') + '</div>')); return;
    }
  }

  // Action dispatcher reads both IDs without exposing user content as executable HTML.
  function handleAction(button) {
    const action = button.dataset.action;
    if (action === "unregister") {
      const e = event(button.dataset.id), uid = Number(button.dataset.user);
      if (!e || !e.users.includes(uid)) return;
      e.users = e.users.filter(x => x !== uid);
      addActivity("Inscripción cancelada", e.title, "calendar");
      save();
      openAction("signup",e.id);
      render();
      toast("Inscripción cancelada.");
      return;
    }
    openAction(action,button.dataset.id);
  }

  function handleForm(formElement) {
    const d = Object.fromEntries(new FormData(formElement));
    const text = k => String(d[k] ?? "").trim();
    const validDate = x => /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x));
    if (formElement.id === "form-book") {
      if (!/^\d{13}$/.test(text("isbn")) || db.books.some(b => b.isbn === text("isbn"))) { toast("Introduce un ISBN de 13 cifras que no esté registrado.",true); return; }
      const copies = Number(d.copies);
      if (!Number.isInteger(copies) || copies < 1 || copies > 999) {toast("El número de ejemplares no es válido.",true);return;}
      const b = {id:nextId(db.books),title:text("title"),author:text("author"),genre:text("genre"),language:"Español",
        isbn:text("isbn"),copies,color:db.books.length % palette.length};
      db.books.push(b); addActivity("Nuevo libro registrado",b.title,"book");
      save();closeModal();location.hash="#libros";render();toast("Libro añadido al catálogo.");return;
    }
    if (formElement.id === "form-user") {
      if (!text("name") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text("email")) ||
          db.users.some(u => u.email.toLowerCase() === text("email").toLowerCase())) {toast("Revisa el nombre y utiliza un correo no registrado.",true);return;}
      const u={id:nextId(db.users),name:text("name"),email:text("email")};
      db.users.push(u);addActivity("Nuevo lector registrado",u.name,"users");
      save();closeModal();location.hash="#usuarios";render();toast("Lector registrado.");return;
    }
    if (formElement.id === "form-event") {
      const cap = Number(d.capacity);
      if (!text("title") || !text("description") || !validDate(text("date")) || text("date") <= today() ||
         !Number.isInteger(cap) || cap < 1 || cap > 999) {toast("Comprueba la fecha futura, el aforo y los campos.",true);return;}
      const e={id:nextId(db.events),title:text("title"),description:text("description"),date:text("date"),capacity:cap,users:[]};
      db.events.push(e);addActivity("Evento programado",e.title,"calendar");
      save();closeModal();location.hash="#eventos";render();toast("Evento creado.");return;
    }
    if (formElement.id === "form-loan") {
      const b=book(d.bookId),u=user(d.userId),end=text("end");
      if (!b || !u || available(b)<1 || !validDate(end) || end<=today()) {toast("Préstamo no válido. Verifica ejemplares y fecha.",true);return;}
      const p={id:nextId(db.loans),bookId:b.id,userId:u.id,start:today(),end,returned:null};
      db.loans.push(p);addActivity("Nuevo préstamo registrado",b.title+" · "+u.name,"book");
      save();closeModal();location.hash="#prestamos";render();toast("Préstamo registrado correctamente.");return;
    }
    if (formElement.id === "form-signup") {
      const e=event(d.eventId),u=user(d.userId);
      if (!e || !u || e.date<today() || e.users.includes(u.id) || e.users.length>=e.capacity) {toast("No es posible realizar esta inscripción.",true);return;}
      e.users.push(u.id);addActivity("Nueva inscripción",e.title+" · "+u.name,"calendar");
      save();openAction("signup",e.id);render();toast("Lector inscrito correctamente.");
    }
  }

  document.addEventListener("click", ev => {
    const actionEl = ev.target.closest("[data-action]");
    if (actionEl) {
      if (actionEl.disabled) return;
      handleAction(actionEl); return;
    }
    const go = ev.target.closest("[data-go]");
    if (go) location.hash = "#" + go.dataset.go;
    const filterButton = ev.target.closest("[data-filter]");
    if (filterButton) { filter = filterButton.dataset.filter; render(); }
  });
  document.addEventListener("submit", ev => {
    if (!ev.target.matches("#modal-body form")) return;
    ev.preventDefault();
    if (ev.target.reportValidity()) handleForm(ev.target);
  });
  $("#global-search").addEventListener("input", e => {
    search = e.target.value.trim();
    if (search && !["libros","usuarios","prestamos","eventos"].includes(view)) {
      location.hash="#libros";
    } else render();
  });
  document.addEventListener("keydown", e => {
    if (e.key==="/" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName) && !modal.open) {
      e.preventDefault();$("#global-search").focus();
    }
  });
  window.addEventListener("hashchange", render);
  $("#close-modal").addEventListener("click", closeModal);
  modal.addEventListener("click",ev=>{ if (ev.target===modal) closeModal(); });
  if (!location.hash) history.replaceState(null,"","#inicio");
  render();
})();
