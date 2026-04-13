/* HUERTA URBANA - LOGIC & CART SYSTEM (Catalogo Extendido) */

/* ── Desregistrar Service Workers (PWA desactivada) ── */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}

/* ── PWA: Banner de instalación ──────────────────────── */
let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
})

// Mostrar el banner según el dispositivo (esperamos 3s)
setTimeout(() => {
  const banner = document.getElementById('pwa-banner')
  const btnInstalar = document.getElementById('pwa-install-btn')
  if (!banner || !btnInstalar) return

  // Si ya está en modo app, no mostramos nada
  if (window.matchMedia('(display-mode: standalone)').matches) return

  const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const esSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)

  if (esIOS && esSafari) {
    // Modo iOS Manual
    btnInstalar.textContent = 'Ver cómo instalar'
    btnInstalar.addEventListener('click', () => {
      alert('Para instalar:\n1. Apretá el botón ⬆️ compartir\n2. Seleccioná "Agregar a pantalla de inicio"\n3. Apretá "Agregar"')
    })
    banner.style.display = 'flex'
  } else if (!deferredPrompt) {
    // Modo Android Manual (no hubo beforeinstallprompt automático)
    btnInstalar.textContent = 'Ver cómo instalar'
    btnInstalar.addEventListener('click', () => {
      alert('Para instalar:\n1. Apretá los 3 puntitos del navegador (arriba a la derecha)\n2. Seleccioná "Instalar aplicación" o "Agregar a la pantalla principal"')
    })
    banner.style.display = 'flex'
  } else {
    // Modo Automático (Chrome Android, etc)
    banner.style.display = 'flex'
  }
}, 3000)

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    deferredPrompt = null
    document.getElementById('pwa-banner').style.display = 'none'
  })

  document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
    document.getElementById('pwa-banner').style.display = 'none'
  })
})

const PRODUCTS = {
    combos: [
        {
            id: 'c1', name: 'Combo básico', price: 35000,
            desc: 'Mezcla esencial de frutas y verduras para arrancar la semana con energía y frescura.',
            img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
            items: ['2kg Papa blanca', '1kg Cebolla blanca', '1kg Tomate', '1/2kg Lechuga mantecosa', '1kg Manzana roja', '1kg Naranja']
        },
        {
            id: 'c2', name: 'Combo familiar', price: 65000,
            desc: 'Pensado para cubrir las necesidades de una familia, con frutas y verduras frescas para todos los días.',
            img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=300',
            items: ['4kg Papa blanca', '2kg Cebolla blanca', '2kg Tomate', '1kg Lechuga mantecosa', '1kg Zanahoria', '1kg Calabaza anco', '2kg Manzana roja', '2kg Naranja', '1kg Banana']
        },
        {
            id: 'c3', name: 'Combo premium', price: 95000,
            desc: 'Selección exclusiva de productos premium, con sabores y calidad superior para quienes buscan lo mejor.',
            img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300',
            items: ['Productos de Estación Premium', 'Variedad de Frutas Seleccionadas', 'Frutos Secos 250g', 'Miel Pura 1kg']
        },
        {
            id: 'c4', name: 'Combo frutos secos', price: 42000,
            desc: 'Mezcla de frutos secos y miel, ideal para un snack nutritivo y delicioso.',
            img: 'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&q=80&w=300',
            items: ['Frutos Secos Mix 500g', 'Miel Pura 1kg']
        },
        {
            id: 'c5', name: 'Combo fit', price: 58000,
            desc: 'Orientado a personas que hacen ejercicio, rico en proteínas y energía natural para rendir al máximo.',
            img: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=300',
            items: ['Banana (varios kg)', 'Frutos Secos', 'Miel Pura', 'Acelga']
        },
        {
            id: 'c6', name: 'Combo semanal', price: 32000,
            desc: 'Mezcla pensada para una familia durante toda la semana, con frutas y verduras frescas de lunes a domingo.',
            img: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300',
            items: ['2kg Papa blanca', '1kg Cebolla blanca', '1kg Tomate', '1kg Fruta Mezclada']
        },
        {
            id: 'c7', name: 'Combo mensual', price: 120000,
            desc: 'Variedad completa de frutas y verduras para cubrir todo un mes, fresco y equilibrado para tu familia.',
            img: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=300',
            items: ['Canasta Mensual de Verduras', 'Canasta Mensual de Frutas', 'Miel Pura 2kg']
        },
        {
            id: 'c8', name: 'Combo llena la heladera', price: 85000,
            desc: 'Selección abundante de todas las frutas y verduras disponibles, para tener la heladera siempre lista y llena de frescura.',
            img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=300',
            items: ['Mix Abundante de Verduras', 'Mix Abundante de Frutas']
        }
    ],
    individual: {
        'verduras': [],
        'frutas': [],
        'extras': []
    }
};

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyAIskGdqV0hg5xhsh7ieZiCekbWBBR-bmDEjBR1-4_Ah3vSrORRaqVnRqhBXRX1AA/exec'

let MIN_PURCHASE = 35000;
let cart = {};
let activeCategory = 'verduras';

async function cargarPrecios() {
  try {
    const response = await fetch(APPS_SCRIPT_URL + '?accion=getPreciosWeb')
    const data = await response.json()
    if (data.success) {
      MIN_PURCHASE = data.monto_minimo || 35000
      if (data.productos) actualizarProductos(data.productos)
      if (data.combos) actualizarCombos(data.combos)
      actualizarTextos()
    }
  } catch (e) {
    console.log('[PRECIOS] Usando datos locales')
  }
}

function actualizarTextos() {
  const monto = '$' + MIN_PURCHASE.toLocaleString('es-AR')
  
  console.log('[MOBILE] spans encontrados:', 
    document.getElementById('envio-gratis-monto'),
    document.getElementById('compra-minima-monto'),
    document.getElementById('footer-minima-monto')
  )

  const ids = ['envio-gratis-monto', 'compra-minima-monto', 'footer-minima-monto']
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) el.textContent = monto
  })
}

// Listas de palabras clave para clasificar productos (sin tildes, la función normaliza)
const NOMBRES_VERDURAS = [
  'papa', 'cebolla comun', 'cebolla', 'cebolla morada', 'tomate', 'tomate cherry', 
  'zanahoria', 'lechuga', 'zapallito', 'zapallo blanco', 'morron', 'morron rojo',
  'rucula', 'espinaca', 'remolacha', 'pepino', 'brocoli', 'cabutia', 
  'ajo', 'berenjena'
]
const NOMBRES_FRUTAS = [
  'palta', 'manzana roja', 'manzana verde', 'banana', 'naranja', 
  'limon', 'durazno', 'pomelo', 'uva', 'arandano', 'choclo'
]

function clasificarProducto(nombre) {
  // Normalizar: minúsculas y sin tildes para comparar sin importar encoding
  const n = nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
  
  // Buscar coincidencia en verduras y frutas; si no, Extras
  if (NOMBRES_VERDURAS.some(k => n.includes(k))) return 'verduras'
  if (NOMBRES_FRUTAS.some(k => n.includes(k))) return 'frutas'
  return 'extras'
}

function actualizarProductos(productosData) {
  // Resetear las tres categorías
  PRODUCTS.individual = { 'verduras': [], 'frutas': [], 'extras': [] }

  productosData.forEach((p, i) => {
    if (p.activo === false) return
    const categoria = clasificarProducto(p.nombre)
    // Detectar unidad: huevos van por docena, arándanos por bandeja, resto por kg
    let unit = 'kg', step = 0.5, min = 0.5
    const n = p.nombre.toLowerCase()
    if (n.includes('huevo')) { unit = 'dz'; step = 1; min = 1 }
    else if (n.includes('arandano') || n.includes('arándano')) { unit = 'un'; step = 1; min = 1 }
    const nombreCrudo = p.nombre.toLowerCase()
    const nombreCapitalizado = nombreCrudo.charAt(0).toUpperCase() + nombreCrudo.slice(1)
    
    PRODUCTS.individual[categoria].push({
      id: 'p' + i,
      name: nombreCapitalizado,
      price: p.precio,
      unit, step, min
    })
  })

  console.log('[PRODUCTOS] Clasificados:', {
    verduras: PRODUCTS.individual.verduras.length,
    frutas: PRODUCTS.individual.frutas.length,
    extras: PRODUCTS.individual.extras.length
  })

  // Ocultar pestaña Extras si no hay productos
  const tabExtras = document.getElementById('tab-extras');
  if (tabExtras) {
    if (PRODUCTS.individual.extras.length === 0) {
      tabExtras.style.display = 'none';
      if (activeCategory === 'extras') switchCategory('verduras');
    } else {
      tabExtras.style.display = 'inline-block';
    }
  }
}

function actualizarCombos(combosData) {
  // Guardar imágenes actuales para no perderlas si la API no las trae
  const currentImages = {}
  PRODUCTS.combos.forEach(c => { currentImages[c.name.toLowerCase()] = c.img })

  PRODUCTS.combos = combosData
    .filter(c => c.activo !== false)
    .map(c => {
      const nombreCrudo = c.nombre.toLowerCase()
      const nombreCapitalizado = nombreCrudo.charAt(0).toUpperCase() + nombreCrudo.slice(1)
      return {
        id: c.nombre.toLowerCase().replace(/ /g, '-'),
        name: nombreCapitalizado,
        price: c.precio,
        desc: c.descripcion || '',
        img: c.img || currentImages[c.nombre.toLowerCase()] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
        items: Array.isArray(c.items) ? c.items : (c.items ? c.items.split(',').map(i => i.trim()) : [])
      }
    })
}

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await cargarPrecios();
    initUI();
    renderCombos();
    renderCustomProducts();
    updateSummary();
});

function loadCustomerData() {
    try {
        const savedData = localStorage.getItem('customer_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.fullname) document.getElementById('fullname').value = data.fullname;
            if (data.email) document.getElementById('email').value = data.email;
            if (data.address) document.getElementById('address').value = data.address;
            if (data.phone) document.getElementById('phone').value = data.phone;
            if (data.deliveryDay) document.getElementById('delivery-day').value = data.deliveryDay;
            if (data.deliveryTime) document.getElementById('delivery-time').value = data.deliveryTime;

            // Validar si el botón debe habilitarse si ya hay datos y carrito
            updateSummary();
        }
    } catch (e) {
        console.warn('No se pudieron cargar los datos del cliente (posible modo incógnito):', e);
    }
}

function saveCustomerData() {
    try {
        const data = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            deliveryDay: document.getElementById('delivery-day').value,
            deliveryTime: document.getElementById('delivery-time').value
        };
        localStorage.setItem('customer_data', JSON.stringify(data));
    } catch (e) {
        console.warn('No se pudieron guardar los datos del cliente (posible modo incógnito):', e);
    }
}

function initUI() {
    // Asegurar que al hacer clic en la tarjeta de pago se seleccione el radio (útil en móviles)
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    const form = document.getElementById('order-form');
    form.addEventListener('submit', handleOrderSubmit);

    // Cart Modal Events
    const cartBtn = document.getElementById('open-cart-btn');
    cartBtn.addEventListener('click', showCartModal);

    // Close modal when clicking background
    window.addEventListener('click', (e) => {
        const cartModal = document.getElementById('cart-modal');
        const comboModal = document.getElementById('combo-modal');
        const successModal = document.getElementById('success-modal');

        if (e.target === cartModal) closeCartModal();
        if (e.target === comboModal) closeComboModal();
        if (e.target === successModal) closeModal();
    });
}

function showCartModal() {
    const modal = document.getElementById('cart-modal');
    updateCartModalContent();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateCartModalContent() {
    const modalItems = document.getElementById('cart-modal-items');
    const modalTotal = document.getElementById('cart-modal-total-val');

    let total = 0;
    let html = '';

    const cartEntries = Object.values(cart);

    if (cartEntries.length === 0) {
        html = '<p style="text-align:center; padding: 20px; color: #888;">Tu carrito todavía está vacío.</p>';
    } else {
        cartEntries.forEach(item => {
            let itemPrice = item.price;
            let subtotal = 0;
            if (item.unit === 'g') {
                subtotal = (itemPrice / 1000) * item.qty;
            } else {
                subtotal = itemPrice * item.qty;
            }
            total += subtotal;

            html += `
                <div class="cart-modal-item">
                    <div class="cart-modal-item-info">
                        <span class="cart-modal-item-name">${item.name}</span>
                        <span class="cart-modal-item-qty">${item.qty}${item.unit || ''}</span>
                    </div>
                    <span class="cart-modal-item-price">$${Math.floor(subtotal).toLocaleString('es-AR')}</span>
                </div>
            `;
        });
    }

    modalItems.innerHTML = html;
    modalTotal.innerText = `$${Math.floor(total).toLocaleString('es-AR')}`;
}

function switchCategory(cat) {
    activeCategory = cat;
    // Update tabs UI
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(cat));
    });
    renderCustomProducts();
}

function renderCombos() {
    const combosContainer = document.getElementById('combos-container');
    combosContainer.innerHTML = PRODUCTS.combos.map(combo => `
        <div class="combo-card" onclick="showComboDetails('${combo.id}')" style="cursor: pointer;">
            <img src="${combo.img}" alt="${combo.name}" class="combo-img">
            <div class="combo-info">
                <h3>${combo.name}</h3>
                <p>${combo.desc}</p>
                <div class="combo-price-row">
                    <span class="price">$${Math.floor(combo.price).toLocaleString('es-AR')}</span>
                    <div class="qty-control" onclick="event.stopPropagation()">
                        <button type="button" class="qty-btn" onclick="updateComboQty('${combo.id}', -1)"><ion-icon name="remove-circle-outline"></ion-icon></button>
                        <span class="qty-val" id="qty-combo-${combo.id}">0</span>
                        <button type="button" class="qty-btn" onclick="updateComboQty('${combo.id}', 1)"><ion-icon name="add-circle-outline"></ion-icon></button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCustomProducts() {
    const container = document.getElementById('custom-products-container');
    const prods = PRODUCTS.individual[activeCategory];

    // Verificación defensiva: la categoría puede estar vacía si el fetch aún no terminó
    if (!prods || prods.length === 0) {
        container.innerHTML = '<p class="empty-msg" style="padding:20px;text-align:center;">Cargando productos...</p>';
        return;
    }

    container.innerHTML = prods.map(prod => {
        const cartItem = cart[prod.id] || { qty: 0 };
        return `
            <div class="product-item">
                <div class="product-details">
                    <h4>${prod.name}</h4>
                    <span>$${Math.floor(prod.price).toLocaleString('es-AR')} / ${prod.unit}</span>
                </div>
                <div class="qty-control">
                    <button type="button" class="qty-btn" onclick="updateCustomQty('${prod.id}', -1, '${activeCategory}')"><ion-icon name="remove-outline"></ion-icon></button>
                    <span class="qty-val" id="qty-prod-${prod.id}">${cartItem.qty}</span>
                    <button type="button" class="qty-btn" onclick="updateCustomQty('${prod.id}', 1, '${activeCategory}')"><ion-icon name="add-outline"></ion-icon></button>
                </div>
            </div>
        `;
    }).join('');
}

function updateComboQty(id, delta) {
    const combo = PRODUCTS.combos.find(c => c.id === id);
    if (!cart[id]) {
        cart[id] = { ...combo, qty: 0, type: 'combo' };
    }

    cart[id].qty += delta;
    if (cart[id].qty < 0) cart[id].qty = 0;

    document.getElementById(`qty-combo-${id}`).innerText = cart[id].qty;
    if (cart[id].qty === 0) delete cart[id];

    updateSummary();
}

function updateCustomQty(id, delta, category) {
    const prod = PRODUCTS.individual[category].find(p => p.id === id);
    if (!cart[id]) {
        cart[id] = { ...prod, qty: 0, type: 'custom' };
    }

    const currentQty = cart[id].qty;
    const step = prod.step;
    const min = prod.min;

    if (delta > 0) {
        if (currentQty === 0) {
            cart[id].qty = min;
        } else {
            cart[id].qty += step;
        }
    } else {
        if (currentQty <= min) {
            cart[id].qty = 0;
        } else {
            cart[id].qty -= step;
        }
    }

    document.getElementById(`qty-prod-${id}`).innerText = cart[id].qty;
    if (cart[id].qty === 0) delete cart[id];

    updateSummary();
}

function updateSummary() {
    const summaryItems = document.getElementById('summary-items');
    const summaryTotal = document.getElementById('summary-total');
    const headerTotal = document.getElementById('cart-total-header');
    const minMsg = document.getElementById('min-purchase-msg');
    const submitBtn = document.getElementById('submit-btn');

    let total = 0;
    let itemsHtml = '';

    const cartEntries = Object.values(cart);

    if (cartEntries.length === 0) {
        itemsHtml = '<p class="empty-msg">Tu carrito está vacío</p>';
    } else {
        cartEntries.forEach(item => {
            let itemPrice = item.price;
            let subtotal = itemPrice * item.qty;

            total += subtotal;
            const unitLabel = item.unit === 'g' ? 'g' : (item.unit === 'un' ? ' un.' : (item.unit || ''));
            const itemText = `${item.name} (${item.qty}${unitLabel})`;
            const subtotalText = `$${Math.floor(subtotal).toLocaleString('es-AR')}`;

            itemsHtml += `
                <div class="summary-item">
                    <span>${itemText}</span>
                    <span>${subtotalText}</span>
                </div>
            `;
        });
    }

    summaryItems.innerHTML = itemsHtml;
    summaryTotal.innerText = `$${Math.floor(total).toLocaleString('es-AR')}`;
    headerTotal.innerText = `$${Math.floor(total).toLocaleString('es-AR')}`;

    // Sincronizar con campo de producto para el JSON de Make
    const hiddenDetails = document.getElementById('hidden-details');

    if (hiddenDetails) {
        const textSummary = Object.values(cart).map(item => {
            const sub = Math.floor(item.unit === 'g' ? (item.price / 1000) * item.qty : item.price * item.qty);
            const unitLabel = item.unit === 'g' ? 'g' : (item.unit === 'un' ? ' un.' : 'kg');
            return `${item.name.toUpperCase()} (${item.qty}${unitLabel})`;
        }).join(', ');

        hiddenDetails.value = textSummary;

        // Sincronizar también cantidad y total en el DOM (campos ocultos)
        const cantidadInput = document.querySelector('[name="cantidad"]');
        const totalInput = document.querySelector('[name="total"]');
        if (cantidadInput) cantidadInput.value = Object.values(cart).reduce((acc, item) => acc + (item.qty || 1), 0);
        if (totalInput) totalInput.value = total;
    }

    // Also update modal if visible
    if (document.getElementById('cart-modal').style.display === 'flex') {
        updateCartModalContent();
    }

    // Actualizar indicador de envío en el header (v4.0)
    const headerMsg = document.getElementById('shipping-header-msg');

    if (total >= MIN_PURCHASE) {
        // Estado: Éxito
        if (headerMsg) {
            headerMsg.innerText = '¡Envío gratis!';
            headerMsg.className = 'shipping-header-msg status-green';
        }
        minMsg.style.color = '#27ae60';
        minMsg.innerText = '✅ Cupo mínimo alcanzado';
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-disabled');
    } else {
        // Estado: Pendiente
        if (headerMsg) {
            headerMsg.innerText = `Envío gratis a partir de $${MIN_PURCHASE.toLocaleString('es-AR')}`;
            headerMsg.className = 'shipping-header-msg status-red';
        }
        minMsg.style.color = '#e74c3c';
        minMsg.innerText = `Compra mínima: $${MIN_PURCHASE.toLocaleString('es-AR')}`;
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-disabled');
    }
}

async function handleOrderSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn.innerText;

    // Validación de seguridad adicional
    if (Object.keys(cart).length === 0) {
        alert('El carrito está vacío');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = 'Enviando...';

    // 4. Capturar campos obligatorios y validar (Evitar envíos vacíos)
    const nombre = document.querySelector('[name="nombre"]').value.trim();
    const telefono = document.querySelector('[name="telefono"]').value.trim();
    const direccion = document.querySelector('[name="direccion"]').value.trim();

    if (!nombre || !telefono || !direccion) {
        alert("Por favor, completa los campos de nombre, teléfono y dirección.");
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        return;
    }

    // 5. Construcción del objeto JSON PLANO (16 campos para Google Sheets)
    // Generar datos adicionales y sincronizar campos ocultos en el DOM
    const numeroPedido = 'HU-' + Date.now().toString().slice(-6);
    const fechaActual = new Date().toLocaleString('es-AR');

    // Capturar valor de día de entrega para fecha_entrega
    const diaSeleccionado = document.querySelector('[name="dia_entrega"]').value;
    const horarioSeleccionado = document.querySelector('[name="horario_entrega"]').value;

    document.querySelector('[name="numero_pedido"]').value = numeroPedido;
    document.querySelector('[name="fecha"]').value = fechaActual;
    document.querySelector('[name="fecha_entrega"]').value = diaSeleccionado + " (" + horarioSeleccionado + ")";
    document.querySelector('[name="ficha_entrega"]').value = `https://www.huertaurbana.com.ar/pedido/${numeroPedido}`;

    // Captura robusta de datos del formulario usando FormData
    const formData = new FormData(form);
    const metodoPago = 'mercadopago';

    console.log("Método de pago detectado:", metodoPago);

    const orderData = {
        "numero_pedido": formData.get("numero_pedido"),
        "fecha": formData.get("fecha"),
        "nombre": nombre,
        "telefono": telefono,
        "email": formData.get("email"),
        "direccion": direccion,
        "localidad": formData.get("localidad"),
        "dia_entrega": formData.get("dia_entrega"),
        "horario_entrega": formData.get("horario_entrega"),
        "metodo_pago": metodoPago,
        "producto": formData.get("producto"),
        "cantidad": formData.get("cantidad"),
        "total": formData.get("total"),
        "estado": formData.get("estado"),
        "observaciones": formData.get("observaciones") || 'Sin observaciones',
        "fecha_entrega": formData.get("fecha_entrega"),
        "ficha_entrega": formData.get("ficha_entrega"),
        // Campos adicionales para integración de notificaciones Mercado Pago vía Make
        "external_reference": formData.get("numero_pedido"),
        "notification_url": "https://hook.us2.make.com/uwcvtbynbitqnxvm5ekx75by8jyuljxr"
    };

    console.log("Enviando pedido a Make:", orderData);

    try {
        const WEBHOOK_MAKE_URL = "https://hook.us2.make.com/elknbrsvv3n54pb2cm25loxuokw3j4ca";

        const response = await fetch(WEBHOOK_MAKE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Respuesta recibida:", data);

            // Redirección Automática (Mercado Pago)
            if (metodoPago === 'mercadopago') {
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    console.error("Error: URL de pago no encontrada en la respuesta");
                    alert("Hubo un error al generar el link de pago. Por favor, intenta de nuevo o elige Efectivo.");
                }
                return;
            }

            // 2. Caso Efectivo: Mostrar mensaje de éxito local y limpiar
            document.getElementById('order-form').reset();
            cart = {};
            updateSummary();

            const successModal = document.getElementById('success-modal');
            const successMsg = document.getElementById('success-message');

            if (orderData.metodo_pago === 'efectivo' && successMsg) {
                successMsg.innerText = "Pedido recibido. Se paga en efectivo al momento de la entrega.";
            }

            if (successModal) successModal.style.display = 'flex';

        } else {
            throw new Error('Error en el servidor de Make');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar el pedido. Por favor, intenta de nuevo o contáctanos por WhatsApp.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    }
}


function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
    cart = {};
    document.getElementById('order-form').reset();
    renderCombos();
    renderCustomProducts();
    updateSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showComboDetails(id) {
    const combo = PRODUCTS.combos.find(c => c.id === id);
    if (!combo) return;

    document.getElementById('modal-combo-img').src = combo.img;
    document.getElementById('modal-combo-img').alt = combo.name;
    document.getElementById('modal-combo-name').innerText = combo.name;
    document.getElementById('modal-combo-price').innerText = `$${combo.price.toLocaleString('es-AR')}`;

    const itemsList = document.getElementById('modal-combo-items');
    itemsList.innerHTML = combo.items.map(item => `<li><ion-icon name="checkmark-outline"></ion-icon> ${item}</li>`).join('');

    const addBtn = document.getElementById('modal-add-btn');
    addBtn.onclick = () => {
        updateComboQty(id, 1);
        closeComboModal();
    };

    document.getElementById('combo-modal').style.display = 'flex';
}

function closeComboModal() {
    document.getElementById('combo-modal').style.display = 'none';
}

