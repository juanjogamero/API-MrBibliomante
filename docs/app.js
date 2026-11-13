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

  
  // Portadas originales obtenidas de Open Library, asociadas al ISBN del catálogo.
  // Las publicaciones sin portada disponible recurren a una imagen editorial.
  const photoIds = [
    "photo-1544947950-fa07a98d237f",
    "photo-1495446815901-a7297e633e8d",
    "photo-1512820790803-83ca734da794",
    "photo-1481627834876-b7833e8f5570",
    "photo-1507842217343-583bb7270b66",
    "photo-1532012197267-da84d127e765"
  ];
  const photo = (b, w = 760) => "https://images.unsplash.com/" +
      photoIds[((Number(b?.color ?? b?.id ?? 0) % photoIds.length) + photoIds.length) % photoIds.length] +
      "?auto=format&fit=crop&w=" + w + "&q=82";
  const cover = b => b && /^\\d{13}$/.test(String(b.isbn || "")) ?
    "https://covers.openlibrary.org/b/isbn/" + b.isbn + "-L.jpg" : null;
  const coverImage = (b, kind = "") => '<img class="real-cover ' + kind + '" src="' +
    esc(cover(b) || photo(b,400)) + '" alt="Portada de ' + esc(b?.title || "libro") +
    '" loading="lazy" decoding="async">';
    let genreFilter = "todos", catalogSort = "titulo", loanFilter = "todos", viewMode = "grid";
  if (!Array.isArray(db.favorites)) db.favorites = [];
  const fav = id => db.favorites.includes(Number(id));
  const avatarText = name => String(name || "").trim().split(/\s+/).slice(0,2).map(x => x[0] || "").join("").toUpperCase();
  const kpi = (number, label, iconName) => '<div class="detail-kpi"><span>' + icon(iconName) +
    '</span><div><strong>' + esc(number) + '</strong><small>' + esc(label) + '</small></div></div>';
  const back = (section, label) => '<a class="back-link" href="#' + section + '">← ' + esc(label) + '</a>';
  const statStatus = s => s === "devuelto" ? badge("Devuelto", "green") : s === "vencido" ?
    badge("Vencido", "red") : badge("En circulación", "blue");

  function bookCard(b) {
    const free = available(b);
    return '<article class="book-card book-card-v2">' +
      '<a class="photo-frame" href="#libros/' + b.id + '" aria-label="Ver ficha de ' + esc(b.title) + '">' +
      coverImage(b) + '</a>' +
      '<button type="button" class="favorite-overlay' + (fav(b.id) ? ' is-favorite' : '') +
      '" data-action="favorite" data-id="' + b.id + '" aria-label="' +
      (fav(b.id) ? 'Quitar de favoritos: ' : 'Guardar en favoritos: ') + esc(b.title) + '" aria-pressed="' + fav(b.id) +
      '" title="' + (fav(b.id) ? 'Quitar de favoritos' : 'Guardar en favoritos') + '">' + (fav(b.id) ? '♥' : '♡') + '</button>' +
      '<div class="book-info"><div class="book-eyebrow">' + esc(b.genre) + '</div>' +
      '<a class="book-title-link" href="#libros/' + b.id + '"><h3>' + esc(b.title) + '</h3></a>' +
      '<p class="author-name">' + esc(b.author) + '</p>' +
      '<div class="book-bottom">' + (free ? badge(free + ' disponibles',"green") : badge("Sin disponibilidad","red")) +
      '<a class="book-explore" href="#libros/' + b.id + '" aria-label="Ver detalles de ' + esc(b.title) + '">' + icon("arrow") + '</a></div></div></article>';
  }
    function stats() {
    const values = [
      {title:"Libros en catálogo",value:db.books.length,desc:"Títulos registrados",icon:"book",color:"peach"},
      {title:"Préstamos activos",value:activeLoans().length,desc:"Ejemplares en circulación",icon:"return",color:"blue"},
      {title:"Lectores",value:db.users.length,desc:"Usuarios registrados",icon:"users",color:"mint"},
      {title:"Próximos eventos",value:db.events.filter(e => e.date >= today()).length,desc:"Actividades programadas",icon:"calendar",color:"purple"}
    ];
    return '<div class="stats-grid">' + values.map(s => '<article class="stat-card"><div class="stat-top"><span class="stat-icon ' +
      s.color + '">' + icon(s.icon) + '</span><span class="stat-label-top">RESUMEN</span></div><div class="stat-value">' +
      s.value + '</div><div class="stat-label">' + s.title + '</div><div class="stat-foot">' + s.desc + '</div></article>').join("") + '</div>';
  }
  function recentActivity() {
    return '<div class="activity-list">' + (db.activity.length ? db.activity.slice(0, 5).map(a =>
      '<div class="activity-item"><span class="activity-icon">' + icon(a.kind || "book") + '</span><div><strong>' +
      esc(a.text) + '</strong><small>' + esc(a.detail) + '</small></div><span class="badge badge-gray">' +
      esc(prettyDate(a.date)) + '</span></div>').join("") : '<p class="results-note">Sin actividad reciente.</p>') + '</div>';
  }
  function homeView() {
    const recommendations = db.books.slice(0,4);
    const categories = [
      {genre:"Novela",title:"Novela",book:db.books.find(b=>b.genre==="Novela") || db.books[0]},
      {genre:"Fantasía",title:"Fantasía",book:db.books.find(b=>b.genre==="Fantasía") || db.books[1]},
      {genre:"Distopía",title:"Distopía",book:db.books.find(b=>b.genre==="Distopía") || db.books[2]},
      {genre:"Histórica",title:"Histórica",book:db.books.find(b=>b.genre==="Histórica") || db.books[3]}
    ];
    return '<div class="discover-page">' +
      '<div class="discover-head"><div class="discover-intro"><span class="mobile-eyebrow">MRBIBLIOMANTE / BIBLIOTECA</span><h1>Discover</h1>' +
      '<form id="discover-search-form" class="discover-search">' +
      '<label class="discover-select"><select id="discover-genre" aria-label="Categoría para buscar"><option value="todos">Todas las categorías</option>' +
      [...new Set(db.books.map(b=>b.genre))].sort().map(g=>'<option value="'+esc(g)+'">'+esc(g)+'</option>').join("") +
      '</select>' + icon("chevron") + '</label>' +
      '<span class="discover-divider"></span>' + icon("search") +
      '<input id="discover-query" type="search" placeholder="Encuentra el libro que te gusta..." aria-label="Buscar libros">' +
      '<button type="submit">Buscar</button></form></div></div>' +
      '<section class="recommend-section"><div class="discover-section-head"><h2>Book Recommendation</h2>' +
      '<a class="view-all" href="#libros">Ver todos <span>›</span></a></div>' +
      (recommendations.length ? '<div class="recommend-grid">' +
      recommendations.map((b,i)=>'<a class="recommend-book" href="#libros/'+b.id+'" aria-label="Ver '+esc(b.title)+'">' +
      '<span class="recommend-book-image">'+coverImage(b)+'</span>' +
      '<span class="recommend-book-details"><strong>'+esc(b.title)+'</strong><small>'+esc(b.author)+'</small></span></a>').join("") +
      '</div>' : empty("Todavía no hay libros","Añade tu primer título al catálogo.")) + '</section>' +
      '<section class="category-section"><div class="discover-section-head"><h2>Book Category</h2>' +
      '<a class="category-view-all" href="#libros" aria-label="Todas las categorías">'+icon("grid")+'</a></div>' +
      '<div class="category-grid">' + categories.map(item=>'<button type="button" class="category-card" data-action="category" data-category="'+esc(item.genre)+'">' +
      '<span class="category-stage">' + (item.book ? coverImage(item.book) : icon("book")) + '</span>' +
      '<strong>'+esc(item.title)+'</strong></button>').join("") + '</div></section>' +
      '<section class="discover-extras"><div class="discover-extra-head"><span class="eyebrow">TU BIBLIOTECA</span>' +
      '<h2>Un universo de historias</h2><p>Además de explorar libros, también puedes gestionar préstamos y actividades.</p></div>' +
      stats() + '<div class="home-panels"><div class="panel modern-panel"><div class="panel-heading"><h3>Actividad reciente</h3><a href="#prestamos">Ver préstamos ↗</a></div>' +
      recentActivity() + '</div><div class="panel modern-panel"><div class="panel-heading"><h3>Acciones rápidas</h3><span>GESTIÓN</span></div>' +
      '<div class="quick-actions-v2">' +
      [["Prestar un libro","loan","book"],["Añadir libro","new-book","plus"],["Nuevo lector","new-user","users"],["Crear evento","new-event","calendar"]].map(x =>
        '<button type="button" data-action="'+x[1]+'"><span class="quick-circle">'+icon(x[2])+'</span><strong>'+x[0]+'</strong>'+icon("arrow")+'</button>').join("") +
      '</div></div></div></section></div>';
  }
    function booksView() {
    const genres = [...new Set(db.books.map(b => b.genre))].sort((a,b)=>a.localeCompare(b,"es"));
    let list = db.books.filter(b =>
      matches(b.title,b.author,b.genre,b.isbn) &&
      (filter === "todos" || (filter === "disponibles" ? available(b) > 0 :
        filter === "favoritos" ? fav(b.id) : available(b) === 0)) &&
      (genreFilter === "todos" || b.genre === genreFilter));
    list = list.slice().sort((a,b) => catalogSort === "autor" ? a.author.localeCompare(b.author,"es") :
      catalogSort === "stock" ? available(b)-available(a) : a.title.localeCompare(b.title,"es"));
    const filters = [["todos","Todos"],["disponibles","Disponibles"],["agotados","Agotados"],["favoritos","Guardados"]];
    return head("COLECCIÓN / CATÁLOGO", "Explora nuestra biblioteca",
      "Historias, autores y nuevos descubrimientos, en un mismo lugar.",
      actionButton("Añadir libro","new-book","plus","btn btn-primary")) +
      '<div class="catalog-toolbar"><div class="filters">' + filters.map(x =>
        '<button class="filter-button' + (filter === x[0] ? " active" : "") + '" data-filter="' + x[0] + '">' + x[1] +
        (x[0] === "favoritos" ? ' <span class="filter-count">' + db.favorites.length + '</span>' : '') + '</button>').join("") + '</div>' +
      '<div class="toolbar-right"><label class="select-wrap">Género <select data-select="genre" aria-label="Filtrar por género">' +
        '<option value="todos">Todos</option>' + genres.map(g=>'<option value="'+esc(g)+'"'+(genreFilter===g?' selected':'')+'>'+esc(g)+'</option>').join("") +
        '</select></label><label class="select-wrap">Ordenar <select data-select="catalog-sort" aria-label="Ordenar catálogo">' +
        [["titulo","Título A-Z"],["autor","Autor A-Z"],["stock","Más disponibles"]].map(x=>'<option value="'+x[0]+'"'+(catalogSort===x[0]?' selected':'')+'>'+x[1]+'</option>').join("") +
        '</select></label><div class="view-toggle"><button class="'+(viewMode==="grid"?"is-active":"")+'" data-viewmode="grid" aria-label="Vista en cuadrícula" title="Cuadrícula">▦</button>' +
        '<button class="'+(viewMode==="list"?"is-active":"")+'" data-viewmode="list" aria-label="Vista en lista" title="Lista">☷</button></div></div></div>' +
      '<p class="results-note">' + list.length + ' de ' + db.books.length + ' títulos <span>·</span> ' +
      db.books.reduce((n,b)=>n+available(b),0) + ' ejemplares disponibles</p>' +
      (list.length ? '<div class="card-grid card-grid-v2 ' + (viewMode === "list" ? "catalog-list" : "") + '">' +
        list.map(bookCard).join("") + '</div>' :
        empty("Sin resultados", "Cambia los filtros o busca otro título."));
}
  function loansView() {
    const statusFilters = [["todos","Todos"],["activo","Activos"],["vencido","Vencidos"],["devuelto","Devueltos"]];
    const filtered = db.loans.filter(p => matches(book(p.bookId)?.title,user(p.userId)?.name,p.id,loanStatus(p)) &&
      (loanFilter === "todos" || loanStatus(p) === loanFilter)).slice().reverse();
    return head("CIRCULACIÓN / PRÉSTAMOS", "Control de préstamos",
      "Cada ejemplar tiene su historia. Consulta los movimientos y las fechas de devolución.",
      actionButton("Registrar préstamo","loan")) +
      '<div class="loans-summary"><span>' + kpi(activeLoans().length,"En circulación","return") + '</span><span>' +
      kpi(db.loans.filter(p=>loanStatus(p)==="vencido").length,"Fuera de plazo","clock") +
      '</span><span>' + kpi(db.loans.filter(p=>!!p.returned).length,"Devueltos","check") + '</span></div>' +
      '<div class="filters loan-filters">' + statusFilters.map(x =>
        '<button class="filter-button'+(loanFilter===x[0]?" active":"")+'" data-loanfilter="'+x[0]+'">'+x[1]+'</button>').join("")+'</div>' +
      '<div class="table-wrap table-modern"><table><thead><tr><th>LIBRO</th><th>LECTOR</th><th>VENCIMIENTO</th><th>ESTADO</th><th></th></tr></thead><tbody>' +
      (filtered.length ? filtered.map(p=> {
        const b=book(p.bookId), u=user(p.userId), s=loanStatus(p);
        return '<tr><td><a class="table-book" href="#prestamos/'+p.id+'"><img src="'+(cover(b)||photo(b,130))+'" loading="lazy" alt="">' +
          '<span><strong>'+esc(b?.title||"Libro")+'</strong><small>Préstamo #'+String(p.id).padStart(3,"0")+'</small></span></a></td>' +
          '<td><a class="table-inline-link" href="#usuarios/'+(u?.id||0)+'">'+esc(u?.name||"Lector")+'</a></td>' +
          '<td><strong>'+prettyDate(p.end)+'</strong><small class="cell-muted">'+(p.returned?"Devuelto el "+prettyDate(p.returned):
            s==="vencido"?"Retraso de "+Math.abs(until(p.end))+" días":"Quedan "+until(p.end)+" días")+'</small></td>' +
          '<td>'+statStatus(s)+'</td><td class="table-end"><a class="table-action" href="#prestamos/'+p.id+'">Ver detalle ↗</a></td></tr>';
      }).join("") : '<tr><td colspan="5" class="empty-row">No hay préstamos con este filtro.</td></tr>') + '</tbody></table></div>';
}
  function eventsView() {
  const list=db.events.filter(e=>matches(e.title,e.description));
  return head("CULTURA / ENCUENTROS", "Eventos que nos reúnen",
    "Clubes de lectura, talleres y planes para amantes de las historias.",
    actionButton("Crear evento","new-event"))+
  '<div class="event-grid event-grid-v2">'+(list.length?list.map((e,i)=>{
    const past=e.date<today(),full=e.users.length>=e.capacity;
    return '<article class="event-card event-card-v2"><a href="#eventos/'+e.id+'" class="event-photo" aria-label="Ver evento '+esc(e.title)+'">' +
      '<img src="'+photo({color:i+3},850)+'" alt="Fotografía de biblioteca y libros" loading="lazy">' +
      '<span class="event-photo-date">'+prettyDate(e.date)+'</span></a><div class="event-card-content">'+
      '<div class="event-topline">'+badge(past?"Finalizado":full?"Completo":"Inscripción abierta",past?"gray":full?"red":"green")+
      '<span>EVENTO #'+String(e.id).padStart(2,"0")+'</span></div><h3><a href="#eventos/'+e.id+'">'+esc(e.title)+'</a></h3><p>'+esc(e.description)+'</p>'+
      '<div class="event-meta">'+icon("users")+' '+e.users.length+'/'+e.capacity+' inscritos <span>'+
      Math.max(0,e.capacity-e.users.length)+' plazas libres</span></div>'+
      '<div class="progress"><span style="width:'+Math.min(100,e.users.length/Math.max(1,e.capacity)*100)+'%"></span></div>'+
      '<a class="event-detail-link" href="#eventos/'+e.id+'">Ver el evento '+icon("arrow")+'</a></div></article>';
  }).join(""):empty("Sin eventos","Programa una nueva actividad."))+'</div>';
}
  function usersView() {
  const list=db.users.filter(u=>matches(u.name,u.email));
  return head("COMUNIDAD / LECTORES","Nuestra comunidad lectora",
    "Personas, lecturas y conversaciones que dan vida a la biblioteca.",
    actionButton("Añadir lector","new-user"))+
  (list.length?'<div class="person-list person-grid-v2">'+list.map((u,i)=>{
    const loans=db.loans.filter(p=>p.userId===u.id),active=loans.filter(p=>!p.returned).length;
    return '<a class="person-card person-card-v2" href="#usuarios/'+u.id+'"><span class="avatar reader-avatar" style="--avatar-bg:'+palette[i%6][0]+';--avatar-color:'+palette[i%6][1]+'">'+esc(avatarText(u.name))+'</span>'+
      '<div class="reader-copy"><h3>'+esc(u.name)+'</h3><p>'+esc(u.email)+'</p><span>'+loans.length+' préstamos registrados</span></div>'+
      '<div class="person-stat"><strong>'+active+'</strong>en curso</div><span class="reader-arrow">'+icon("arrow")+'</span></a>';
  }).join("")+'</div>':empty("No hay lectores","Registra un lector para empezar."));
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
  
function bookDetailView(b) {
  const free=available(b),loans=db.loans.filter(p=>p.bookId===b.id).slice().reverse(), related=db.books.filter(x=>x.id!==b.id && x.genre===b.genre).slice(0,3);
  return '<div class="detail-top">'+back("libros","Volver al catálogo")+'<span>CATÁLOGO / LIBRO #'+String(b.id).padStart(3,"0")+'</span></div>'+
    '<section class="book-detail"><div class="detail-photo"><img src="'+(cover(b)||photo(b,1150))+'" alt="Portada bibliográfica de Open Library">'+
    '<div class="photo-source">Portada · Open Library</div></div>'+
    '<div class="detail-content"><span class="eyebrow">COLECCIÓN / '+esc(b.genre).toUpperCase()+'</span>'+
    '<h1>'+esc(b.title)+'</h1><p class="detail-author">de <strong>'+esc(b.author)+'</strong></p>'+
    '<div class="detail-rule"></div><div class="availability-row">'+
    (free?badge("Disponible","green"):badge("No disponible","red"))+
    '<span>'+free+' de '+b.copies+' ejemplares libres</span></div>'+
    '<div class="detail-progress"><span style="width:'+Math.max(0,Math.min(100,free/Math.max(1,b.copies)*100))+'%"></span></div>'+
    '<div class="detail-buttons">'+actionButton("Registrar préstamo","loan","arrow","btn btn-coral", 'data-id="'+b.id+'"'+(free?"":" disabled"))+
    '<button class="btn favorite-btn'+(fav(b.id)?" is-favorite":"")+'" data-action="favorite" data-id="'+b.id+'" aria-pressed="'+fav(b.id)+'">'+(fav(b.id)?"♥ Guardado":"♡ Guardar")+'</button>'+
    '<button class="btn btn-ghost" data-action="edit-book" data-id="'+b.id+'">Editar libro</button></div>'+
    '<p class="detail-note">Portadas ofrecidas por Open Library en función del ISBN.</p>'+
    '<div class="detail-metadata"><div><span>ISBN</span><strong>'+esc(b.isbn||"Sin registrar")+'</strong></div>'+
    '<div><span>Idioma</span><strong>'+esc(b.language||"Español")+'</strong></div>'+
    '<div><span>Género</span><strong>'+esc(b.genre)+'</strong></div>'+
    '<div><span>Ejemplares</span><strong>'+b.copies+'</strong></div></div></div></section>'+
    '<div class="detail-lower"><div class="panel modern-panel"><div class="panel-heading"><h3>Historial de préstamos</h3><span>'+loans.length+' movimientos</span></div>'+
    (loans.length?loans.map(p=>'<a class="history-row" href="#prestamos/'+p.id+'"><span class="history-icon">'+icon("return")+'</span>'+
      '<span><strong>'+esc(user(p.userId)?.name||"Lector")+'</strong><small>'+prettyDate(p.start)+' · Hasta '+prettyDate(p.end)+'</small></span>'+
      statStatus(loanStatus(p))+'<span class="history-arrow">↗</span></a>').join(""):'<p class="muted">Este libro todavía no tiene préstamos.</p>')+
    '</div><div class="panel modern-panel"><div class="panel-heading"><h3>De la misma categoría</h3></div>'+
    (related.length?related.map(r=>'<a class="mini-loan" href="#libros/'+r.id+'"><img src="'+(cover(r)||photo(r,160))+'" alt="" loading="lazy">'+
      '<span><strong>'+esc(r.title)+'</strong><small>'+esc(r.author)+'</small></span><span class="mini-end">↗</span></a>').join("") :
      '<p class="muted">Descubre el resto de la colección en el catálogo.</p>')+
    '<a class="inline-link" href="#libros">Explorar catálogo →</a></div></div>';
}
function loanDetailView(p) {
  const b=book(p.bookId),u=user(p.userId),s=loanStatus(p);
  return '<div class="detail-top">'+back("prestamos","Volver a préstamos")+'<span>PRÉSTAMOS / #'+String(p.id).padStart(3,"0")+'</span></div>'+
   '<div class="detail-heading"><div><span class="eyebrow">FICHA DEL MOVIMIENTO</span><h1>Préstamo #'+String(p.id).padStart(3,"0")+'</h1>'+
   '<p>Detalle y seguimiento de la circulación del ejemplar.</p></div>'+statStatus(s)+'</div>'+
   '<div class="loan-detail-grid"><div class="panel loan-main-panel"><div class="loan-book-preview">'+
   '<img src="'+(cover(b)||photo(b,440))+'" alt="Fotografía de libros" loading="lazy"><div><span class="eyebrow">LIBRO PRESTADO</span>'+
   '<h2><a href="#libros/'+(b?.id||0)+'">'+esc(b?.title||"Libro")+'</a></h2>'+
   '<p>'+esc(b?.author||"")+'</p><a href="#libros/'+(b?.id||0)+'" class="inline-link">Ver ficha del libro ↗</a></div></div>'+
   '<div class="detail-rule"></div><h3>Seguimiento del préstamo</h3>'+
   '<div class="timeline"><div class="timeline-item done"><span class="timeline-marker">'+icon("check")+'</span><div><strong>Préstamo registrado</strong><small>'+prettyDate(p.start)+'</small></div></div>'+
   '<div class="timeline-item '+(s==="vencido"?"late":s==="devuelto"?"done":"")+'"><span class="timeline-marker">'+icon("clock")+'</span><div><strong>Fecha prevista de devolución</strong><small>'+prettyDate(p.end)+'</small></div></div>'+
   (p.returned?'<div class="timeline-item done"><span class="timeline-marker">'+icon("check")+'</span><div><strong>Devolución realizada</strong><small>'+prettyDate(p.returned)+'</small></div></div>':
    '<div class="timeline-item"><span class="timeline-marker">'+icon("return")+'</span><div><strong>Devolución pendiente</strong><small>'+(s==="vencido"?"Retrasado "+Math.abs(until(p.end))+" días":"Quedan "+until(p.end)+" días")+'</small></div></div>')+'</div>'+
   (!p.returned?'<div class="detail-buttons">'+actionButton("Registrar devolución","return","check","btn btn-primary",'data-id="'+p.id+'"')+
     '</div>':'<p class="completion-note">'+icon("check")+' Este préstamo se ha completado correctamente.</p>')+'</div>'+
   '<div class="detail-sidebar"><div class="panel"><span class="eyebrow">LECTOR RESPONSABLE</span><div class="reader-mini">'+
   '<span class="avatar reader-avatar">'+esc(avatarText(u?.name||"L"))+'</span><div><strong>'+esc(u?.name||"Lector")+'</strong>'+
   '<small>'+esc(u?.email||"")+'</small></div></div><a class="btn btn-block" href="#usuarios/'+(u?.id||0)+'">Ver ficha del lector ↗</a></div>'+
   '<div class="panel"><span class="eyebrow">RESUMEN</span><dl class="metadata-list">'+
   '<div><dt>Identificador</dt><dd>#'+p.id+'</dd></div>'+
   '<div><dt>Fecha de inicio</dt><dd>'+prettyDate(p.start)+'</dd></div>'+
   '<div><dt>Fecha límite</dt><dd>'+prettyDate(p.end)+'</dd></div>'+
   '<div><dt>Situación</dt><dd>'+statStatus(s)+'</dd></div></dl></div></div></div>';
}
function userDetailView(u) {
 const loans=db.loans.filter(p=>p.userId===u.id).slice().reverse(),enroll=db.events.filter(e=>e.users.includes(u.id));
 return '<div class="detail-top">'+back("usuarios","Volver a lectores")+'<span>LECTORES / #'+String(u.id).padStart(3,"0")+'</span></div>'+
 '<div class="reader-detail-hero"><span class="avatar reader-avatar reader-xl">'+esc(avatarText(u.name))+'</span>'+
 '<div><span class="eyebrow">PERFIL DEL LECTOR</span><h1>'+esc(u.name)+'</h1><p>'+esc(u.email)+'</p></div></div>'+
 '<div class="reader-summary">'+kpi(loans.length,"Préstamos totales","book")+kpi(loans.filter(p=>!p.returned).length,"En circulación","return")+
 kpi(enroll.length,"Eventos inscritos","calendar")+'</div>'+
 '<div class="detail-lower"><div class="panel modern-panel"><div class="panel-heading"><h3>Historial de lectura</h3>'+
 '<span>'+loans.length+' movimientos</span></div>'+
 (loans.length?loans.map(p=>'<a href="#prestamos/'+p.id+'" class="history-row"><img class="tiny-photo" src="'+(cover(book(p.bookId))||photo(book(p.bookId),160))+'" loading="lazy" alt="">'+
 '<span><strong>'+esc(book(p.bookId)?.title||"Libro")+'</strong><small>'+prettyDate(p.start)+' · Hasta '+prettyDate(p.end)+'</small></span>'+
 statStatus(loanStatus(p))+'<span class="history-arrow">↗</span></a>').join(""):'<p class="muted">Todavía no tiene préstamos registrados.</p>')+
 '</div><div class="panel modern-panel"><div class="panel-heading"><h3>Sus eventos</h3></div>'+
 (enroll.length?enroll.map(e=>'<a href="#eventos/'+e.id+'" class="history-row"><span class="history-icon">'+icon("calendar")+'</span>'+
 '<span><strong>'+esc(e.title)+'</strong><small>'+prettyDate(e.date)+'</small></span><span class="history-arrow">↗</span></a>').join("") :
 '<p class="muted">No está inscrito en ningún evento.</p>')+
 '<div class="detail-buttons">'+actionButton("Nuevo préstamo","loan","plus","btn btn-primary")+'</div></div></div>';
}
function eventDetailView(e) {
 const members=e.users.map(id=>user(id)).filter(Boolean),past=e.date<today(),full=e.users.length>=e.capacity;
 return '<div class="detail-top">'+back("eventos","Volver a eventos")+'<span>EVENTOS / #'+String(e.id).padStart(3,"0")+'</span></div>'+
 '<div class="event-detail-banner"><img src="'+photo({color:e.id+3},1400)+'" alt="Fotografía de libros reales">'+
 '<div class="event-detail-overlay"><span class="eyebrow">ENCUENTRO CULTURAL</span><h1>'+esc(e.title)+'</h1><p>'+esc(e.description)+'</p></div></div>'+
 '<div class="reader-summary event-summary">'+kpi(prettyDate(e.date),"Fecha del encuentro","calendar")+
 kpi(e.users.length+" / "+e.capacity,"Inscripciones","users")+kpi(Math.max(0,e.capacity-e.users.length),"Plazas disponibles","check")+'</div>'+
 '<div class="detail-lower"><div class="panel modern-panel"><div class="panel-heading"><h3>Personas inscritas</h3>'+
 badge(past?"Finalizado":full?"Aforo completo":"Inscripciones abiertas",past?"gray":full?"red":"green")+'</div>'+
 (members.length?members.map(u=>'<a class="history-row" href="#usuarios/'+u.id+'"><span class="avatar reader-avatar">'+
 esc(avatarText(u.name))+'</span><span><strong>'+esc(u.name)+'</strong><small>'+esc(u.email)+'</small></span>'+
 '<span class="history-arrow">↗</span></a>').join(""):'<p class="muted">Aún no hay inscritos.</p>')+'</div>'+
 '<div class="panel modern-panel"><div class="panel-heading"><h3>Gestionar actividad</h3></div>'+
 '<p class="muted">Controla la asistencia, cancela inscripciones o invita a lectores de la biblioteca.</p>'+
 '<div class="detail-progress"><span style="width:'+Math.min(100,e.users.length/Math.max(1,e.capacity)*100)+'%"></span></div>'+
 '<p class="muted">'+e.users.length+' de '+e.capacity+' plazas ocupadas</p>'+
 (!past?actionButton("Gestionar inscripciones","signup","users","btn btn-primary",'data-id="'+e.id+'"'):'<p class="muted">Este evento ya ha finalizado.</p>')+
 '</div></div>';
}

  const views = {inicio:homeView,libros:booksView,prestamos:loansView,eventos:eventsView,usuarios:usersView,proyecto:projectView};
const labels = {inicio:"Vista general",libros:"Catálogo",prestamos:"Préstamos",eventos:"Eventos",usuarios:"Lectores",proyecto:"Sobre la API"};
function render() {
  const route = decodeURIComponent(location.hash.replace(/^#/,"").split("?")[0] || "inicio");
  const parts=route.split("/"), root=parts[0], id=Number(parts[1]);
  view = root in views ? root : "inicio";
  if (view==="inicio" && route!=="inicio" && !(root in views)) history.replaceState(null,"","#inicio");
  const selected = parts.length===2 && Number.isInteger(id) && id>0 ?
    (root==="libros" ? book(id) : root==="prestamos" ? db.loans.find(p=>p.id===id) :
      root==="eventos" ? event(id) : root==="usuarios" ? user(id) : null) : null;
  $("#crumb-name").textContent = labels[view] + (selected ? " / Detalle" : "");
  $$(".nav-link[data-view]").forEach(el=>{
    const active=el.dataset.view===view;
    el.classList.toggle("active",active);
    if(active)el.setAttribute("aria-current","page");else el.removeAttribute("aria-current");
  });
  if(parts.length>1){
    $("#view").innerHTML = selected ?
      (root==="libros" ? bookDetailView(selected) : root==="prestamos" ? loanDetailView(selected) :
       root==="eventos" ? eventDetailView(selected) : userDetailView(selected)) :
      '<div class="notfound"><h1>Esta ficha no existe</h1><p>Quizás los datos de la demo se hayan restablecido.</p>'+
      '<a class="btn btn-primary" href="#'+view+'">Volver al listado '+icon("arrow")+'</a></div>';
  } else $("#view").innerHTML = views[view]();
  $("#year").textContent = String(new Date().getFullYear());
  document.title = (selected ? (selected.title || selected.name || selected.id) + " · " : "") +
    "MrBibliomante · Biblioteca digital";
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
    if (action === "favorites") {
      filter = "favoritos"; genreFilter="todos"; search=""; $("#global-search").value="";
      location.hash="#libros";render();return;
    }
    if (action === "category") {
      genreFilter = String(document.activeElement?.dataset?.category || "todos");
      filter = "todos";search="";$("#global-search").value="";
      location.hash="#libros";render();return;
    }
    if (action === "notifications") {
      openModal("Actividad reciente", '<div class="activity-list">' + db.activity.slice(0,8).map(a=>
        '<div class="activity-item"><span class="activity-icon">'+icon(a.kind||"book")+'</span>' +
        '<div><strong>'+esc(a.text)+'</strong><small>'+esc(a.detail)+'</small></div></div>').join("") + '</div>');
      return;
    }
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
    
    if (action === "favorite") {
      const idN=Number(id);
      db.favorites = fav(idN) ? db.favorites.filter(x=>x!==idN) : [...db.favorites,idN];
      save();render();toast(fav(idN)?"Libro guardado en favoritos.":"Eliminado de favoritos."); return;
    }
    if (action === "edit-book") {
      const b=book(id);if(!b)return;
      const orig=field("title","Título del libro","text",true,'maxlength="110"')+
        field("author","Autor","text",true,'maxlength="100"')+
        selectField("genre","Género",["Novela","Fantasía","Histórica","Distopía","Fábula","Realismo mágico","Ensayo","Poesía","Otros"].map(x=>opt(x,x)).join(""))+
        field("isbn","ISBN (13 dígitos)","text",true,'pattern="[0-9]{13}" inputmode="numeric" maxlength="13"')+
        field("copies","Ejemplares totales","number",true,'min="0" max="999"');
      openModal("Editar ficha del libro","<p class='modal-desc'>Actualiza los datos y las existencias del título.</p>"+
        form("form-edit-book",'<input type="hidden" name="bookId" value="'+b.id+'">'+orig,"Guardar cambios"));
      ["title","author","genre","isbn","copies"].forEach((f,i)=>{
        const el=$("#field-"+f);if(el)el.value=String([b.title,b.author,b.genre,b.isbn,b.copies][i] ?? "");
      });
      return;
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
    if (action === "category") {
      genreFilter=button.dataset.category || "todos";filter="todos";search="";$("#global-search").value="";
      location.hash="#libros";render();return;
    }
    openAction(action,button.dataset.id);
  }

  function handleForm(formElement) {
    const d = Object.fromEntries(new FormData(formElement));
    const text = k => String(d[k] ?? "").trim();
    const validDate = x => /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x));
    
    if(formElement.id==="form-edit-book"){
      const b=book(d.bookId),copies=Number(d.copies);
      if(!b||!Number.isInteger(copies)||copies<liveLoans(b.id).length||copies>999||
        !/^\d{13}$/.test(text("isbn"))||db.books.some(other=>other.id!==b.id&&other.isbn===text("isbn"))){
          toast("Comprueba ISBN y ejemplares: no puedes reducirlos por debajo de los préstamos activos.",true);return;
      }
      b.title=text("title");b.author=text("author");b.genre=text("genre");b.isbn=text("isbn");b.copies=copies;
      addActivity("Ficha actualizada",b.title,"book");save();closeModal();render();toast("Cambios guardados.");return;
    }
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
    const favView = ev.target.closest("[data-viewmode]");
    if(favView){ viewMode=favView.dataset.viewmode;render();return; }
    const loanButton = ev.target.closest("[data-loanfilter]");
    if(loanButton){ loanFilter=loanButton.dataset.loanfilter;render();return; }
    const filterButton = ev.target.closest("[data-filter]");
    if (filterButton) { filter = filterButton.dataset.filter; render(); }
  });
  document.addEventListener("change", ev=>{
    const sel=ev.target.closest("[data-select]");if(!sel)return;
    if(sel.dataset.select==="genre")genreFilter=sel.value;
    if(sel.dataset.select==="catalog-sort")catalogSort=sel.value;
    render();
  });
  document.addEventListener("submit", ev => {
    if (ev.target.id !== "discover-search-form") return;
    ev.preventDefault();
    genreFilter = $("#discover-genre").value || "todos";
    search = ($("#discover-query").value || "").trim();
    $("#global-search").value=search;
    filter="todos";
    location.hash="#libros";
    render();
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
