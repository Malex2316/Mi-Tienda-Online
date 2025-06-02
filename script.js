// --- Carrito ---
// --- Carrito mejorado con cantidades ---
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para calcular el total teniendo en cuenta las cantidades
function calcularTotal() {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

// Agregar producto al carrito (suma cantidad si ya existe)
function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    guardarCarrito();
    actualizarCarrito();
    mostrarToast(`✅ ${nombre} agregado al carrito`);
}


// Eliminar completamente un producto del carrito
function eliminarDelCarrito(index) {
    const producto = carrito[index];
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarrito();
    mostrarToast(`🗑️ ${producto.nombre} eliminado del carrito`);
}


// Disminuir cantidad del producto (si llega a 0, eliminarlo)
function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    actualizarCarrito();
}

// Vaciar todo el carrito
function vaciarCarrito() {
    if (carrito.length === 0) {
        mostrarToast("⚠️ El carrito ya está vacío");
        return;
    }

    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    mostrarToast("🧹 Carrito vaciado correctamente");
}


// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Mostrar el carrito en la página
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


// --- Mostrar productos dinámicamente ---
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

// --- Buscador ---
document.getElementById("buscador").addEventListener("input", (e) => {
    const valor = e.target.value.toLowerCase();
    const filtrados = productos.filter((p) => p.nombre.toLowerCase().includes(valor));
    mostrarProductos(filtrados);
});

// --- Filtros por categoría ---
document.querySelectorAll(".btn-filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
        const cat = btn.dataset.categoria;
        const filtrados = cat === "Todos" ? productos : productos.filter(p => p.categoria === cat);
        mostrarProductos(filtrados);
    });
});

// --- Mostrar formulario de envío ---
document.getElementById("finalizar-compra").addEventListener("click", () => {
    document.getElementById("formulario-envio").style.display = "block";
});

// --- Confirmar compra ---
document.getElementById("confirmar-envio").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const ciudad = document.getElementById("ciudad").value.trim();
    const pago = document.getElementById("forma-pago").value;

    if (!nombre || !direccion || !ciudad) {
        alert("Por favor completá todos los campos.");
        return;
    }

    alert(`Gracias por tu compra, ${nombre}. Tu pedido será enviado a ${direccion}, ${ciudad}. Forma de pago: ${pago}`);
    vaciarCarrito();
    document.getElementById("formulario-envio").style.display = "none";
});

// --- Inicialización al cargar ---
document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();
    mostrarProductos();

    // Conectar botón de vaciar carrito
    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("El carrito ya está vacío.");
            return;
        }

        const confirmar = confirm("¿Estás seguro que querés vaciar el carrito?");
        if (confirmar) {
            vaciarCarrito();
        }
    });
});

function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.classList.add("mostrar");

    setTimeout(() => {
        toast.classList.remove("mostrar");
    }, 2000); // Ocultar después de 2 segundos
}


// ... todas tus funciones aquí arriba:
// agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, mostrarToast, etc.

document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();
    mostrarProductos();

    // Vaciar carrito
    const botonVaciar = document.getElementById("vaciar-carrito");
    if (botonVaciar) {
        botonVaciar.addEventListener("click", vaciarCarrito);
    }

    // Finalizar compra (mostrar formulario)
    const btnFinalizar = document.getElementById("finalizar-compra");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            const formulario = document.getElementById("formulario-envio");
            formulario.style.display = "block";
        });
    }

    // Confirmar compra y mostrar toast
    const btnConfirmar = document.getElementById("confirmar-envio");
    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", () => {
            const nombre = document.getElementById("nombre").value;
            const direccion = document.getElementById("direccion").value;
            const ciudad = document.getElementById("ciudad").value;
            const formaPago = document.getElementById("forma-pago").value;

            if (!nombre || !direccion || !ciudad) {
                alert("Por favor, completá todos los datos de envío.");
                return;
            }

            // Vaciar carrito después de finalizar
            vaciarCarrito();

            // Ocultar formulario
            document.getElementById("formulario-envio").style.display = "none";

            // Mostrar mensaje de éxito
            mostrarToast(`✅ ¡Gracias por tu compra, ${nombre}!`);
        });
    }
        // Ampliar imagen al hacer clic
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


});




