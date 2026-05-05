/* HUERTA URBANA - LOGIC & CART SYSTEM (Catalogo Extendido) */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js?v=76');
}

/* ── PWA: Sistema de Instalación ─────────────────────── */
let deferredPrompt = null;

// 1. Capturar el evento nativo de Chrome/Android
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA Evento capturado mostrando banner en 3 segundos');
  setTimeout(() => {
    if (sessionStorage.getItem('pwa_dismissed') === 'true') return;
    const banner = document.getElementById('pwa-banner');
    if (banner) {
      banner.classList.add('pwa-visible');
      console.log('PWA Banner mostrado');
    } else {
      console.log('PWA ERROR banner no encontrado en el DOM');
    }
  }, 3000);
});

// 2. Mostrar el banner siempre en mobile si no está instalada (Independiente del evento)
setTimeout(() => {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = ua.includes('android') || ua.includes('iphone') || ua.includes('ipad');
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
  const wasInstalledBefore = localStorage.getItem('huerta_pwa_instalada') === 'true';
  
  if (isMobile && !isInstalled && !wasInstalledBefore && sessionStorage.getItem('pwa_dismissed') !== 'true') {
    const banner = document.getElementById('pwa-banner');
    if (banner) {
      banner.classList.add('pwa-visible');
      console.log('PWA Banner mostrado en mobile (Fallback manual)');
    }
  }
}, 3000);

// 3. Listeners de los botones del banner
document.addEventListener('DOMContentLoaded', () => {
  const btnInstalar = document.getElementById('pwa-install-btn');
  const btnDismiss = document.getElementById('pwa-dismiss-btn');
  const banner = document.getElementById('pwa-banner');

  btnInstalar?.addEventListener('click', async () => {
    // Ocultar banner inmediatamente
    if (banner) {
      banner.style.display = 'none';
      banner.classList.remove('pwa-visible');
    }

    if (deferredPrompt) {
      console.log('[PWA] Ejecutando deferredPrompt.prompt()');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] El usuario eligió: ${outcome}`);
      if (outcome === 'accepted') {
        localStorage.setItem('huerta_pwa_instalada', 'true');
      }
      deferredPrompt = null;
    } else {
      console.log('[PWA] deferredPrompt no disponible, mostrando instrucciones manuales');
      const ua = navigator.userAgent.toLowerCase();
      const esIOS = /iphone|ipad|ipod/i.test(ua) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      if (esIOS) {
        const safariView = document.getElementById('ios-safari-view');
        const chromeView = document.getElementById('ios-chrome-view');
        
        // Detección específica Safari vs Chrome iOS
        const isChromeIOS = ua.includes('crios');
        const isSafariIOS = ua.includes('safari') && !isChromeIOS;

        if (isChromeIOS) {
          safariView.style.display = 'none';
          chromeView.style.display = 'block';
        } else {
          safariView.style.display = 'block';
          chromeView.style.display = 'none';
        }
        
        document.getElementById('ios-install-modal').style.display = 'flex';
      } else {
        alert('Tocá los 3 puntitos arriba a la derecha y seleccioná Instalar aplicación');
      }
      banner.classList.remove('pwa-visible');
    }
  });

  btnDismiss?.addEventListener('click', dismissPWABanner);
});

// Función global para asegurar cierre inmediato
window.dismissPWABanner = function() {
  const banner = document.getElementById('pwa-banner');
  if (banner) {
    banner.style.display = 'none';
    banner.classList.remove('pwa-visible');
    sessionStorage.setItem('pwa_dismissed', 'true');
    console.log('PWA Banner descartado');
  }
};

window.addEventListener('appinstalled', () => {
  console.log('[PWA] Aplicación instalada con éxito');
  localStorage.setItem('huerta_pwa_instalada', 'true');
  const banner = document.getElementById('pwa-banner');
  if (banner) {
      banner.style.display = 'none';
      banner.classList.remove('pwa-visible');
  }
});

const PRODUCTS = {
    combos: [
        {
            id: 'c1', name: 'Combo básico', price: 35000,
            desc: 'Mezcla esencial de frutas y verduras para arrancar la semana con energía y frescura.',
            img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300',
            items: ['2 kilos Papa blanca', '1 kilo Cebolla blanca', '1 kilo Tomate', '1/2 kilo Lechuga mantecosa', '1 kilo Manzana roja', '1 kilo Naranja']
        },
        {
            id: 'c2', name: 'Combo familiar', price: 65000,
            desc: 'Pensado para cubrir las necesidades de una familia, con frutas y verduras frescas para todos los días.',
            img: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=300',
            items: ['4 kilos Papa blanca', '2 kilos Cebolla blanca', '2 kilos Tomate', '1 kilo Lechuga mantecosa', '1 kilo Zanahoria', '1 kilo Calabaza anco', '2 kilos Manzana roja', '2 kilos Naranja', '1 kilo Banana']
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
            items: ['2 kilos Papa blanca', '1 kilo Cebolla blanca', '1 kilo Tomate', '1 kilo Fruta Mezclada']
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

const PRECIOS_JSON_URL = 'https://raw.githubusercontent.com/renzocolombo/HUERTA-URBANA-2/main/precios.json'
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHOan5n0wUgEodP4WCuf830d3X65rXUG9OWYbml_i39bNYHhbI20EKJ4Mpl6WZHCRi/exec';

let MIN_PURCHASE = 35000;
let cart = {};
let activeCategory = 'verduras';

const CUPONES_VALIDOS = {
  'BIENVENIDO10': { tipo: 'porcentaje', valor: 10, descripcion: '10% de descuento de bienvenida' }
}
let cuponAplicado = null;
let cupon_codigo = '';         // cupón de bienvenida → campo U del webhook
let codigo_referido_usado = ''; // código de referido  → campo V del webhook
let creditoAplicado = 0; // v5.5

async function cargarPrecios() {
  try {
    const response = await fetch(APPS_SCRIPT_URL + '?accion=getPreciosWeb')
    const data = await response.json()
    if (data.success) {
      if (data.monto_minimo) MIN_PURCHASE = data.monto_minimo
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
  console.log(`[TEXTOS] Sincronizando con MIN_PURCHASE: ${MIN_PURCHASE}`);
  console.log('monto_minimo:', MIN_PURCHASE, 'elemento:', document.getElementById('header-minima-monto'));
  
  const ids = ['envio-gratis-monto', 'compra-minima-monto', 'footer-minima-monto', 'header-minima-monto', 'terms-minima-monto']
  ids.forEach(id => {
    const el = document.getElementById(id)
    if (el) el.textContent = monto
  })
}

function pluralizar(cantidad, palabra) {
  if (!palabra || cantidad <= 1) return palabra;
  const p = palabra.toLowerCase().trim();
  if (p === 'kg' || p === 'kilo') return 'kilos';
  if (p === 'unidad') return 'unidades';
  if (p === 'atado') return 'atados';
  if (p === 'maple') return 'maples';
  if (p === 'cabeza') return 'cabezas';
  if (p === 'bandeja') return 'bandejas';
  
  if (palabra.toLowerCase().endsWith('ón')) return palabra.slice(0, -2) + 'ones';
  if (/[aeiouáéíóú]$/i.test(palabra)) return palabra + 's';
  return palabra + 'es';
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
    // Detectar unidad dinámica v4.1
    let unit = p.unit || p.unidad || 'kg'
    let step = (unit === 'kg') ? 0.5 : 1
    let min = (unit === 'kg') ? 0.5 : 1

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
    actualizarTextos();
    updateSummary();

    // Corrección automática de desfasaje de scroll en carga inicial (v50.0)
    if (window.location.hash === '#formulario') {
        setTimeout(() => {
            const target = document.getElementById('formulario');
            if (target) {
                target.scrollIntoView({ behavior: 'auto', block: 'start' });
            }
        }, 100); // Mucho más rápido para que sea casi imperceptible
    }

    // Lógica de Cupón
    document.getElementById('btn-aplicar-cupon')?.addEventListener('click', () => {
      const codigo = document.getElementById('cupon-input').value.trim().toUpperCase()
      const mensaje = document.getElementById('cupon-mensaje')
      
      if (!codigo) {
        mensaje.textContent = 'Ingresá un código de cupón'
        mensaje.className = 'cupon-mensaje error'
        return
      }
      
      // Caso 1: Cupón de bienvenida BIENVENIDO10 → campo U (cupon_codigo)
      if (CUPONES_VALIDOS[codigo]) {
        cuponAplicado = { codigo, ...CUPONES_VALIDOS[codigo] }
        cupon_codigo = codigo          // solo en campo U
        codigo_referido_usado = ''     // campo V vacío
        mensaje.textContent = `✅ Cupón aplicado — ${cuponAplicado.descripcion}`
        mensaje.className = 'cupon-mensaje exito'
        updateSummary()
        return
      }
      
      // Caso 2: Código de referido HU-XXXX → campo V (codigo_referido_usado)
      if (/^HU-.{4}$/.test(codigo)) {
        cuponAplicado = { codigo, tipo: 'porcentaje', valor: 10, descripcion: '10% de descuento por referido' }
        codigo_referido_usado = codigo // solo en campo V
        cupon_codigo = ''              // campo U vacío
        mensaje.textContent = `Código de referido aplicado ✅`
        mensaje.className = 'cupon-mensaje exito'
        updateSummary()
        return
      }
      
      cuponAplicado = null
      cupon_codigo = ''
      codigo_referido_usado = ''
      mensaje.textContent = '❌ Cupón inválido o expirado'
      mensaje.className = 'cupon-mensaje error'
      updateSummary()
    })

    // Lógica de Crédito Referido v5.5
    document.getElementById('btn-aplicar-credito')?.addEventListener('click', () => {
      const mensaje = document.getElementById('credit-mensaje');
      if (!window.userCredits || window.userCredits <= 0) {
        mensaje.textContent = 'No tenés créditos disponibles';
        mensaje.className = 'cupon-mensaje error';
        return;
      }

      if (creditoAplicado > 0) {
        creditoAplicado = 0;
        mensaje.textContent = 'Créditos removidos';
        mensaje.className = 'cupon-mensaje';
        document.getElementById('btn-aplicar-credito').innerText = 'Aplicar';
      } else {
        creditoAplicado = window.userCredits;
        mensaje.textContent = `✅ Créditos aplicados: $${creditoAplicado.toLocaleString('es-AR')}`;
        mensaje.className = 'cupon-mensaje exito';
        document.getElementById('btn-aplicar-credito').innerText = 'Remover';
      }
      updateSummary();
    });
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
        if (e.target === document.getElementById('terms-modal')) closeTermsModal();
    });

    // Listener para checkbox obligatorio de términos
    const checkObligatorio = document.getElementById('check-terms-obligatorio');
    const btnFinal = document.getElementById('btn-confirmar-pedido-final');
    
    checkObligatorio?.addEventListener('change', function() {
        if (this.checked) {
            btnFinal.disabled = false;
            btnFinal.classList.remove('btn-disabled');
        } else {
            btnFinal.disabled = true;
            btnFinal.classList.add('btn-disabled');
        }
    });

    btnFinal?.addEventListener('click', confirmarPedidoFinal);
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

            const unitLabel = item.unit || item.unidad || 'kg';
            const displayQty = item.qty === 0.5 ? '1/2' : item.qty;
            let itemText;
            if (unitLabel.toLowerCase() === 'unidad' || unitLabel === '') {
                itemText = `${displayQty} ${pluralizar(item.qty, item.name)}`;
            } else if (unitLabel.toLowerCase().includes('kg') || unitLabel.toLowerCase().includes('kilo')) {
                const uKilo = item.qty <= 1 ? 'kilo' : 'kilos';
                itemText = `${displayQty} ${uKilo} ${item.name}`;
            } else {
                itemText = `${displayQty} ${pluralizar(item.qty, unitLabel)} ${item.name}`;
            }

            html += `
                <div class="cart-modal-item">
                    <div class="cart-modal-item-info">
                        <span class="cart-modal-item-name">${itemText}</span>
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
    combosContainer.innerHTML = PRODUCTS.combos.map(combo => {
        // La descripción ya suele traer la lista de productos (según la foto)
        // Vamos a usar esa descripción y agregarle el "expandir" si es muy larga.
        let fullDesc = (combo.desc || '').replace(/\b0\.5\b/g, '1/2').replace(/\b1\/2\b/g, '1/2 kilo').replace(/\bunidad\b/gi, '').replace(/\s+/g, ' ').trim();
        const maxLength = 80; // Un poco más de margen para la descripción
        let descHtml = fullDesc;
        let expandHtml = '';

        if (fullDesc.length > maxLength) {
            descHtml = fullDesc.substring(0, maxLength) + '...';
            expandHtml = '<span class="expand-text">EXPANDIR</span>';
        }

        return `
            <div class="combo-card" onclick="showComboDetails('${combo.id}')" style="cursor: pointer;">
                <img src="${combo.img}" alt="${combo.name}" class="combo-img">
                <div class="combo-info">
                    <h3>${combo.name}</h3>
                    <p class="combo-desc">
                        ${descHtml} ${expandHtml}
                    </p>
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
        `;
    }).join('');
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
                    <span>$${Math.floor(prod.price).toLocaleString('es-AR')} / ${ (prod.unit || prod.unidad || 'kg').toLowerCase() === 'unidad' ? '' : (prod.unit || prod.unidad || 'kg') }</span>
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
            const unitLabel = item.unit || item.unidad || 'kg';
            const displayQty = item.qty === 0.5 ? '1/2' : item.qty;
            let itemText;
            if (unitLabel.toLowerCase() === 'unidad' || unitLabel === '') {
                itemText = `${displayQty} ${pluralizar(item.qty, item.name)}`;
            } else if (unitLabel.toLowerCase().includes('kg') || unitLabel.toLowerCase().includes('kilo')) {
                const uKilo = item.qty <= 1 ? 'kilo' : 'kilos';
                itemText = `${displayQty} ${uKilo} ${item.name}`;
            } else {
                itemText = `${displayQty} ${pluralizar(item.qty, unitLabel)} ${item.name}`;
            }
            const subtotalText = `$${Math.floor(subtotal).toLocaleString('es-AR')}`;

            itemsHtml += `
                <div class="summary-item">
                    <span>${itemText}</span>
                    <span>${subtotalText}</span>
                </div>
            `;
        });
    }

    // Calcular descuento por cupón
    let descuentoCupon = 0;
    if (cuponAplicado && cuponAplicado.tipo === 'porcentaje') {
        descuentoCupon = Math.floor(total * cuponAplicado.valor / 100);
        itemsHtml += `
            <div class="summary-item discount-item" style="color: #22c55e; font-weight: 600;">
                <span>Descuento (${cuponAplicado.codigo})</span>
                <span>-$${descuentoCupon.toLocaleString('es-AR')}</span>
            </div>
        `;
    }

    // Calcular descuento por crédito v5.5 (sobre el subtotal después de cupón)
    const subtotalPostCupon = total - descuentoCupon;
    let actualDescuentoCredito = 0;
    
    if (creditoAplicado > 0) {
        actualDescuentoCredito = Math.min(subtotalPostCupon, creditoAplicado);
        itemsHtml += `
            <div class="summary-item discount-item" style="color: #22c55e; font-weight: 600;">
                <span>Créditos aplicados</span>
                <span>-$${actualDescuentoCredito.toLocaleString('es-AR')}</span>
            </div>
        `;
    }

    summaryItems.innerHTML = itemsHtml;

    const totalFinal = subtotalPostCupon - actualDescuentoCredito;
    summaryTotal.innerText = `$${Math.floor(totalFinal).toLocaleString('es-AR')}`;
    headerTotal.innerText = `$${Math.floor(totalFinal).toLocaleString('es-AR')}`;

    // Sincronizar con campo de producto para el JSON de Make
    const hiddenDetails = document.getElementById('hidden-details');

    if (hiddenDetails) {
        const textSummary = Object.values(cart).map(item => {
            const unitLabel = item.unit || item.unidad || 'kg';
            const displayQty = item.qty === 0.5 ? '1/2' : item.qty;
            let itemText;
            if (unitLabel.toLowerCase() === 'unidad' || unitLabel === '') {
                itemText = `${displayQty} ${pluralizar(item.qty, item.name)}`;
            } else if (unitLabel.toLowerCase().includes('kg') || unitLabel.toLowerCase().includes('kilo')) {
                const uKilo = item.qty <= 1 ? 'kilo' : 'kilos';
                itemText = `${displayQty} ${uKilo} ${item.name}`;
            } else {
                itemText = `${displayQty} ${pluralizar(item.qty, unitLabel)} ${item.name}`;
            }
            return itemText.toUpperCase();
        }).join(', ');

        hiddenDetails.value = textSummary;

        // Sincronizar también cantidad y total en el DOM (campos ocultos)
        const cantidadInput = document.querySelector('[name="cantidad"]');
        const totalInput = document.querySelector('[name="total"]');
        const creditoUsadoInput = document.querySelector('[name="credito_usado"]'); // v5.5

        if (cantidadInput) cantidadInput.value = Object.values(cart).reduce((acc, item) => acc + (item.qty || 1), 0);
        if (totalInput) totalInput.value = totalFinal; // Sincronizar el total REAL final
        if (creditoUsadoInput) creditoUsadoInput.value = actualDescuentoCredito;
    }

    // Also update modal if visible
    if (document.getElementById('cart-modal').style.display === 'flex') {
        updateCartModalContent();
    }

    // Actualizar indicador de envío en el header (v4.0)
    const headerMsg = document.getElementById('shipping-header-msg');

    const montoStr = `$${MIN_PURCHASE.toLocaleString('es-AR')}`;

    if (total >= MIN_PURCHASE) {
        // Estado: Éxito con monto
        if (headerMsg) headerMsg.textContent = '¡Envío GRATIS!';
        
        const spanMinima = document.getElementById('compra-minima-monto');
        if (spanMinima) spanMinima.textContent = 'ALCANZADO';

        if (headerMsg) headerMsg.className = 'shipping-header-msg status-green';
        if (minMsg) minMsg.style.color = '#27ae60';
        
        // Habilitar botón de envío
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-disabled');
    } else {
        // Estado: Pendiente de monto
        if (headerMsg) headerMsg.textContent = 'Envío gratis a partir de ' + montoStr;
        
        const spanMinima = document.getElementById('compra-minima-monto');
        if (spanMinima) spanMinima.textContent = montoStr;

        if (headerMsg) headerMsg.className = 'shipping-header-msg status-red';
        if (minMsg) minMsg.style.color = '#e74c3c';

        submitBtn.disabled = true;
        submitBtn.classList.add('btn-disabled');
    }
}

async function handleOrderSubmit(e) {
    e.preventDefault();
    
    // Validación de seguridad adicional
    if (Object.keys(cart).length === 0) {
        alert('El carrito está vacío');
        return;
    }

    // Capturar campos obligatorios y validar
    const nombre = document.querySelector('[name="nombre"]').value.trim();
    const telefono = document.querySelector('[name="telefono"]').value.trim();
    const direccion = document.querySelector('[name="direccion"]').value.trim();

    if (!nombre || !telefono || !direccion) {
        alert("Por favor, completa los campos de nombre, teléfono y dirección.");
        return;
    }

    processOrder(e.target);
}

async function processOrder(form) {
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

    const baseTotal = Object.values(cart).reduce((acc, item) => acc + (item.price * item.qty), 0);
    const totalNum = parseFloat(formData.get("total"));
    const cuponDescuentoMonto = (cuponAplicado && cuponAplicado.tipo === 'porcentaje') 
        ? Math.floor(baseTotal * cuponAplicado.valor / 100) 
        : 0;

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
        "total": totalNum,
        "cupon": cuponAplicado ? cuponAplicado.codigo : '',
        "cupon_codigo": cupon_codigo,           // campo U: solo cupones de bienvenida (ej: BIENVENIDO10)
        "cupon_descuento": cuponDescuentoMonto,
        "uid": window.userUID || '',
        "codigo_referido_usado": codigo_referido_usado, // campo V: solo códigos HU-XXXX
        "descuento": cuponDescuentoMonto,
        "acepto_tyc": localStorage.getItem('huerta_tyc_val') || 'SI',
        "acepto_publicidad": localStorage.getItem('huerta_pub_val') || 'NO',
        "estado": formData.get("estado"),
        "observaciones": formData.get("observaciones") || 'Sin observaciones',
        "fecha_entrega": formData.get("fecha_entrega"),
        "ficha_entrega": formData.get("ficha_entrega"),
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

    // Función auxiliar idéntica a la de renderCombos
    const formatItem = (item) => {
        if (typeof item === 'string') {
            return item.replace(/\b0\.5\b/g, '1/2').replace(/\bunidad\b/gi, '').replace(/\s+/g, ' ').trim();
        }
        if (item && typeof item === 'object') {
            const cant = item.cantidad || item.qty || '';
            const unit = item.unidad || item.unit || '';
            const name = item.nombre || item.name || '';
            
            const displayCant = (cant === 0.5 || cant === '0.5') ? '1/2' : cant;
            const displayUnit = (unit.toLowerCase() === 'unidad') ? '' : unit;
            
            return `${displayCant}${displayUnit} ${name}`.replace(/\s+/g, ' ').trim();
        }
        return '';
    };

    document.getElementById('modal-combo-img').src = combo.img;
    document.getElementById('modal-combo-img').alt = combo.name;
    document.getElementById('modal-combo-name').innerText = combo.name;
    document.getElementById('modal-combo-price').innerText = `$${combo.price.toLocaleString('es-AR')}`;

    const itemsList = document.getElementById('modal-combo-items');
    itemsList.innerHTML = combo.items.map(item => `<li><ion-icon name="checkmark-outline"></ion-icon> ${formatItem(item)}</li>`).join('');

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

/* ── Términos y Condiciones ────────────────────────── */
function switchTermsTab(tab) {
    document.querySelectorAll('.terms-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(tab));
    });
    document.getElementById('terms-text-terminos').style.display = (tab === 'terminos' ? 'block' : 'none');
    document.getElementById('terms-text-privacidad').style.display = (tab === 'privacidad' ? 'block' : 'none');
}

function closeTermsModal() {
    document.getElementById('terms-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openTermsModalManual() {
    document.getElementById('terms-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

async function confirmarPedidoFinal() {
    const checkObligatorio = document.getElementById('check-terms-obligatorio').checked;
    const novedades = document.getElementById('check-terms-novedades').checked;
    
    if (checkObligatorio) {
        const now = new Date();
        const fechaTyC = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
        
        try {
            localStorage.setItem('huerta_terms_accepted', 'true');
            localStorage.setItem('huerta_tyc_val', `SI ${fechaTyC}`);
            localStorage.setItem('huerta_pub_val', novedades ? 'SI' : 'NO');
        } catch (e) {
            console.warn('LocalStorage no disponible');
        }
    }

    closeTermsModal();
    // Re-ejecutar resumen para habilitar botón principal
    updateSummary();
    
    // Si veníamos de un intento de envío, procesar
    if (window.pendingOrderForm) {
        processOrder(window.pendingOrderForm);
    }
}

function copyLinkForSafari() {
    const url = 'huertaurbana.com.ar';
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('btn-copy-link');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '¡Copiado! ✓';
            btn.style.background = '#1cb053';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '#333';
            }, 2000);
        }
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
}

