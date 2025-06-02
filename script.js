let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function calcularTotal() {
  return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

function agregarAlCarrito(nombre, precio) {
  const productoExistente = carrito.find(item => item.nombre === nombre);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  guardarCarrito();
  actualizarCarrito();
  mostrarToast(`✅ ${nombre} agregado al carrito`, "success");
}

function eliminarDelCarrito(index) {
  const producto = carrito[index];
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
  mostrarToast(`🗑️ ${producto.nombre} eliminado del carrito`, "warning");
}

function disminuirCantidad(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad--;
  } else {
    carrito.splice(index, 1);
  }
  guardarCarrito();
  actualizarCarrito();
}

function vaciarCarrito() {
  if (carrito.length === 0) {
    mostrarToast("⚠️ El carrito ya está vacío", "warning");
    return;
  }
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
  mostrarToast("🧹 Carrito vaciado correctamente", "success");
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - ₲ ${item.precio.toLocaleString("es-PY")} x ${item.cantidad}
      <div class="acciones-carrito">
        <button class="btn-cantidad" onclick="disminuirCantidad(${index})">-</button>
        <button class="btn-cantidad" onclick="agregarAlCarrito('${item.nombre}', ${item.precio})">+</button>
        <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">X</button>
      </div>
    `;
    lista.appendChild(li);
  });

  document.getElementById("total").textContent = calcularTotal().toLocaleString("es-PY");
}

function mostrarProductos(filtrados = productos) {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = "";

  filtrados.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("producto-card");
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p class="precio">₲ ${prod.precio.toLocaleString("es-PY")}</p>
      <button class="btn-agregar" onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio})">Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
  });
}

function mostrarToast(mensaje, tipo = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.className = `toast mostrar ${tipo}`;

  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 2500);
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const modoOscuroActivo = document.body.classList.contains('dark-mode');
  localStorage.setItem('modoOscuro', modoOscuroActivo ? 'true' : 'false');
}

// Activar modo oscuro si estaba guardado
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('modoOscuro') === 'true') {
    document.body.classList.add('dark-mode');
  }
});


document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();
  mostrarProductos();

  // Restaurar modo oscuro
  if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("dark-mode");
  }

  // Buscador
  document.getElementById("buscador").addEventListener("input", (e) => {
    const valor = e.target.value.toLowerCase();
    const filtrados = productos.filter((p) => p.nombre.toLowerCase().includes(valor));
    mostrarProductos(filtrados);
  });

  // Filtros
  document.querySelectorAll(".btn-filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.categoria;
      const filtrados = cat === "Todos" ? productos : productos.filter(p => p.categoria === cat);
      mostrarProductos(filtrados);
    });
  });

  // Vaciar carrito
  document.getElementById("vaciar-carrito").addEventListener("click", () => {
    if (carrito.length === 0) {
      mostrarToast("⚠️ El carrito ya está vacío", "warning");
      return;
    }
    if (confirm("¿Estás seguro que querés vaciar el carrito?")) {
      vaciarCarrito();
    }
  });

  // Mostrar formulario
  document.getElementById("finalizar-compra").addEventListener("click", () => {
    document.getElementById("formulario-envio").style.display = "block";
  });

  // Confirmar compra
  document.getElementById("confirmar-envio").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const ciudad = document.getElementById("ciudad").value.trim();
    const formaPago = document.getElementById("forma-pago").value;

    if (!nombre || !direccion || !ciudad) {
      mostrarToast("⚠️ Por favor completá todos los datos", "warning");
      return;
    }

    if (carrito.length === 0) {
      mostrarToast("🛒 Tu carrito está vacío", "warning");
      return;
    }

    alert(`
Gracias por tu compra, ${nombre}!
Tu pedido será enviado a ${direccion}, ${ciudad}.
Forma de pago: ${formaPago}.
Total pagado: ₲ ${calcularTotal().toLocaleString("es-PY")}
    `);

    vaciarCarrito();
    document.getElementById("formulario-envio").style.display = "none";
  });

  // Modal imagen
  const contenedor = document.getElementById("productos-container");
  const modal = document.getElementById("modal-imagen");
  const imagenAmpliada = document.getElementById("imagen-ampliada");
  const cerrarModal = document.getElementById("cerrar-modal");

  contenedor.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      imagenAmpliada.src = e.target.src;
      modal.style.display = "block";
    }
  });

  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Botón subir
  const btnArriba = document.getElementById("btn-arriba");
  window.addEventListener("scroll", () => {
    btnArriba.style.display = window.scrollY > 300 ? "block" : "none";
  });
  btnArriba.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
