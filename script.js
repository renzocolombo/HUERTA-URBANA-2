/* HUERTA URBANA - LOGIC & CART SYSTEM (Catalogo Extendido) */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js?v=83');
}

/* ── PWA: Sistema de Instalación ─────────────────────── */
let deferredPrompt = null;

// 1. Capturar el evento nativo de Chrome/Android
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA Evento capturado mostrando banner en 3 segundos');
  setTimeout(() => {
    if (document.documentElement.classList.contains('preview-locked') || sessionStorage.getItem('pwa_dismissed') === 'true') return;
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
  
  if (isMobile && !isInstalled && !wasInstalledBefore && sessionStorage.getItem('pwa_dismissed') !== 'true' && !document.documentElement.classList.contains('preview-locked')) {
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
        'market': []
    }
};

// Compatibilidad por si algún script antiguo accede a .extras
if (!PRODUCTS.individual.extras) {
    Object.defineProperty(PRODUCTS.individual, 'extras', {
        get() { return this.market; },
        set(v) { this.market = v; }
    });
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzWSEDWrGAkLRPj_ugVL6ZIm9qZBxLu93VemH6eSXv0xx6RNSyakn-4q2T7Ik6TpyX7/exec';

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
let credito_usado = 0;   // v5.6 - monto real aplicado al pedido

// ==================== CALENDARIO Y ENTREGAS (v2) ====================
let serverTimeOffset = 0;
let feriadosCerrados = [];

async function sincronizarFeriadosYReloj() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ accion: 'getFeriados', action: 'getFeriados' }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Respuesta HTTP no exitosa: ' + response.status);
        const data = await response.json();
        if (data && data.ahora) {
            const parsedServer = Date.parse(data.ahora);
            if (!isNaN(parsedServer)) {
                serverTimeOffset = parsedServer - Date.now();
            }
        }
        if (data && Array.isArray(data.feriados)) {
            feriadosCerrados = data.feriados;
        }
    } catch (e) {
        console.warn('No se pudo sincronizar feriados/reloj con el servidor (fallback reloj local y feriados vacíos):', e);
        serverTimeOffset = 0;
        feriadosCerrados = [];
    }
}

function obtenerAhoraServidor() {
    return new Date(Date.now() + serverTimeOffset);
}

function actualizarSelectorEntregas() {
    const select = document.getElementById('delivery-day');
    const hiddenTime = document.getElementById('delivery-time');
    if (!select) return;

    const ahora = obtenerAhoraServidor();
    const horizonte = (typeof HORIZONTE_DIAS !== 'undefined' ? HORIZONTE_DIAS : 14);
    const disponibles = (typeof bloquesDisponibles === 'function' 
        ? bloquesDisponibles(ahora, feriadosCerrados, horizonte) 
        : (window.EntregaCalendario ? window.EntregaCalendario.bloquesDisponibles(ahora, feriadosCerrados, horizonte) : []));

    const valorPrevio = select.value;
    select.innerHTML = '';

    if (!disponibles || disponibles.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'No hay entregas disponibles';
        opt.disabled = true;
        opt.selected = true;
        select.appendChild(opt);
        if (hiddenTime) hiddenTime.value = '';
        actualizarTextoEntregaAuto(null);
        return;
    }

    const gruposPorDia = {};
    disponibles.forEach(({ ymd, bloque }) => {
        if (!gruposPorDia[ymd]) gruposPorDia[ymd] = [];
        gruposPorDia[ymd].push(bloque);
    });

    let primeraOpcionValida = null;
    let opcionCoincidente = null;
    const diasNombres = (typeof DIAS !== 'undefined' ? DIAS : ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]);

    Object.keys(gruposPorDia).forEach((ymd) => {
        const [y, m, d] = ymd.split('-');
        const dow = (typeof dowDeYmd === 'function' ? dowDeYmd(ymd) : new Date(Date.UTC(Number(y), Number(m)-1, Number(d))).getUTCDay());
        const labelDia = `${diasNombres[dow]} ${d}/${m}`;

        const optgroup = document.createElement('optgroup');
        optgroup.label = labelDia;

        gruposPorDia[ymd].forEach((bloque) => {
            const opt = document.createElement('option');
            const val = (typeof formatoDiaEntrega === 'function' 
                ? formatoDiaEntrega(ymd, bloque) 
                : `${diasNombres[dow]} ${d}/${m}/${y} ${bloque === 'M' ? 'Mañana' : 'Tarde'}`);
            opt.value = val;
            opt.dataset.ymd = ymd;
            opt.dataset.bloque = bloque;
            opt.textContent = (typeof etiquetaBloque === 'function' 
                ? etiquetaBloque(bloque) 
                : (bloque === 'M' ? 'Mañana (8 a 12 h)' : 'Tarde (14 a 17 h)'));

            if (!primeraOpcionValida) {
                primeraOpcionValida = val;
            }
            if (val === valorPrevio) {
                opcionCoincidente = val;
            }

            optgroup.appendChild(opt);
        });

        select.appendChild(optgroup);
    });

    select.value = opcionCoincidente || primeraOpcionValida;
    sincronizarHorarioEntrega();
    actualizarTextoEntregaAuto(select.value);
}

function actualizarTextoEntregaAuto(valorSeleccionado) {
    const autoTextEl = document.getElementById('delivery-auto-text');
    if (!autoTextEl) return;

    if (!valorSeleccionado) {
        autoTextEl.textContent = 'No hay entregas disponibles';
        return;
    }

    const parsed = (typeof parseDiaEntrega === 'function' ? parseDiaEntrega(valorSeleccionado) : null);
    if (parsed && parsed.ymd && parsed.bloque) {
        const [y, m, d] = parsed.ymd.split('-');
        const dow = (typeof dowDeYmd === 'function' 
            ? dowDeYmd(parsed.ymd) 
            : new Date(Date.UTC(Number(y), Number(m) - 1, Number(d))).getUTCDay());
        const diasNombres = (typeof DIAS !== 'undefined' 
            ? DIAS 
            : ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]);
        const nombresConTilde = {
            "Domingo": "Domingo",
            "Lunes": "Lunes",
            "Martes": "Martes",
            "Miercoles": "Miércoles",
            "Miércoles": "Miércoles",
            "Jueves": "Jueves",
            "Viernes": "Viernes",
            "Sabado": "Sábado",
            "Sábado": "Sábado"
        };
        const rawDia = diasNombres[dow] || 'Día';
        const diaLindo = nombresConTilde[rawDia] || rawDia;
        const bloqueTexto = parsed.bloque === 'M' ? 'la Mañana' : 'la Tarde';
        autoTextEl.textContent = `${diaLindo} ${d}/${m} por ${bloqueTexto}`;
    } else {
        autoTextEl.textContent = valorSeleccionado;
    }
}

function sincronizarHorarioEntrega() {
    const select = document.getElementById('delivery-day');
    const hiddenTime = document.getElementById('delivery-time');
    if (!select || !hiddenTime) return;

    let bloque = null;
    const opt = select.selectedOptions && select.selectedOptions[0];
    if (opt && opt.dataset.bloque) {
        bloque = opt.dataset.bloque;
    } else {
        const parsed = (typeof parseDiaEntrega === 'function' ? parseDiaEntrega(select.value) : null);
        if (parsed && parsed.bloque) {
            bloque = parsed.bloque;
        }
    }

    if (bloque === 'M') {
        hiddenTime.value = '8 a 12 hs';
    } else if (bloque === 'T') {
        hiddenTime.value = '14 a 17 hs';
    } else {
        hiddenTime.value = '';
    }
}

function normalizarIdProducto(nombre) {
  return (nombre || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

function mostrarAviso(mensaje) {
  let toast = document.getElementById('huerta-toast-aviso');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'huerta-toast-aviso';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:30px;font-size:14px;font-weight:600;box-shadow:0 10px 25px rgba(0,0,0,0.35);z-index:999999;display:flex;align-items:center;gap:10px;opacity:0;pointer-events:none;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);max-width:90vw;border:1px solid #333;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>🔄</span> <span>${mensaje}</span>`;
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
    toast.style.pointerEvents = 'auto';
  });

  if (window._huertaToastTimer) clearTimeout(window._huertaToastTimer);
  window._huertaToastTimer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
  }, 4500);
}

function buscarProductoCatalogo(id, type) {
  if (type === 'combo') {
    return PRODUCTS.combos?.find(c => c.id === id) || null;
  }
  for (const cat of ['verduras', 'frutas', 'market']) {
    const prod = PRODUCTS.individual[cat]?.find(p => p.id === id);
    if (prod) return prod;
  }
  return PRODUCTS.combos?.find(c => c.id === id) || null;
}

function recalcularCarrito() {
  let huboCambios = false;
  let cambiosPrecio = false;
  let productosQuitados = false;

  const itemIds = Object.keys(cart);
  if (itemIds.length === 0) {
    return { huboCambios: false, cambiosPrecio: false, productosQuitados: false };
  }

  itemIds.forEach(id => {
    const cartItem = cart[id];
    if (!cartItem) return;

    const productoActual = buscarProductoCatalogo(id, cartItem.type);

    if (!productoActual) {
      // El producto ya no existe en el catálogo o está inactivo (apagado)
      delete cart[id];
      huboCambios = true;
      productosQuitados = true;
    } else {
      if (cartItem.price !== productoActual.price) {
        cartItem.price = productoActual.price;
        huboCambios = true;
        cambiosPrecio = true;
      }
      if (productoActual.name && cartItem.name !== productoActual.name) {
        cartItem.name = productoActual.name;
      }
      if (productoActual.unit && cartItem.unit !== productoActual.unit) {
        cartItem.unit = productoActual.unit;
      }
    }
  });

  if (huboCambios) {
    mostrarAviso('Actualizamos los precios de tu carrito');
    updateSummary();
    renderCombos();
    renderCustomProducts();
  }

  return { huboCambios, cambiosPrecio, productosQuitados };
}

let cargandoPreciosPromise = null;
let ultimoFetchPrecios = 0;
let preciosCargadosOk = false;

function deshabilitarBotonFinalizar() {
  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-disabled');
  }
}

function mostrarAvisoErrorPrecios() {
  let aviso = document.getElementById('aviso-error-precios');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.id = 'aviso-error-precios';
    aviso.className = 'aviso-error-precios';
    aviso.setAttribute('role', 'alert');
    aviso.innerHTML = `
      <div class="aviso-error-precios-inner">
        <div class="aviso-error-precios-msg">
          <span class="aviso-icon">⚠️</span>
          <span class="aviso-texto">No pudimos cargar los precios actualizados. Reintenta en unos minutos</span>
        </div>
        <button type="button" id="btn-reintentar-precios" class="btn-reintentar-precios">Reintentar</button>
      </div>
    `;
    const target = document.getElementById('header') || (typeof document !== 'undefined' && document.body ? document.body.firstChild : null);
    if (target && target.parentNode) {
      target.parentNode.insertBefore(aviso, target);
    } else if (typeof document !== 'undefined' && document.body) {
      document.body.prepend(aviso);
    }
  }

  aviso.style.display = 'block';

  const btn = document.getElementById('btn-reintentar-precios');
  if (btn) {
    btn.onclick = async () => {
      btn.disabled = true;
      btn.textContent = 'Cargando...';
      try {
        await cargarPrecios(true);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Reintentar';
      }
    };
  }

  deshabilitarBotonFinalizar();
}

function ocultarAvisoErrorPrecios() {
  const aviso = document.getElementById('aviso-error-precios');
  if (aviso) {
    aviso.style.display = 'none';
  }
}

async function fetchPreciosWeb() {
  const response = await fetch(APPS_SCRIPT_URL + '?accion=getPreciosWeb&t=' + Date.now());
  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }
  const data = await response.json();
  if (!data || !data.success) {
    throw new Error((data && data.error) ? data.error : 'Respuesta sin éxito de getPreciosWeb');
  }
  return data;
}

async function cargarPrecios(force = false) {
  if (cargandoPreciosPromise) {
    return cargandoPreciosPromise;
  }
  if (!force && Date.now() - ultimoFetchPrecios < 3000) {
    return { huboCambios: false, cambiosPrecio: false, productosQuitados: false };
  }

  cargandoPreciosPromise = (async () => {
    let cargoExitoso = false;
    ultimoFetchPrecios = Date.now();

    let data = null;
    try {
      data = await fetchPreciosWeb();
    } catch (e1) {
      console.warn('[PRECIOS] Falló intento 1 de getPreciosWeb:', e1.message);
    }

    // Reintentar una vez a los 2 segundos si falló el primer intento
    if (!data) {
      console.log('[PRECIOS] Reintentando getPreciosWeb en 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      try {
        data = await fetchPreciosWeb();
      } catch (e2) {
        console.warn('[PRECIOS] Falló intento 2 (reintento) de getPreciosWeb:', e2.message);
      }
    }

    if (data && data.success) {
      if (data.monto_minimo !== undefined && data.monto_minimo !== null && !isNaN(Number(data.monto_minimo))) {
        MIN_PURCHASE = Number(data.monto_minimo);
      }
      if (data.productos) actualizarProductos(data.productos);
      if (data.combos) actualizarCombos(data.combos);
      actualizarTextos();
      renderCombos();
      cargoExitoso = true;
      preciosCargadosOk = true;
      ocultarAvisoErrorPrecios();
    } else {
      // Si vuelve a fallar tras el reintento: mostrar aviso claro y deshabilitar botón de finalizar
      cargoExitoso = false;
      preciosCargadosOk = false;
      mostrarAvisoErrorPrecios();
    }

    const res = recalcularCarrito();
    if (!cargoExitoso) {
      deshabilitarBotonFinalizar();
    }
    return res;
  })();

  try {
    return await cargandoPreciosPromise;
  } finally {
    cargandoPreciosPromise = null;
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

// Subcategorías internas de Market
const SUBCATEGORIAS_MARKET = ['Almacén', 'Bebidas', 'Enlatados', 'Lácteos', 'Otros'];
let activeMarketSubcategory = 'Todos'; // Mostrar todos los productos de Market por defecto

function determinarCategoria(p) {
  // 1. Leer categoría real si viene asignada desde Google Sheet / Apps Script / Dashboard
  const cat = (p.categoria || p.categoriaPrincipal || p.category || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (cat.includes('verdura')) return 'verduras';
  if (cat.includes('fruta')) return 'frutas';
  if (cat.includes('almacen') || cat.includes('market') || cat.includes('extra')) return 'market';

  // Si tiene subcategoría asignada de almacén/market
  if (p.subcategoria || p.subCategory) return 'market';

  // 2. Fallback de contingencia (por si la API aún no tiene el campo categoria poblado)
  const n = (p.nombre || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (n.includes('miel') || n.includes('huevo') || n.includes('maple')) return 'market';

  // Frutas naturales (no procesadas / no latas)
  const frutasConocidas = ['palta', 'manzana', 'banana', 'naranja', 'limon', 'durazno', 'pomelo', 'uva', 'arandano'];
  if (frutasConocidas.some(f => n.includes(f))) return 'frutas';
  // Verduras naturales (Choclo es verdura, no fruta)
  if (n === 'choclo' || n.startsWith('choclo ')) return 'verduras';

  // Productos de almacén/market comunes
  const marketKeywords = [
    'fideos', 'arroz', 'aceite', 'azucar', 'harina', 'yerba', 'atun', 
    'pure de tomate', 'arveja', 'mayonesa', 'lata', 'coca', 'agua mineral', 
    'soda', 'jugo', 'leche', 'yogur', 'queso', 'manteca', 'dulce de leche', 
    'galletita', 'alfajor', 'snack', 'detergente', 'lavandina', 'jabon', 'papel'
  ];
  if (marketKeywords.some(k => n.includes(k))) return 'market';

  return 'verduras';
}

function determinarSubcategoriaMarket(p) {
  // Leer subcategoría real del Google Sheet / Apps Script / Dashboard
  const sub = (p.subcategoria || p.subCategory || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (sub.includes('bebida')) return 'Bebidas';
  if (sub.includes('enlatado') || sub.includes('conserva')) return 'Enlatados';
  if (sub.includes('lacteo')) return 'Lácteos';
  if (sub.includes('otro')) return 'Otros';
  if (sub.includes('almacen')) return 'Almacén';

  // Huevo y miel siempre en subcategoría Otros
  const n = (p.nombre || '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (n.includes('miel') || n.includes('huevo') || n.includes('maple')) return 'Otros';

  // Asignación por tipo de producto si la subcategoría viniese vacía
  if (n.includes('lata') || n.includes('atun') || n.includes('arveja')) return 'Enlatados';
  if (n.includes('coca') || n.includes('agua') || n.includes('soda') || n.includes('jugo')) return 'Bebidas';
  if (n.includes('leche') || n.includes('yogur') || n.includes('queso') || n.includes('manteca') || n.includes('dulce de leche')) return 'Lácteos';

  return 'Almacén';
}

function actualizarProductos(productosData) {
  // Resetear las tres categorías: verduras, frutas y market
  PRODUCTS.individual = { 'verduras': [], 'frutas': [], 'market': [] };

  productosData.forEach((p, i) => {
    if (p.activo === false) return;
    const categoria = determinarCategoria(p);
    const subcategoria = (categoria === 'market') ? determinarSubcategoriaMarket(p) : '';

    // Detectar unidad dinámica v4.1
    let unit = p.unit || p.unidad || 'kg';
    let step = (unit === 'kg') ? 0.5 : 1;
    let min = (unit === 'kg') ? 0.5 : 1;

    const nombreCrudo = p.nombre.toLowerCase();
    const nombreCapitalizado = nombreCrudo.charAt(0).toUpperCase() + nombreCrudo.slice(1);
    
    PRODUCTS.individual[categoria].push({
      id: normalizarIdProducto(p.nombre),
      name: nombreCapitalizado,
      price: p.precio,
      unit, step, min,
      categoria,
      subcategoria
    });
  });

  console.log('[PRODUCTOS] Clasificados:', {
    verduras: PRODUCTS.individual.verduras.length,
    frutas: PRODUCTS.individual.frutas.length,
    market: PRODUCTS.individual.market.length
  });

  // Ocultar pestaña Market si no hay productos
  const tabMarket = document.getElementById('tab-market') || document.getElementById('tab-extras');
  if (tabMarket) {
    if (PRODUCTS.individual.market.length === 0) {
      tabMarket.style.display = 'none';
      if (activeCategory === 'market' || activeCategory === 'extras') switchCategory('verduras');
    } else {
      tabMarket.style.display = 'inline-block';
    }
  }

  // Refrescar lista de productos en pantalla
  renderCustomProducts();
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
    // Sincronizar feriados, hora de servidor y catálogo en paralelo
    await Promise.all([
        sincronizarFeriadosYReloj(),
        cargarPrecios()
    ]);
    actualizarSelectorEntregas();
    loadCustomerData();

    initUI();
    renderCombos();
    renderCustomProducts();
    actualizarTextos();
    updateSummary();

    const deliveryDaySelect = document.getElementById('delivery-day');
    if (deliveryDaySelect) {
        deliveryDaySelect.addEventListener('change', () => {
            sincronizarHorarioEntrega();
            actualizarTextoEntregaAuto(deliveryDaySelect.value);
            saveCustomerData();
        });
    }

    // Actualización periódica cada 5 minutos con la página abierta
    setInterval(() => {
        cargarPrecios();
        actualizarSelectorEntregas();
    }, 5 * 60 * 1000);

    // Actualización cuando la pestaña vuelve a estar visible
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            cargarPrecios();
            actualizarSelectorEntregas();
        }
    });

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

    // Lógica de Crédito Referido v5.7
    const creditConfirmModal = document.getElementById('credit-confirm-modal');
    const creditModalText = document.getElementById('credit-modal-text');
    const btnConfirmCredit = document.getElementById('btn-modal-confirm-credit');
    const btnCancelCredit = document.getElementById('btn-modal-cancel-credit');

    let pendingCreditAmount = 0;

    const formatPesos = (n) => Math.round(n).toLocaleString('es-AR').replace(/[.,]$/, '');

    const finalizeCreditApplication = (amount) => {
      const mensaje = document.getElementById('credit-mensaje');
      creditoAplicado = amount;
      credito_usado = amount;
      mensaje.textContent = `✅ Créditos aplicados: $${formatPesos(creditoAplicado)}`;
      mensaje.className = 'cupon-mensaje exito';
      document.getElementById('btn-aplicar-credito').innerText = 'Remover';
      
      updateSummary();
      updateCreditUI();
      if (creditConfirmModal) creditConfirmModal.style.display = 'none';
    };

    btnConfirmCredit?.addEventListener('click', () => {
        finalizeCreditApplication(pendingCreditAmount);
    });

    btnCancelCredit?.addEventListener('click', () => {
        if (creditConfirmModal) creditConfirmModal.style.display = 'none';
    });

    document.getElementById('btn-aplicar-credito')?.addEventListener('click', () => {
      const mensaje = document.getElementById('credit-mensaje');
      if (!window.userCredits || window.userCredits <= 0) {
        mensaje.textContent = 'No tenés créditos disponibles';
        mensaje.className = 'cupon-mensaje error';
        return;
      }

      if (creditoAplicado > 0) {
        creditoAplicado = 0;
        credito_usado = 0;
        mensaje.textContent = 'Créditos removidos';
        mensaje.className = 'cupon-mensaje';
        document.getElementById('btn-aplicar-credito').innerText = 'Aplicar';
        updateSummary();
        updateCreditUI();
        return;
      }

      // Calcular 90% del total actual (después de cupones)
      const subtotalBase = Object.values(cart).reduce((acc, item) => acc + (item.price * item.qty), 0);
      let descuentoCupon = 0;
      if (cuponAplicado && cuponAplicado.tipo === 'porcentaje') {
          descuentoCupon = Math.floor(subtotalBase * cuponAplicado.valor / 100);
      }
      const totalCarrito = Math.round(subtotalBase - descuentoCupon);
      const threshold = Math.floor(totalCarrito * 0.9); // Redondeo v6.0 (a favor del cliente)

      if (window.userCredits <= threshold) {
        // El crédito es menor o igual al 90% del total -> se aplica todo
        finalizeCreditApplication(window.userCredits);
      } else {
        // El crédito supera el 90% -> mostrar popup de confirmación personalizado
        const aplicar90 = threshold;
        const aPagar = Math.ceil(totalCarrito - aplicar90);
        const restante = Math.ceil(window.userCredits - aplicar90);
        
        pendingCreditAmount = aplicar90;
        if (creditModalText) {
            creditModalText.innerHTML = `Tu crédito cubre más del 90% de tu compra<br><br>Se aplicarán <strong>$${formatPesos(aplicar90)}</strong> de crédito<br>Pagarás <strong>$${formatPesos(aPagar)}</strong><br>Te quedarán <strong>$${formatPesos(restante)}</strong> de crédito`;
        }
        if (creditConfirmModal) creditConfirmModal.style.display = 'flex';
      }
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
            if (data.deliveryDay) {
                const deliverySelect = document.getElementById('delivery-day');
                if (deliverySelect) {
                    const existe = Array.from(deliverySelect.options).some(o => o.value === data.deliveryDay);
                    if (existe) {
                        deliverySelect.value = data.deliveryDay;
                        sincronizarHorarioEntrega();
                        actualizarTextoEntregaAuto(data.deliveryDay);
                    }
                }
            }

            // Validar si el botón debe habilitarse si ya hay datos y carrito
            updateSummary();
        }
    } catch (e) {
        console.warn('No se pudieron cargar los datos del cliente (posible modo incógnito):', e);
    }
}

function saveCustomerData() {
    try {
        const deliveryDayEl = document.getElementById('delivery-day');
        const deliveryTimeEl = document.getElementById('delivery-time');
        const data = {
            fullname: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            deliveryDay: deliveryDayEl ? deliveryDayEl.value : '',
            deliveryTime: deliveryTimeEl ? deliveryTimeEl.value : ''
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

    // Toggle selector manual de entrega
    const btnCambiarEntrega = document.getElementById('btn-cambiar-entrega');
    const manualSelector = document.getElementById('delivery-manual-container');
    if (btnCambiarEntrega && manualSelector) {
        btnCambiarEntrega.addEventListener('click', () => {
            const isHidden = manualSelector.style.display === 'none';
            manualSelector.style.display = isHidden ? 'block' : 'none';
            btnCambiarEntrega.innerHTML = isHidden 
                ? '<ion-icon name="close-circle-outline"></ion-icon> Ocultar selector' 
                : '<ion-icon name="calendar-number-outline"></ion-icon> Programar otro día';
            if (isHidden) {
                const deliverySelect = document.getElementById('delivery-day');
                if (deliverySelect) deliverySelect.focus();
            }
        });
    }
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
    if (cat === 'extras') cat = 'market';
    activeCategory = cat;
    // Update tabs UI
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const onClick = btn.getAttribute('onclick') || '';
        btn.classList.toggle('active', onClick.includes(cat) || (cat === 'market' && onClick.includes('extras')));
    });

    // Controlar visibilidad del selector de subcategorías de Market
    const marketSubtabs = document.getElementById('market-subtabs');
    if (marketSubtabs) {
        marketSubtabs.style.display = (cat === 'market') ? 'flex' : 'none';
    }

    // Al entrar a Market, mostrar 'Todos' por defecto
    if (cat === 'market') {
        activeMarketSubcategory = 'Todos';
        document.querySelectorAll('.subtab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-subcat') === 'Todos');
        });
    }

    renderCustomProducts();
}

function switchMarketSubcategory(subcat) {
    activeMarketSubcategory = subcat;
    document.querySelectorAll('.subtab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-subcat') === subcat);
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
                            <span class="qty-val" id="qty-combo-${combo.id}">${cart[combo.id]?.qty || 0}</span>
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
    let prods = PRODUCTS.individual[activeCategory];

    // Verificación defensiva: la categoría puede estar vacía si el fetch aún no terminó
    if (!prods || prods.length === 0) {
        if (activeCategory === 'market') {
            container.innerHTML = '<p class="empty-msg" style="padding:30px 20px;text-align:center;grid-column: 1 / -1;">No hay productos de Market disponibles en este momento.</p>';
        } else {
            container.innerHTML = '<p class="empty-msg" style="padding:20px;text-align:center;grid-column: 1 / -1;">Cargando productos...</p>';
        }
        return;
    }

    // Filtrar subcategoría dentro de Market si aplica
    if (activeCategory === 'market') {
        if (activeMarketSubcategory && activeMarketSubcategory !== 'Todos') {
            prods = prods.filter(p => (p.subcategoria || 'Almacén') === activeMarketSubcategory);
        }
        if (prods.length === 0) {
            container.innerHTML = `<p class="empty-msg" style="padding:30px 20px;text-align:center;grid-column: 1 / -1;">No hay productos disponibles en <strong>${activeMarketSubcategory}</strong> por el momento.</p>`;
            return;
        }
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
    if (category === 'extras') category = 'market';
    const prod = PRODUCTS.individual[category]?.find(p => p.id === id);
    if (!prod) return;
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
        actualDescuentoCredito = Math.floor(Math.min(subtotalPostCupon, creditoAplicado));
        itemsHtml += `
            <div class="summary-item discount-item" style="color: #22c55e; font-weight: 600;">
                <span>Créditos aplicados</span>
                <span>-$${actualDescuentoCredito.toLocaleString('es-AR')}</span>
            </div>
        `;
    }

    summaryItems.innerHTML = itemsHtml;

    const totalFinal = Math.ceil(subtotalPostCupon - actualDescuentoCredito);
    summaryTotal.innerText = `$${totalFinal.toLocaleString('es-AR')}`;
    headerTotal.innerText = `$${totalFinal.toLocaleString('es-AR')}`;

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
        
        // Habilitar botón de envío SOLO si los precios se cargaron exitosamente
        if (preciosCargadosOk) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-disabled');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-disabled');
        }
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
    
    // Bloqueo estricto si la tienda está en modo Próximamente
    if (document.documentElement.classList.contains('preview-locked') || localStorage.getItem('huerta_preview_unlocked_v2') !== 'true') {
        alert('La tienda está en modo Próximamente. No se pueden realizar pedidos por el momento.');
        return;
    }

    // Bloqueo estricto si los precios no están cargados correctamente
    if (!preciosCargadosOk) {
        deshabilitarBotonFinalizar();
        alert("No pudimos cargar los precios actualizados. Reintenta en unos minutos");
        return;
    }

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

    // Volver a ejecutar cargarPrecios justo antes de enviar el pedido
    // Si hubo cambios de precio o catálogo, no enviarlo y mostrar aviso para revisar el total
    const resPrecios = await cargarPrecios(true);
    if (!preciosCargadosOk) {
        deshabilitarBotonFinalizar();
        submitBtn.innerText = originalBtnText;
        alert("No pudimos cargar los precios actualizados. Reintenta en unos minutos");
        return;
    }
    if (resPrecios && resPrecios.huboCambios) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        alert("Actualizamos los precios de tu carrito. Por favor, revisá el nuevo total antes de enviar el pedido.");
        return;
    }

    // Revalidación de entrega en base a la hora actual del servidor
    const ahoraReval = obtenerAhoraServidor();
    const diaSeleccionado = document.querySelector('[name="dia_entrega"]').value;
    const entregaParseada = (typeof parseDiaEntrega === 'function' ? parseDiaEntrega(diaSeleccionado) : null);
    const horizonte = (typeof HORIZONTE_DIAS !== 'undefined' ? HORIZONTE_DIAS : 14);

    const esValida = entregaParseada && (typeof validarEntrega === 'function'
        ? validarEntrega(entregaParseada.ymd, entregaParseada.bloque, ahoraReval, feriadosCerrados, horizonte)
        : true);

    if (!esValida) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        actualizarSelectorEntregas();
        alert("Paso el horario de corte: elegi una nueva entrega");
        const selectEntrega = document.getElementById('delivery-day');
        if (selectEntrega) {
            selectEntrega.focus();
            selectEntrega.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    sincronizarHorarioEntrega();
    const horarioSeleccionado = document.querySelector('[name="horario_entrega"]')?.value || '';

    // 5. Construcción del objeto JSON PLANO (16 campos para Google Sheets)
    // Generar datos adicionales y sincronizar campos ocultos en el DOM
    const numeroPedido = 'HU-' + Date.now().toString().slice(-6);
    const fechaActual = new Date().toLocaleString('es-AR');

    document.querySelector('[name="numero_pedido"]').value = numeroPedido;
    document.querySelector('[name="fecha"]').value = fechaActual;
    document.querySelector('[name="fecha_entrega"]').value = diaSeleccionado + (horarioSeleccionado ? " (" + horarioSeleccionado + ")" : "");
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
        "credito_usado": credito_usado, // v5.6
        "codigo_referido_usado": codigo_referido_usado, // campo V: solo códigos HU-XXXX
        "descuento": cuponDescuentoMonto,
        "acepto_tc_publicidad": 'SI', // columna AA - siempre SI al confirmar pedido
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
            const textResponse = await response.text();
            console.log("Respuesta de Make:", textResponse);
            
            let data = {};
            try {
                data = JSON.parse(textResponse);
            } catch (e) {
                console.warn("Respuesta de webhook no es JSON válido. Intentando parsear como texto.");
                if (textResponse.trim().startsWith('http')) {
                    data = { url: textResponse.trim() };
                }
            }

            // Redirección Automática (Mercado Pago)
            if (metodoPago === 'mercadopago') {
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    console.error("Error: URL de pago no encontrada en la respuesta");
                    alert("Hubo un error al generar el link de pago. Por favor intentá de nuevo o contactanos por WhatsApp al 11 6177-1376");
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
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

// Sincronizar UI de créditos v6.1
function updateCreditUI() {
    const remaining = (window.userCredits || 0) - (credito_usado || 0);
    const fmtCredits = '$' + Math.round(remaining).toLocaleString('es-AR').replace(/[.,]$/, ''); 
    
    const headerCredits = document.getElementById('credito-referidos');
    const formCredits = document.getElementById('available-credit');

    if (headerCredits) {
        headerCredits.innerText = `${fmtCredits} créditos de referidos`;
    }
    if (formCredits) {
        formCredits.innerText = fmtCredits;
    }
}

// Función global expuesta para auth.js al cerrar sesión
window.resetCreditoCarrito = function() {
    creditoAplicado = 0;
    credito_usado = 0;
    const creditBtn = document.getElementById('btn-aplicar-credito');
    if (creditBtn) {
        creditBtn.innerText = 'Aplicar';
    }
    if (typeof updateSummary === 'function') {
        updateSummary();
    }
};
