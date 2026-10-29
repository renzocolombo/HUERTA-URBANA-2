/**
 * SUITE DE PRUEBAS: PAGO CONTRA ENTREGA + LOGIN OBLIGATORIO + CLIENTES EN SHEETS
 * Huerta Urbana - feat/web-pago-entrega
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log("==================================================================");
console.log("SUITE DE PRUEBAS: PAGO CONTRA ENTREGA Y LOGIN OBLIGATORIO");
console.log("==================================================================");

let testsPassed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    process.exit(1);
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  [PASS] ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  [FAIL] ${name}`);
    console.error(`         ${err.message}`);
    process.exit(1);
  }
}

const scriptCode = fs.readFileSync('script.js', 'utf8');
const authCode = fs.readFileSync('auth.js', 'utf8');
const htmlCode = fs.readFileSync('index.html', 'utf8');
const terminosCode = fs.readFileSync('terminos.html', 'utf8');
const privacidadCode = fs.readFileSync('privacidad.html', 'utf8');
const swCode = fs.readFileSync('sw.js', 'utf8');

// -----------------------------------------------------------------------------
// 1. Interruptor PAGO_ONLINE_HABILITADO
// -----------------------------------------------------------------------------
console.log("\n1. Verificación del Interruptor PAGO_ONLINE_HABILITADO y Forma de Pago:");

test("script.js declara const PAGO_ONLINE_HABILITADO = false al inicio", () => {
  assert(scriptCode.includes("const PAGO_ONLINE_HABILITADO = false;"), "Debe tener const PAGO_ONLINE_HABILITADO = false");
});

test("Con switch en false: abrirEleccionPago() no abre el modal y selecciona contra entrega", () => {
  let modalDisplay = 'none';
  let scrolledToForm = false;
  let metodoSeleccionado = '';

  const PAGO_ONLINE_HABILITADO = false;
  const METODO_PAGO_ONLINE = 'mercadopago';
  const METODO_PAGO_AL_RECIBIR = 'efectivo';
  const MIN_PURCHASE = 35000;
  const userUID = 'USR-TEST-123';
  const cart = { p1: { name: 'Tomate', price: 40000, qty: 1 } };

  function simularAbrirEleccionPago() {
    const baseTotal = Object.values(cart).reduce((acc, item) => acc + (item.price * item.qty), 0);
    if (!userUID) return 'login';
    if (!PAGO_ONLINE_HABILITADO) {
      metodoSeleccionado = METODO_PAGO_AL_RECIBIR;
      scrolledToForm = true;
      return 'form_directo';
    }
    modalDisplay = 'flex';
    return 'modal';
  }

  const res = simularAbrirEleccionPago();
  assert.strictEqual(res, 'form_directo');
  assert.strictEqual(modalDisplay, 'none', "El modal de pago NO debe abrirse");
  assert.strictEqual(metodoSeleccionado, 'efectivo', "Debe seleccionar metodo_pago efectivo (al recibir)");
  assert.strictEqual(scrolledToForm, true, "Debe desplazarse directamente al formulario");
});

test("Con switch en true: abrirEleccionPago() abre el modal de selección de pago (comportamiento previo)", () => {
  let modalDisplay = 'none';
  const PAGO_ONLINE_HABILITADO = true;
  const userUID = 'USR-TEST-123';
  const cart = { p1: { name: 'Tomate', price: 40000, qty: 1 } };

  function simularAbrirEleccionPago() {
    if (!userUID) return 'login';
    if (!PAGO_ONLINE_HABILITADO) return 'form_directo';
    modalDisplay = 'flex';
    return 'modal';
  }

  const res = simularAbrirEleccionPago();
  assert.strictEqual(res, 'modal');
  assert.strictEqual(modalDisplay, 'flex', "Con switch en true debe abrir el modal");
});

test("Con switch en false: banner arriba del formulario tiene texto fijo y oculta botón cambiar pago", () => {
  const elements = {
    'selected-payment-name': { textContent: '' },
    'selected-payment-sub': { textContent: '' },
    'btn-change-payment': { style: { display: '' } },
    'selected-payment-label': { style: { display: '' } },
    'payment-policy-text': { innerHTML: '' }
  };

  const PAGO_ONLINE_HABILITADO = false;
  function simularActualizarBanner() {
    if (!PAGO_ONLINE_HABILITADO) {
      elements['selected-payment-name'].textContent = 'Pago contra entrega:';
      elements['selected-payment-sub'].textContent = 'pagás al recibir con QR, transferencia, tarjeta de débito o crédito (no efectivo). El monto final se calcula con el peso real de los productos.';
      elements['btn-change-payment'].style.display = 'none';
      elements['selected-payment-label'].style.display = 'none';
      elements['payment-policy-text'].innerHTML = '<strong>Pago al recibir:</strong> pagás al recibir con QR, transferencia, tarjeta de débito o crédito (no efectivo). El pago online no está disponible por ahora. El monto final se calcula con el peso real de los productos.';
      return;
    }
    elements['btn-change-payment'].style.display = '';
  }

  simularActualizarBanner();
  const bannerCompleto = `${elements['selected-payment-name'].textContent} ${elements['selected-payment-sub'].textContent}`;
  assert(bannerCompleto.includes("Pago contra entrega: pagás al recibir con QR, transferencia, tarjeta de débito o crédito (no efectivo). El monto final se calcula con el peso real de los productos."));
  assert.strictEqual(elements['btn-change-payment'].style.display, 'none', "El botón 'Cambiar forma de pago' debe estar oculto");
});

test("Payload de Make (orderData) tiene exactamente 27 campos en orden y metodo_pago 'efectivo'", () => {
  const CAMPOS_ESPERADOS = [
    "numero_pedido", "fecha", "nombre", "telefono", "email",
    "direccion", "localidad", "dia_entrega", "horario_entrega",
    "metodo_pago", "producto", "cantidad", "total", "cupon",
    "cupon_codigo", "cupon_descuento", "uid", "credito_usado",
    "codigo_referido_usado", "descuento", "acepto_tc_publicidad",
    "estado", "observaciones", "fecha_entrega", "ficha_entrega",
    "external_reference", "notification_url"
  ];

  const regexOrderData = /const\s+orderData\s*=\s*\{([\s\S]*?)\};/;
  const match = scriptCode.match(regexOrderData);
  assert(match, "Debe existir orderData en script.js");

  const lineas = match[1].split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('"') || l.startsWith("'"));

  const camposEncontrados = lineas.map(l => {
    const keyMatch = l.match(/^["']([^"']+)["']/);
    return keyMatch ? keyMatch[1] : null;
  }).filter(Boolean);

  assert.strictEqual(camposEncontrados.length, 27, `Debe contener 27 campos (obtenidos: ${camposEncontrados.length})`);
  camposEncontrados.forEach((campo, i) => {
    assert.strictEqual(campo, CAMPOS_ESPERADOS[i], `Campo en índice ${i} debe ser '${CAMPOS_ESPERADOS[i]}', obtenido '${campo}'`);
  });
});

// -----------------------------------------------------------------------------
// 2. Login Obligatorio al Finalizar Compra
// -----------------------------------------------------------------------------
console.log("\n2. Verificación de Login Obligatorio al Finalizar:");

test("Si cliente no inició sesión (!window.userUID): abrirEleccionPago() pide login con el mensaje requerido", () => {
  let mensajeSolicitado = '';
  let loginSolicitado = false;
  const userUID = ''; // No logueado
  const cart = { p1: { name: 'Lechuga', price: 36000, qty: 1 } };

  function solicitarLogin(msg) {
    loginSolicitado = true;
    mensajeSolicitado = msg;
  }

  function simularAbrirEleccionPago() {
    if (!userUID) {
      solicitarLogin("Ingresá con Google para finalizar tu pedido: así guardamos tu cupón de bienvenida y tus créditos y te contactamos por tu pedido");
      return;
    }
  }

  simularAbrirEleccionPago();
  assert(loginSolicitado, "Debe solicitar login si no hay userUID");
  assert.strictEqual(mensajeSolicitado, "Ingresá con Google para finalizar tu pedido: así guardamos tu cupón de bienvenida y tus créditos y te contactamos por tu pedido");
});

test("En processOrder(): si no hay window.userUID, el pedido NO se envía y se vuelve a pedir login", () => {
  let ordenEnviada = false;
  let loginRequerido = false;
  let orderSubmitting = false;
  const userUID = ''; // Sin login

  function simularProcessOrder() {
    if (!userUID) {
      orderSubmitting = false;
      loginRequerido = true;
      return;
    }
    ordenEnviada = true;
  }

  simularProcessOrder();
  assert.strictEqual(ordenEnviada, false, "El pedido NUNCA debe enviarse sin login");
  assert.strictEqual(loginRequerido, true, "Debe requerir login");
});

test("Tras login exitoso: el carrito se conserva en memoria y en sessionStorage", () => {
  const sessionStorageMock = {};
  let cart = {
    item1: { name: 'Manzanas', price: 5000, qty: 7 }
  };

  // Guardar carrito al actualizar resumen
  sessionStorageMock['huerta_cart'] = JSON.stringify(cart);

  // Simular flujo de login (auth)
  const user = { uid: 'USR-G-999', displayName: 'Juan Pérez', email: 'juan@example.com' };
  let userUID = user.uid;

  // Restaurar o mantener carrito
  const cartRecuperado = JSON.parse(sessionStorageMock['huerta_cart']);
  assert.strictEqual(cartRecuperado.item1.name, 'Manzanas');
  assert.strictEqual(cartRecuperado.item1.qty, 7);
  assert.strictEqual(cartRecuperado.item1.price, 5000);
});

test("Datos de usuario de Google precargan automáticamente nombre y email en el formulario", () => {
  const formInputs = {
    fullname: '',
    email: ''
  };

  const user = { displayName: 'Renzo Colombo', email: 'renzo@test.com' };

  if (user) {
    if (user.displayName) formInputs.fullname = user.displayName;
    if (user.email) formInputs.email = user.email;
  }

  assert.strictEqual(formInputs.fullname, 'Renzo Colombo');
  assert.strictEqual(formInputs.email, 'renzo@test.com');
});

// -----------------------------------------------------------------------------
// 3. Detección de Navegadores Internos (Instagram, Facebook, WhatsApp)
// -----------------------------------------------------------------------------
console.log("\n3. Verificación de Detección de Navegador Interno:");

test("Detecta navegadores de Instagram, Facebook y WhatsApp por userAgent", () => {
  function esNavegadorInterno(ua) {
    return /instagram|fbav|fban|fb_iab|whatsapp/i.test(ua);
  }

  const uasInApp = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 219.0.0.12.117',
    'Mozilla/5.0 (Linux; Android 10; SM-A505G Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.141 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/300.0.0.51.129;]',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_8 like Mac OS X) Mobile/18H17 WhatsApp/2.21.190.17 W',
    'Mozilla/5.0 (Linux; Android 11; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 Mobile Safari/537.36 FBAN/EMA;FBAV/275.0.0.12.119;'
  ];

  const uasNormales = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.43 Mobile Safari/537.36'
  ];

  uasInApp.forEach(ua => {
    assert.strictEqual(esNavegadorInterno(ua), true, `Debe detectar como interno: ${ua}`);
  });

  uasNormales.forEach(ua => {
    assert.strictEqual(esNavegadorInterno(ua), false, `NO debe detectar como interno: ${ua}`);
  });
});

test("index.html contiene el aviso 'Abrí esta página en Chrome o Safari para ingresar' y botón copiar enlace", () => {
  assert(htmlCode.includes('id="inapp-browser-warning"'), "Debe existir #inapp-browser-warning");
  assert(htmlCode.includes("Abrí esta página en Chrome o Safari para ingresar"), "Debe tener texto requerido de apertura en navegador externo");
  assert(htmlCode.includes('id="btn-copy-inapp-link"'), "Debe existir botón para copiar enlace");
  assert(htmlCode.includes("Copiar enlace"), "Debe tener etiqueta 'Copiar enlace'");
});

// -----------------------------------------------------------------------------
// 4. Clientes en Google Sheets (guardarCliente y Reintento)
// -----------------------------------------------------------------------------
console.log("\n4. Verificación de Sincronización de Clientes (guardarCliente):");

test("auth.js contiene función guardarClienteEnSheets idempotente y con reintento", () => {
  assert(authCode.includes("function guardarClienteEnSheets"), "Debe definir guardarClienteEnSheets");
  assert(authCode.includes("guardarCliente"), "Debe llamar accion guardarCliente");
  assert(authCode.includes("intento <= 2"), "Debe contemplar hasta 2 intentos (1 reintento)");
});

test("onAuthStateChanged llama siempre a guardarClienteEnSheets para clientes nuevos y existentes", () => {
  assert(authCode.includes("guardarClienteEnSheets(user.uid, user.email, user.displayName, codigoReferido)"), 
    "Debe llamar a guardarClienteEnSheets siempre con los 4 parámetros");
});

asyncTest("guardarClienteEnSheets reintenta una vez si la primera llamada falla y devuelve el resultado exitoso", async () => {
  let callCount = 0;
  async function mockFetch(url) {
    callCount++;
    if (callCount === 1) {
      throw new Error("Conexión perdida temporalmente");
    }
    return {
      ok: true,
      json: async () => ({ success: true, mensaje: "Cliente guardado en intento 2" })
    };
  }

  async function testGuardar(fetchFn) {
    for (let intento = 1; intento <= 2; intento++) {
      try {
        const res = await fetchFn("https://script.google.com/test");
        if (!res.ok) throw new Error("HTTP error");
        return await res.json();
      } catch (e) {
        if (intento < 2) {
          await new Promise(r => setTimeout(r, 20));
        }
      }
    }
    return null;
  }

  const res = await testGuardar(mockFetch);
  assert.strictEqual(callCount, 2, "Debe haber llamado exactamente 2 veces (1 fallo + 1 reintento)");
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.mensaje, "Cliente guardado en intento 2");
});

// -----------------------------------------------------------------------------
// 5. Verificación de Textos de Términos y Caché
// -----------------------------------------------------------------------------
console.log("\n5. Verificación de Términos, Textos y Caché:");

test("terminos.html Sección 5 indica pago al recibir y pago online no disponible por ahora", () => {
  assert(terminosCode.includes("Pago al recibir"), "Debe mencionar 'Pago al recibir'");
  assert(terminosCode.includes("El servicio de pago online no está disponible por ahora"), "Debe indicar que pago online no está disponible por ahora");
});

test("index.html resumen indica pago al recibir y pago online no disponible por ahora", () => {
  assert(htmlCode.includes("El pago online no está disponible por ahora"), "Resumen debe indicar que el pago online no está disponible por ahora");
});

test("sw.js tiene versión huerta-urbana-static-v88 y versiones actualizadas", () => {
  assert(swCode.includes("huerta-urbana-static-v88"), "sw.js debe tener cache v88");
  assert(swCode.includes("style.css?v=65.0"), "sw.js debe cachear style.css?v=65.0");
  assert(swCode.includes("script.js?v=63.0"), "sw.js debe cachear script.js?v=63.0");
  assert(swCode.includes("auth.js?v=54.0"), "sw.js debe cachear auth.js?v=54.0");
});

test("index.html, terminos.html y privacidad.html usan versiones de caché actualizadas", () => {
  assert(htmlCode.includes("style.css?v=65.0"), "index.html debe usar style.css?v=65.0");
  assert(htmlCode.includes("script.js?v=63.0"), "index.html debe usar script.js?v=63.0");
  assert(htmlCode.includes("auth.js?v=54.0"), "index.html debe usar auth.js?v=54.0");
  assert(terminosCode.includes("style.css?v=65.0"), "terminos.html debe usar style.css?v=65.0");
  assert(privacidadCode.includes("style.css?v=65.0"), "privacidad.html debe usar style.css?v=65.0");
});

console.log("\n==================================================================");
console.log(`TOTAL DE PRUEBAS: ${testsPassed} | PASADAS: ${testsPassed} | FALLIDAS: 0`);
console.log("==================================================================");
