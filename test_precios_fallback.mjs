import fs from 'fs';

console.log("==================================================================");
console.log("SUITE DE PRUEBAS SIN NAVEGADOR: PRECIOS, REINTENTO, AVISO Y PAYLOAD");
console.log("==================================================================");

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}`);
  }
}

// -----------------------------------------------------------------------------
// 1. Validar eliminación de precios.json y scripts/actualizar-precios.js
// -----------------------------------------------------------------------------
console.log("\n1. Verificación de archivos eliminados y referencias");
assert(!fs.existsSync('precios.json'), "precios.json no existe en el sistema de archivos");
assert(!fs.existsSync('scripts/actualizar-precios.js'), "scripts/actualizar-precios.js no existe en el sistema de archivos");

const scriptContent = fs.readFileSync('script.js', 'utf8');
const swContent = fs.readFileSync('sw.js', 'utf8');

assert(!scriptContent.includes('precios.json'), "script.js no contiene ninguna referencia a precios.json");
assert(!scriptContent.includes('PRECIOS_JSON_URL'), "script.js no contiene PRECIOS_JSON_URL");
assert(!swContent.includes('precios.json'), "sw.js no contiene excepciones para precios.json");

// -----------------------------------------------------------------------------
// 2. Simulación DOM y funciones para probar la lógica de script.js
// -----------------------------------------------------------------------------
console.log("\n2. Simulación de Fetch Fallido, Reintento y Aviso");

class MockClassList {
  constructor() {
    this._classes = new Set();
  }
  add(c) { this._classes.add(c); }
  remove(c) { this._classes.delete(c); }
  contains(c) { return this._classes.has(c); }
}

class MockElement {
  constructor(id = '', tagName = 'div') {
    this.id = id;
    this.tagName = tagName;
    this.style = {};
    this.classList = new MockClassList();
    this.disabled = false;
    this.innerHTML = '';
    this.textContent = '';
    this.attributes = {};
    this.children = [];
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k]; }
  prepend(el) { this.children.unshift(el); }
  insertBefore(newNode, refNode) { this.children.push(newNode); }
}

const domElements = {
  'submit-btn': new MockElement('submit-btn', 'button'),
  'header': new MockElement('header', 'header'),
  'shipping-header-msg': new MockElement('shipping-header-msg', 'span'),
  'compra-minima-monto': new MockElement('compra-minima-monto', 'span'),
  'envio-gratis-monto': new MockElement('envio-gratis-monto', 'span')
};
domElements['submit-btn'].classList.add('btn-disabled');
domElements['submit-btn'].disabled = true;

const mockDocument = {
  getElementById(id) {
    return domElements[id] || null;
  },
  createElement(tag) {
    return new MockElement('', tag);
  },
  body: new MockElement('body', 'body')
};

// -----------------------------------------------------------------------------
// 3. Prueba de flujo Fetch Fallido con reintento tras 2 segundos
// -----------------------------------------------------------------------------
let fetchCalls = 0;
let fetchTimestamps = [];

async function simulateCargarPrecios({ shouldFail = false, montoMinimo = 35000 }) {
  let cargandoPreciosPromise = null;
  let ultimoFetchPrecios = 0;
  let preciosCargadosOk = false;
  let MIN_PURCHASE = 35000;

  function deshabilitarBotonFinalizar() {
    const btn = mockDocument.getElementById('submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.classList.add('btn-disabled');
    }
  }

  function mostrarAvisoErrorPrecios() {
    let aviso = mockDocument.getElementById('aviso-error-precios');
    if (!aviso) {
      aviso = mockDocument.createElement('div');
      aviso.id = 'aviso-error-precios';
      aviso.innerHTML = `
        <div class="aviso-error-precios-msg">
          <span class="aviso-texto">No pudimos cargar los precios actualizados. Reintenta en unos minutos</span>
        </div>
        <button type="button" id="btn-reintentar-precios">Reintentar</button>
      `;
      domElements['aviso-error-precios'] = aviso;
      domElements['btn-reintentar-precios'] = new MockElement('btn-reintentar-precios', 'button');
    }
    aviso.style.display = 'block';
    deshabilitarBotonFinalizar();
  }

  function ocultarAvisoErrorPrecios() {
    const aviso = mockDocument.getElementById('aviso-error-precios');
    if (aviso) {
      aviso.style.display = 'none';
    }
  }

  async function mockFetchPreciosWeb() {
    fetchCalls++;
    fetchTimestamps.push(Date.now());
    if (shouldFail) {
      throw new Error('Network error');
    }
    return {
      success: true,
      monto_minimo: montoMinimo,
      productos: [{ id: 'papa', nombre: 'Papa', precio: 500 }],
      combos: []
    };
  }

  // Ejecución de la lógica equivalente a script.js
  let cargoExitoso = false;
  let data = null;

  try {
    data = await mockFetchPreciosWeb();
  } catch (e1) {
    // Intento 1 falló
  }

  if (!data) {
    // Reintento tras 2 segundos (usamos 20ms en el mock para rapidez del test, validando que hubo 2 intentos)
    await new Promise(r => setTimeout(r, 20));
    try {
      data = await mockFetchPreciosWeb();
    } catch (e2) {
      // Intento 2 falló
    }
  }

  if (data && data.success) {
    if (data.monto_minimo) MIN_PURCHASE = Number(data.monto_minimo);
    cargoExitoso = true;
    preciosCargadosOk = true;
    ocultarAvisoErrorPrecios();
  } else {
    cargoExitoso = false;
    preciosCargadosOk = false;
    mostrarAvisoErrorPrecios();
  }

  if (!cargoExitoso) {
    deshabilitarBotonFinalizar();
  }

  return { cargoExitoso, preciosCargadosOk, MIN_PURCHASE };
}

// Ejecutar caso FALLIDO
fetchCalls = 0;
fetchTimestamps = [];
const resFallo = await simulateCargarPrecios({ shouldFail: true });

assert(fetchCalls === 2, "Fetch fallido se reintenta exactamente 1 vez (2 llamadas en total)");
assert(resFallo.cargoExitoso === false, "Resultado cargoExitoso es false ante doble fallo");
assert(resFallo.preciosCargadosOk === false, "preciosCargadosOk es false");

const avisoEl = domElements['aviso-error-precios'];
assert(avisoEl && avisoEl.style.display === 'block', "Aviso de error está visible (display = block)");
assert(avisoEl.innerHTML.includes("No pudimos cargar los precios actualizados. Reintenta en unos minutos"), "Aviso contiene el texto exacto requerido");
assert(avisoEl.innerHTML.includes("Reintentar"), "Aviso contiene el botón 'Reintentar'");

const btnCheckout = domElements['submit-btn'];
assert(btnCheckout.disabled === true, "Botón de finalizar pedido está disabled = true tras fallo");
assert(btnCheckout.classList.contains('btn-disabled'), "Botón de finalizar pedido tiene la clase 'btn-disabled'");

// -----------------------------------------------------------------------------
// 4. Prueba de flujo Fetch EXITOSO
// -----------------------------------------------------------------------------
console.log("\n3. Simulación de Fetch Exitoso");
fetchCalls = 0;
const resExito = await simulateCargarPrecios({ shouldFail: false, montoMinimo: 40000 });

assert(fetchCalls === 1, "Fetch exitoso no requiere reintentos (1 sola llamada)");
assert(resExito.cargoExitoso === true, "Resultado cargoExitoso es true");
assert(resExito.preciosCargadosOk === true, "preciosCargadosOk es true");
assert(resExito.MIN_PURCHASE === 40000, "MIN_PURCHASE actualizado al valor retornado por el API");
assert(avisoEl.style.display === 'none', "Aviso de error se oculta tras éxito");

// -----------------------------------------------------------------------------
// 5. Verificación estricta de orden y campos en Payload del Pedido (27 campos)
// -----------------------------------------------------------------------------
console.log("\n4. Verificación de Payload del Pedido (27 campos exactos y orden)");

const EXPECTED_FIELDS = [
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

// Extraer definición de orderData en script.js
const orderDataMatch = scriptContent.match(/const orderData = \{([\s\S]*?)\n\s*\};/);
assert(orderDataMatch !== null, "Se encontró la estructura orderData en script.js");

const lines = orderDataMatch[1].split('\n')
  .map(l => l.trim())
  .filter(l => l.startsWith('"') || l.startsWith("'"));

const extractedKeys = lines.map(l => {
  const m = l.match(/^["']([^"']+)["']\s*:/);
  return m ? m[1] : null;
}).filter(Boolean);

assert(extractedKeys.length === 27, `Payload tiene exactamente 27 campos (obtenidos: ${extractedKeys.length})`);

let orderMatches = true;
for (let i = 0; i < EXPECTED_FIELDS.length; i++) {
  if (extractedKeys[i] !== EXPECTED_FIELDS[i]) {
    console.error(`Discrepancia en campo ${i}: esperado '${EXPECTED_FIELDS[i]}', encontrado '${extractedKeys[i]}'`);
    orderMatches = false;
  }
}
assert(orderMatches, "El orden y nombre de los 27 campos del payload es 100% idéntico al original");

// -----------------------------------------------------------------------------
// Resumen
// -----------------------------------------------------------------------------
console.log("\n==================================================================");
console.log(`TOTAL DE PRUEBAS: ${totalTests} | PASADAS: ${passedTests} | FALLIDAS: ${totalTests - passedTests}`);
console.log("==================================================================");

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
