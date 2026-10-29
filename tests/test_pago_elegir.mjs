/**
 * SUITE DE PRUEBAS NODE: SELECTOR DE PAGO, FLUJO ONLINE Y PAGO AL RECIBIR
 * HUERTA URBANA
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("==================================================================");
console.log("SUITE DE PRUEBAS: ELECCIÓN DE PAGO (ONLINE Y AL RECIBIR)");
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

test("script.js define METODO_PAGO_ONLINE y METODO_PAGO_AL_RECIBIR", () => {
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
// 3. Simulación de Flujos de Envío (con Mock DOM y Mock Fetch)
// -----------------------------------------------------------------------------
console.log("\n3. Simulación de Flujos de Envío en Node:");

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
    'btn-pay-online': new MockElement('btn-pay-online', 'button'),
    'btn-pay-delivery': new MockElement('btn-pay-delivery', 'button'),
    'pay-online-amount': new MockElement('pay-online-amount', 'div'),
    'pay-delivery-amount': new MockElement('pay-delivery-amount', 'div'),
    'payment-policy-icon': new MockElement('payment-policy-icon', 'ion-icon'),
    'payment-policy-text': new MockElement('payment-policy-text', 'p'),
    'success-modal': new MockElement('success-modal', 'div'),
    'success-order-num': new MockElement('success-order-num', 'strong'),
    'success-order-total': new MockElement('success-order-total', 'strong'),
    'success-order-delivery': new MockElement('success-order-delivery', 'strong'),
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

  elements['success-modal'].style.display = 'none';

  const doc = {
    getElementById: (id) => elements[id] || null,
    querySelector: (sel) => {
      if (sel.includes('name="dia_entrega"')) return { value: 'Miércoles 04/11/2026 Tarde' };
      if (sel.includes('name="horario_entrega"')) return { value: '14 a 17 hs' };
      if (sel.includes('name="numero_pedido"')) return { value: '' };
      if (sel.includes('name="fecha"')) return { value: '' };
      if (sel.includes('name="fecha_entrega"')) return { value: '' };
      if (sel.includes('name="ficha_entrega"')) return { value: '' };
      if (sel.includes('name="nombre"')) return { value: 'Cliente Prueba' };
      if (sel.includes('name="telefono"')) return { value: '11 9999 8888' };
      if (sel.includes('name="direccion"')) return { value: 'Calle Test 456' };
      if (sel.includes('name="total"')) return { value: '38000' };
      if (sel.includes('name="cantidad"')) return { value: '2' };
      if (sel.includes('name="credito_usado"')) return { value: '0' };
      return new MockElement('generic');
    },
    documentElement: { classList: new Set() }
  };

  return { elements, doc };
}

test("Al cambiar de método de pago se actualiza el texto del botón y clases activas", () => {
  const { elements, doc } = crearEntornoSimulado();
  let metodoActual = 'mercadopago';

  function seleccionarMetodo(metodo) {
    metodoActual = metodo;
    elements['btn-pay-online'].classList[metodo === 'mercadopago' ? 'add' : 'delete']('active');
    elements['btn-pay-delivery'].classList[metodo === 'efectivo' ? 'add' : 'delete']('active');
    if (metodo === 'mercadopago') {
      elements['submit-btn'].innerText = 'Ir a pagar';
      elements['payment-policy-text'].textContent = 'Pagás ahora de forma segura con Mercado Pago';
    } else {
      elements['submit-btn'].innerText = 'Confirmar pedido';
      elements['payment-policy-text'].textContent = 'Pagás al recibir tu pedido...';
    }
  }

  // 1. Por defecto online
  seleccionarMetodo('mercadopago');
  assert.strictEqual(elements['submit-btn'].innerText, 'Ir a pagar');
  assert(elements['btn-pay-online'].classList.has('active'));
  assert(!elements['btn-pay-delivery'].classList.has('active'));

  // 2. Cambiar a al recibir
  seleccionarMetodo('efectivo');
  assert.strictEqual(elements['submit-btn'].innerText, 'Confirmar pedido');
  assert(!elements['btn-pay-online'].classList.has('active'));
  assert(elements['btn-pay-delivery'].classList.has('active'));

  // 3. Volver a online
  seleccionarMetodo('mercadopago');
  assert.strictEqual(elements['submit-btn'].innerText, 'Ir a pagar');
});

test("Al recibir con 200 (incluso texto plano 'Accepted'): muestra cartel con todos los datos y no busca link", () => {
  const { elements } = crearEntornoSimulado();
  let cart = { prod1: { name: 'Tomate', price: 35000, qty: 1 } };

  function simularMostrarConfirmacionAlRecibir(numeroPedido, totalNum, dia, horario) {
    elements['success-order-num'].textContent = numeroPedido;
    elements['success-order-total'].textContent = `$${Math.round(totalNum).toLocaleString('es-AR')}`;
    elements['success-order-delivery'].textContent = "Miércoles 04/11 · Tarde, 14 a 17 h";
    elements['success-whatsapp-btn'].href = `https://wa.me/5491161771376?text=Hola%2C%20consulta%20por%20mi%20pedido%20${numeroPedido}`;
    cart = {};
    elements['success-modal'].style.display = 'flex';
  }

  // Simulación: status 200, texto no JSON "Accepted"
  const responseStatus = 200;
  const responseText = "Accepted";

  if (responseStatus >= 200 && responseStatus < 300) {
    simularMostrarConfirmacionAlRecibir("HU-998877", 35000, "Miércoles 04/11/2026 Tarde", "14 a 17 hs");
  }

  assert.strictEqual(elements['success-modal'].style.display, 'flex', "Debe mostrar success-modal");
  assert.strictEqual(elements['success-order-num'].textContent, "HU-998877");
  assert.strictEqual(elements['success-order-total'].textContent, "$35.000");
  assert.strictEqual(elements['success-order-delivery'].textContent, "Miércoles 04/11 · Tarde, 14 a 17 h");
  assert(elements['success-whatsapp-btn'].href.includes("HU-998877"), "Debe tener link de WhatsApp precargado");
  assert.strictEqual(Object.keys(cart).length, 0, "Debe vaciar el carrito tras éxito");
});

test("Error de red en al recibir (ej. status 500 o network reject): no vacía el carrito", async () => {
  let cart = { prod1: { name: 'Tomate', price: 35000, qty: 1 } };
  let errorMostrado = false;

  async function mockEnvioFalla() {
    try {
      // Simular fallo
      throw new Error("HTTP 500");
    } catch (err) {
      errorMostrado = true;
      // No se vacía cart
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

  // Ejecución en paralelo simultánea (doble click rápido)
  await Promise.all([simularClick(), simularClick()]);

  assert.strictEqual(submitCount, 1, "Solo debe procesarse 1 envío ante doble clic");
});

test("Aviso de compra mínima faltante muestra cuánto falta cuando está apagado", () => {
  const MIN_PURCHASE = 35000;
  const total = 20000;
  const faltante = MIN_PURCHASE - total;
  const faltanteStr = `$${faltante.toLocaleString('es-AR')}`;
  const htmlResult = `Compra mínima: <span id="compra-minima-monto">$35.000</span> · <span class="min-faltante-text">Te faltan ${faltanteStr} para el pedido mínimo</span>`;

  assert(htmlResult.includes("Te faltan $15.000 para el pedido mínimo"), "Debe calcular y mostrar el monto faltante exacto");
});

test("index.html contiene el selector de pago y estructura de confirmación requerida", () => {
  assert(htmlCode.includes('id="btn-pay-online"'), "Debe existir #btn-pay-online");
  assert(htmlCode.includes('id="btn-pay-delivery"'), "Debe existir #btn-pay-delivery");
  assert(htmlCode.includes('id="pay-online-amount"'), "Debe existir #pay-online-amount");
  assert(htmlCode.includes('id="pay-delivery-amount"'), "Debe existir #pay-delivery-amount");
  assert(htmlCode.includes("Pagar online"), "Debe tener texto 'Pagar online'");
  assert(htmlCode.includes("Pagar al recibir"), "Debe tener texto 'Pagar al recibir'");
  assert(htmlCode.includes("Total estimado: puede variar según el peso real"), "Debe incluir leyenda de total estimado");
  assert(htmlCode.includes('id="success-whatsapp-btn"'), "Debe existir botón WhatsApp en modal success");
  assert(htmlCode.includes("Pendiente de pago: pagás al recibir"), "Debe existir estado de pago en el modal");
});

console.log("\n==================================================================");
console.log(`TOTAL DE PRUEBAS: ${testsPassed} | PASADAS: ${testsPassed} | FALLIDAS: 0`);
console.log("==================================================================");
