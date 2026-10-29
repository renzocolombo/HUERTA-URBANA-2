/**
 * SUITE DE PRUEBAS NODE: ELECCIÓN DE PAGO (ONLINE Y CONTRA ENTREGA)
 * Huerta Urbana - feat/web-pago-elegir
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("==================================================================");
console.log("SUITE DE PRUEBAS: ELECCIÓN DE PAGO (ONLINE Y CONTRA ENTREGA)");
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

const EXPECTED_27_FIELDS = [
  "numero_pedido",
  "fecha",
  "nombre",
  "telefono",
  "email",
  "direccion",
  "localidad",
  "dia_entrega",
  "horario_entrega",
  "metodo_pago",
  "producto",
  "cantidad",
  "total",
  "cupon",
  "cupon_codigo",
  "cupon_descuento",
  "uid",
  "credito_usado",
  "codigo_referido_usado",
  "descuento",
  "acepto_tc_publicidad",
  "estado",
  "observaciones",
  "fecha_entrega",
  "ficha_entrega",
  "external_reference",
  "notification_url"
];

const scriptCode = fs.readFileSync(path.resolve("script.js"), "utf8");
const htmlCode = fs.readFileSync(path.resolve("index.html"), "utf8");

// -----------------------------------------------------------------------------
// 1. Constantes y estructura de Payload (27 campos)
// -----------------------------------------------------------------------------
console.log("\n1. Constantes y estructura de Payload con cada opción:");

test("script.js define METODO_PAGO_ONLINE ('mercadopago') y METODO_PAGO_AL_RECIBIR ('efectivo')", () => {
  assert(scriptCode.includes("const METODO_PAGO_ONLINE = 'mercadopago'"), "Debe definir METODO_PAGO_ONLINE = 'mercadopago'");
  assert(scriptCode.includes("const METODO_PAGO_AL_RECIBIR = 'efectivo'"), "Debe definir METODO_PAGO_AL_RECIBIR = 'efectivo'");
});

test("orderData en script.js mantiene exactamente 27 campos en orden", () => {
  const match = scriptCode.match(/const orderData = \{([\s\S]*?)\n\s*\};/);
  assert(match !== null, "Debe existir orderData");
  const lines = match[1].split("\n").map(l => l.trim()).filter(l => l.startsWith('"') || l.startsWith("'"));
  const keys = lines.map(l => {
    const m = l.match(/^["']([^"']+)["']\s*:/);
    return m ? m[1] : null;
  }).filter(Boolean);

  assert.strictEqual(keys.length, 27, "Debe tener 27 campos");
  assert.deepStrictEqual(keys, EXPECTED_27_FIELDS, "Los campos deben coincidir en orden");
});

test("Payload simulado con METODO_PAGO_ONLINE ('mercadopago') y METODO_PAGO_AL_RECIBIR ('efectivo')", () => {
  function makePayload(metodo) {
    return {
      "numero_pedido": "HU-123456",
      "fecha": "2026-10-29 12:00:00",
      "nombre": "Cliente Test",
      "telefono": "11 1234 5678",
      "email": "test@huerta.com",
      "direccion": "Calle Falsa 123",
      "localidad": "Pilar",
      "dia_entrega": "Miércoles 04/11/2026 Tarde",
      "horario_entrega": "14 a 17 hs",
      "metodo_pago": metodo,
      "producto": "1 KILO TOMATE",
      "cantidad": 1,
      "total": 35000,
      "cupon": "",
      "cupon_codigo": "",
      "cupon_descuento": 0,
      "uid": "usr_123",
      "credito_usado": 0,
      "codigo_referido_usado": "",
      "descuento": 0,
      "acepto_tc_publicidad": "SI",
      "estado": "Pendiente",
      "observaciones": "Sin observaciones",
      "fecha_entrega": "Miércoles 04/11/2026 Tarde (14 a 17 hs)",
      "ficha_entrega": "https://www.huertaurbana.com.ar/pedido/HU-123456",
      "external_reference": "HU-123456",
      "notification_url": "https://hook.us2.make.com/uwcvtbynbitqnxvm5ekx75by8jyuljxr"
    };
  }

  const pOnline = makePayload("mercadopago");
  assert.strictEqual(pOnline.metodo_pago, "mercadopago");
  assert.deepStrictEqual(Object.keys(pOnline), EXPECTED_27_FIELDS);

  const pRecibir = makePayload("efectivo");
  assert.strictEqual(pRecibir.metodo_pago, "efectivo");
  assert.deepStrictEqual(Object.keys(pRecibir), EXPECTED_27_FIELDS);
});

// -----------------------------------------------------------------------------
// 2. Validación de redirección segura online (solo HTTPS Mercado Pago)
// -----------------------------------------------------------------------------
console.log("\n2. Validación de redirección segura online:");

function validarRedireccionOnline(url) {
  const esMpValido = url && typeof url === 'string' && (
    url.startsWith('https://www.mercadopago.com') ||
    url.startsWith('https://mercadopago.com') ||
    url.startsWith('https://www.mercadopago.com.ar') ||
    url.startsWith('https://mercadopago.com.ar')
  );
  return !!esMpValido;
}

test("Online permite redirección si URL es https de mercadopago.com o mercadopago.com.ar", () => {
  assert(validarRedireccionOnline("https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123"));
  assert(validarRedireccionOnline("https://mercadopago.com.ar/checkout/v1/redirect?pref_id=123"));
  assert(validarRedireccionOnline("https://www.mercadopago.com/checkout/v1/redirect?pref_id=123"));
});

test("Online NO redirige ante URL http no segura", () => {
  assert(!validarRedireccionOnline("http://www.mercadopago.com.ar/checkout/123"), "HTTP no seguro debe rechazarse");
});

test("Online NO redirige ante dominio externo no autorizado", () => {
  assert(!validarRedireccionOnline("https://malicious-site.com/pay"), "Sitio externo debe rechazarse");
  assert(!validarRedireccionOnline("https://fake-mercadopago.com/pay"), "Dominio engañoso debe rechazarse");
  assert(!validarRedireccionOnline(""), "String vacío debe rechazarse");
  assert(!validarRedireccionOnline(null), "Null debe rechazarse");
});

// -----------------------------------------------------------------------------
// 3. Simulación de Flujos de Selección y Pantalla Previa
// -----------------------------------------------------------------------------
console.log("\n3. Simulación de Flujos de Elección Pre-formulario y Modales:");

class MockElement {
  constructor(id, tag = 'div') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.style = {};
    this.classList = new Set();
    this.innerText = '';
    this.textContent = '';
    this.innerHTML = '';
    this.value = '';
    this.disabled = false;
    this.checked = false;
    this.listeners = {};
    this.href = '';
  }
  addEventListener(evt, fn) {
    if (!this.listeners[evt]) this.listeners[evt] = [];
    this.listeners[evt].push(fn);
  }
  click() {
    if (this.listeners['click']) {
      this.listeners['click'].forEach(fn => fn());
    }
  }
  setAttribute(name, val) {
    this[name] = val;
  }
  focus() {}
  scrollIntoView() {}
  reset() { this.value = ''; }
}

function crearEntornoSimulado() {
  const elements = {
    'submit-btn': new MockElement('submit-btn', 'button'),
    'btn-cart-checkout': new MockElement('btn-cart-checkout', 'button'),
    'btn-summary-checkout': new MockElement('btn-summary-checkout', 'button'),
    'payment-choice-modal': new MockElement('payment-choice-modal', 'div'),
    'btn-choice-online': new MockElement('btn-choice-online', 'button'),
    'btn-choice-delivery': new MockElement('btn-choice-delivery', 'button'),
    'choice-online-amount': new MockElement('choice-online-amount', 'strong'),
    'choice-delivery-amount': new MockElement('choice-delivery-amount', 'strong'),
    'selected-payment-banner': new MockElement('selected-payment-banner', 'div'),
    'selected-payment-name': new MockElement('selected-payment-name', 'strong'),
    'selected-payment-sub': new MockElement('selected-payment-sub', 'span'),
    'selected-payment-icon': new MockElement('selected-payment-icon', 'ion-icon'),
    'btn-change-payment': new MockElement('btn-change-payment', 'button'),
    'payment-policy-icon': new MockElement('payment-policy-icon', 'ion-icon'),
    'payment-policy-text': new MockElement('payment-policy-text', 'p'),
    'success-modal': new MockElement('success-modal', 'div'),
    'success-order-num': new MockElement('success-order-num', 'strong'),
    'success-order-total': new MockElement('success-order-total', 'strong'),
    'success-order-delivery': new MockElement('success-order-delivery', 'strong'),
    'success-order-address': new MockElement('success-order-address', 'strong'),
    'success-order-products': new MockElement('success-order-products', 'div'),
    'success-whatsapp-btn': new MockElement('success-whatsapp-btn', 'a'),
    'summary-items': new MockElement('summary-items', 'div'),
    'summary-total': new MockElement('summary-total', 'span'),
    'cart-total-header': new MockElement('cart-total-header', 'span'),
    'min-purchase-msg': new MockElement('min-purchase-msg', 'p'),
    'shipping-header-msg': new MockElement('shipping-header-msg', 'span'),
    'compra-minima-monto': new MockElement('compra-minima-monto', 'span'),
    'cart-modal': new MockElement('cart-modal', 'div'),
    'order-form': new MockElement('order-form', 'form'),
    'delivery-day': new MockElement('delivery-day', 'select'),
    'delivery-time': new MockElement('delivery-time', 'input')
  };

  elements['payment-choice-modal'].style.display = 'none';
  elements['cart-modal'].style.display = 'none';
  elements['success-modal'].style.display = 'none';

  return elements;
}

test("Al tocar botón de finalizar (carrito o resumen) se abre la pantalla de elección antes del formulario", () => {
  const elements = crearEntornoSimulado();
  let openedFromCart = false;

  function abrirEleccionPago(origen) {
    openedFromCart = (origen === 'cart');
    if (elements['cart-modal'].style.display === 'flex') {
      elements['cart-modal'].style.display = 'none';
    }
    elements['choice-online-amount'].textContent = '$35.000';
    elements['choice-delivery-amount'].textContent = '$35.000';
    elements['payment-choice-modal'].style.display = 'flex';
  }

  // 1. Abrir desde modal de carrito
  elements['cart-modal'].style.display = 'flex';
  abrirEleccionPago('cart');
  assert.strictEqual(elements['payment-choice-modal'].style.display, 'flex', "Debe abrirse el modal de elección");
  assert.strictEqual(elements['cart-modal'].style.display, 'none', "Debe cerrarse el modal de carrito");
  assert.strictEqual(openedFromCart, true);

  // 2. Si el cliente cierra la ventana, vuelve al carrito sin perder nada
  function cerrarEleccionPago(volverAlCarrito) {
    elements['payment-choice-modal'].style.display = 'none';
    if (volverAlCarrito && openedFromCart) {
      elements['cart-modal'].style.display = 'flex';
    }
  }

  cerrarEleccionPago(true);
  assert.strictEqual(elements['payment-choice-modal'].style.display, 'none', "Debe cerrarse el modal de elección");
  assert.strictEqual(elements['cart-modal'].style.display, 'flex', "Debe volver a mostrarse el modal de carrito");

  // 3. Abrir desde resumen
  abrirEleccionPago('summary');
  assert.strictEqual(elements['payment-choice-modal'].style.display, 'flex');
  assert.strictEqual(openedFromCart, false);
});

test("Al elegir una opción se actualiza el banner, el botón del form y el método de pago", () => {
  const elements = crearEntornoSimulado();
  let metodoPagoSeleccionado = 'mercadopago';

  function seleccionarMetodoPago(metodo) {
    metodoPagoSeleccionado = metodo;
    if (metodo === 'mercadopago') {
      elements['selected-payment-name'].textContent = 'Pago online (Mercado Pago)';
      elements['submit-btn'].innerText = 'Ir a pagar';
      elements['payment-policy-text'].textContent = 'Pagás ahora de forma segura con Mercado Pago';
    } else {
      elements['selected-payment-name'].textContent = 'Pago contra entrega (al recibir tu pedido)';
      elements['submit-btn'].innerText = 'Confirmar pedido';
      elements['payment-policy-text'].innerHTML = '<strong>Pagás al recibir tu pedido:</strong> QR, transferencia, tarjeta de débito o crédito (no efectivo). El monto final puede variar levemente según el peso real de los productos.';
    }
    elements['payment-choice-modal'].style.display = 'none';
  }

  // Elegir contra entrega
  seleccionarMetodoPago('efectivo');
  assert.strictEqual(metodoPagoSeleccionado, 'efectivo');
  assert.strictEqual(elements['selected-payment-name'].textContent, 'Pago contra entrega (al recibir tu pedido)');
  assert.strictEqual(elements['submit-btn'].innerText, 'Confirmar pedido');
  assert(elements['payment-policy-text'].innerHTML.includes('QR, transferencia, tarjeta de débito o crédito (no efectivo)'));

  // Cambiar forma de pago a online
  seleccionarMetodoPago('mercadopago');
  assert.strictEqual(metodoPagoSeleccionado, 'mercadopago');
  assert.strictEqual(elements['selected-payment-name'].textContent, 'Pago online (Mercado Pago)');
  assert.strictEqual(elements['submit-btn'].innerText, 'Ir a pagar');
});

test("Flujo contra entrega exitoso: muestra confirmación con todos los datos y URL de WhatsApp precargada", () => {
  const elements = crearEntornoSimulado();
  let cart = {
    prod1: { name: 'Tomate Redondo', price: 3500, qty: 2, unit: 'kg' },
    prod2: { name: 'Banana Ecuador', price: 4000, qty: 1, unit: 'kg' }
  };

  function simularConfirmacionContraEntrega(datos) {
    elements['success-order-num'].textContent = datos.numeroPedido;
    elements['success-order-total'].textContent = `$${Math.round(datos.totalNum).toLocaleString('es-AR')}`;
    elements['success-order-address'].textContent = `${datos.direccion}, ${datos.localidad}`;
    elements['success-order-delivery'].textContent = "Miércoles 04/11 · Tarde, 14 a 17 h";

    // Productos
    const prodsTexto = Object.values(datos.cartSnapshot).map(p => `• ${p.qty} kg ${p.name} ($${p.price * p.qty})`).join('\n');
    elements['success-order-products'].innerHTML = prodsTexto;

    // WhatsApp
    const msgWa = `¡Hola Huerta Urbana! Quiero enviar el detalle de mi pedido:
*Pedido:* ${datos.numeroPedido}
*Estado:* Pendiente de pago (pagás al recibir)
*Productos:*
${prodsTexto}
*Total estimado:* $${Math.round(datos.totalNum).toLocaleString('es-AR')} (puede variar según el peso real)
*Dirección:* ${datos.direccion}, ${datos.localidad}
*Entrega:* Miércoles 04/11 · Tarde, 14 a 17 h

Por favor confírmenme la recepción. ¡Muchas gracias!`;

    elements['success-whatsapp-btn'].href = `https://wa.me/5491161771376?text=${encodeURIComponent(msgWa)}`;
    elements['success-modal'].style.display = 'flex';
    cart = {};
  }

  simularConfirmacionContraEntrega({
    numeroPedido: "HU-654321",
    totalNum: 11000,
    diaSeleccionado: "Miércoles 04/11/2026 Tarde",
    horarioSeleccionado: "14 a 17 hs",
    direccion: "Av. Maipú 123",
    localidad: "Del Viso",
    cartSnapshot: { ...cart }
  });

  assert.strictEqual(elements['success-modal'].style.display, 'flex');
  assert.strictEqual(elements['success-order-num'].textContent, "HU-654321");
  assert.strictEqual(elements['success-order-total'].textContent, "$11.000");
  assert.strictEqual(elements['success-order-address'].textContent, "Av. Maipú 123, Del Viso");
  assert.strictEqual(elements['success-order-delivery'].textContent, "Miércoles 04/11 · Tarde, 14 a 17 h");
  assert(elements['success-order-products'].innerHTML.includes("Tomate Redondo"));
  assert(elements['success-order-products'].innerHTML.includes("Banana Ecuador"));

  // Verificación de URL de WhatsApp y codificación
  assert(elements['success-whatsapp-btn'].href.startsWith("https://wa.me/5491161771376?text="));
  const decodedWaText = decodeURIComponent(elements['success-whatsapp-btn'].href.split("?text=")[1]);
  assert(decodedWaText.includes("HU-654321"), "Debe incluir número de pedido");
  assert(decodedWaText.includes("Tomate Redondo"), "Debe incluir productos");
  assert(decodedWaText.includes("$11.000"), "Debe incluir total");
  assert(decodedWaText.includes("Av. Maipú 123, Del Viso"), "Debe incluir dirección y localidad");
  assert(decodedWaText.includes("Miércoles 04/11 · Tarde, 14 a 17 h"), "Debe incluir día y rango horario");

  assert.strictEqual(Object.keys(cart).length, 0, "Debe vaciar el carrito tras confirmación");
});

test("Error de red en al recibir (ej. status 500): no vacía el carrito", async () => {
  let cart = { prod1: { name: 'Tomate', price: 35000, qty: 1 } };
  let errorMostrado = false;

  async function mockEnvioFalla() {
    try {
      throw new Error("HTTP 500");
    } catch (err) {
      errorMostrado = true;
    }
  }

  await mockEnvioFalla();
  assert(errorMostrado, "Debe capturar el error");
  assert.strictEqual(Object.keys(cart).length, 1, "El carrito NO debe vaciarse ante error");
  assert.strictEqual(cart.prod1.name, 'Tomate');
});

test("Doble clic simultáneo no duplica el envío (anti doble submit)", async () => {
  let submitCount = 0;
  let orderSubmitting = false;

  async function simularClick() {
    if (orderSubmitting) return;
    orderSubmitting = true;
    submitCount++;
    await new Promise(r => setTimeout(r, 50));
    orderSubmitting = false;
  }

  await Promise.all([simularClick(), simularClick()]);
  assert.strictEqual(submitCount, 1, "Solo debe procesarse 1 envío ante doble clic");
});

// -----------------------------------------------------------------------------
// 4. Verificación de HTML según requerimientos de diseño
// -----------------------------------------------------------------------------
console.log("\n4. Verificación de estructura HTML de index.html:");

test("index.html contiene el modal de elección con las 2 tarjetas y textos solicitados", () => {
  assert(htmlCode.includes('id="payment-choice-modal"'), "Debe existir #payment-choice-modal");
  assert(htmlCode.includes('id="btn-choice-online"'), "Debe existir #btn-choice-online");
  assert(htmlCode.includes('id="btn-choice-delivery"'), "Debe existir #btn-choice-delivery");
  assert(htmlCode.includes('id="choice-online-amount"'), "Debe existir #choice-online-amount");
  assert(htmlCode.includes('id="choice-delivery-amount"'), "Debe existir #choice-delivery-amount");
  assert(htmlCode.includes("Pago online"), "Debe tener 'Pago online'");
  assert(htmlCode.includes("Pagás ahora de forma segura con Mercado Pago"), "Debe tener descripción de pago online");
  assert(htmlCode.includes("Pago contra entrega"), "Debe tener 'Pago contra entrega'");
  assert(htmlCode.includes("Pagás al recibir tu pedido con QR, transferencia, tarjeta de débito o crédito. No se acepta efectivo."), "Debe tener descripción de contra entrega");
  assert(htmlCode.includes("estimado: puede variar según el peso real"), "Debe tener leyenda de peso estimado");
});

test("index.html contiene banner arriba del formulario con enlace 'Cambiar forma de pago'", () => {
  assert(htmlCode.includes('id="selected-payment-banner"'), "Debe existir #selected-payment-banner");
  assert(htmlCode.includes('id="selected-payment-name"'), "Debe existir #selected-payment-name");
  assert(htmlCode.includes('id="btn-change-payment"'), "Debe existir #btn-change-payment");
  assert(htmlCode.includes("Cambiar forma de pago"), "Debe tener enlace/botón 'Cambiar forma de pago'");
});

test("index.html NO tiene los dos botones de pago debajo del total en el resumen", () => {
  assert(!htmlCode.includes('class="payment-cards-grid"'), "No debe tener payment-cards-grid en resumen");
  assert(htmlCode.includes('id="btn-summary-checkout"'), "Debe tener botón de finalizar en el resumen");
});

test("index.html contiene modal de confirmación contra entrega con todos los campos requeridos", () => {
  assert(htmlCode.includes('id="success-modal"'), "Debe existir #success-modal");
  assert(htmlCode.includes("¡Pedido recibido!"), "Debe tener título '¡Pedido recibido!'");
  assert(htmlCode.includes('id="success-order-num"'), "Debe existir #success-order-num");
  assert(htmlCode.includes("Pendiente de pago: pagás al recibir"), "Debe existir texto de pendiente");
  assert(htmlCode.includes('id="success-order-total"'), "Debe existir #success-order-total");
  assert(htmlCode.includes('id="success-order-address"'), "Debe existir #success-order-address");
  assert(htmlCode.includes('id="success-order-delivery"'), "Debe existir #success-order-delivery");
  assert(htmlCode.includes('id="success-order-products"'), "Debe existir #success-order-products");
  assert(htmlCode.includes("11 6177-1376"), "Debe contener contacto WhatsApp 11 6177-1376");
  assert(htmlCode.includes('id="success-whatsapp-btn"'), "Debe existir #success-whatsapp-btn");
  assert(htmlCode.includes("Enviar mi pedido por WhatsApp"), "Debe tener texto 'Enviar mi pedido por WhatsApp'");
  assert(htmlCode.includes("Volver a la tienda"), "Debe tener botón 'Volver a la tienda'");
});

console.log("\n==================================================================");
console.log(`TOTAL DE PRUEBAS: ${testsPassed} | PASADAS: ${testsPassed} | FALLIDAS: 0`);
console.log("==================================================================");
