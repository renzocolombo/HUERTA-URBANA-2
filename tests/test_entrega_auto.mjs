import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import * as C from "../entregaCalendario.js";

console.log("==================================================================");
console.log("SUITE DE PRUEBAS NODE: ENTREGA AUTOMÁTICA, FALLBACK Y PAYLOAD");
console.log("==================================================================");

let testsPassed = 0;
function test(desc, fn) {
  try {
    fn();
    console.log(`  [PASS] ${desc}`);
    testsPassed++;
  } catch (err) {
    console.error(`  [FAIL] ${desc}`);
    console.error(err);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// Helper: Función equivalente a actualizarTextoEntregaAuto de script.js
// -----------------------------------------------------------------------------
function formatearTextoEntregaAuto(valorSeleccionado) {
  if (!valorSeleccionado) return "No hay entregas disponibles";
  const parsed = C.parseDiaEntrega(valorSeleccionado);
  if (parsed && parsed.ymd && parsed.bloque) {
    const [y, m, d] = parsed.ymd.split("-");
    const dow = C.dowDeYmd(parsed.ymd);
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
    const rawDia = C.DIAS[dow] || "Día";
    const diaLindo = nombresConTilde[rawDia] || rawDia;
    const bloqueTexto = parsed.bloque === "M" ? "la Mañana" : "la Tarde";
    return `${diaLindo} ${d}/${m} por ${bloqueTexto}`;
  }
  return valorSeleccionado;
}

function simularSincronizarHorario(valorSeleccionado) {
  const parsed = C.parseDiaEntrega(valorSeleccionado);
  if (!parsed || !parsed.bloque) return "";
  return parsed.bloque === "M" ? "8 a 12 hs" : "14 a 17 hs";
}

function construirPayloadSimulado({ diaEntrega, horarioEntrega }) {
  return {
    "numero_pedido": "HU-999999",
    "fecha": "2026-10-27 20:00:00",
    "nombre": "Cliente Huerta",
    "telefono": "11 6177 1376",
    "email": "cliente@huertaurbana.com.ar",
    "direccion": "Calle Falsa 123",
    "localidad": "Pilar",
    "dia_entrega": diaEntrega,
    "horario_entrega": horarioEntrega,
    "metodo_pago": "mercadopago",
    "producto": "1 KILO TOMATE",
    "cantidad": 1,
    "total": 35000,
    "cupon": "",
    "cupon_codigo": "",
    "cupon_descuento": 0,
    "uid": "uid_test",
    "credito_usado": 0,
    "codigo_referido_usado": "",
    "descuento": 0,
    "acepto_tc_publicidad": "SI",
    "estado": "Pendiente",
    "observaciones": "Sin observaciones",
    "fecha_entrega": `${diaEntrega} (${horarioEntrega})`,
    "ficha_entrega": "https://www.huertaurbana.com.ar/pedido/HU-999999",
    "external_reference": "HU-999999",
    "notification_url": "https://hook.us2.make.com/uwcvtbynbitqnxvm5ekx75by8jyuljxr"
  };
}

// -----------------------------------------------------------------------------
// 1. Simulación sin elegir día manualmente (primera entrega automática)
// -----------------------------------------------------------------------------
console.log("\n1. Flujo automático sin selección manual de día:");

test("Preselecciona la primera entrega calculada por entregaCalendario.js", () => {
  // Supongamos servidor un martes a las 10:00
  const ahoraServidor = new Date("2026-10-27T10:00:00-03:00");
  const feriados = [];
  const primera = C.primeraEntrega(ahoraServidor, feriados);
  assert(primera !== null, "Primera entrega no debe ser nula");
  assert.strictEqual(primera.ymd, "2026-10-28");
  assert.strictEqual(primera.bloque, "M");

  const diaValor = C.formatoDiaEntrega(primera.ymd, primera.bloque);
  assert.strictEqual(diaValor, "Miercoles 28/10/2026 Mañana");

  const horario = simularSincronizarHorario(diaValor);
  assert.strictEqual(horario, "8 a 12 hs");

  const textoAuto = formatearTextoEntregaAuto(diaValor);
  assert.strictEqual(textoAuto, "Miércoles 28/10 por la Mañana");

  const payload = construirPayloadSimulado({ diaEntrega: diaValor, horarioEntrega: horario });
  assert.strictEqual(payload.dia_entrega, "Miercoles 28/10/2026 Mañana");
  assert.strictEqual(payload.horario_entrega, "8 a 12 hs");
  assert.strictEqual(payload.fecha_entrega, "Miercoles 28/10/2026 Mañana (8 a 12 hs)");
});

// -----------------------------------------------------------------------------
// 2. Simulación al elegir otro día manualmente
// -----------------------------------------------------------------------------
console.log("\n2. Flujo al elegir otro día manualmente (despliegue de selector):");

test("Al seleccionar otro bloque disponible, se actualiza el día, horario y texto", () => {
  const ahoraServidor = new Date("2026-10-27T10:00:00-03:00");
  const feriados = [];
  const disponibles = C.bloquesDisponibles(ahoraServidor, feriados, 14);
  assert(disponibles.length > 2, "Debe haber múltiples bloques");

  // El usuario elige la opción 3 (ej: Jueves mañana o tarde)
  const eleccionManual = disponibles[3];
  const diaValorManual = C.formatoDiaEntrega(eleccionManual.ymd, eleccionManual.bloque);
  const horarioManual = simularSincronizarHorario(diaValorManual);
  const textoAutoManual = formatearTextoEntregaAuto(diaValorManual);

  assert(diaValorManual.includes("/2026"), "El formato debe incluir fecha completa");
  assert(["8 a 12 hs", "14 a 17 hs"].includes(horarioManual), "Horario debe ser válido");
  assert(textoAutoManual.includes(" por la "), "Texto humano debe contener ' por la '");

  const payload = construirPayloadSimulado({ diaEntrega: diaValorManual, horarioEntrega: horarioManual });
  assert.strictEqual(payload.dia_entrega, diaValorManual);
  assert.strictEqual(payload.horario_entrega, horarioManual);
  assert.strictEqual(payload.fecha_entrega, `${diaValorManual} (${horarioManual})`);
});

// -----------------------------------------------------------------------------
// 3. Fallo de getFeriados / Sin conexión (reloj local del dispositivo)
// -----------------------------------------------------------------------------
console.log("\n3. Fallback sin calendario / fallo getFeriados:");

test("Usa reloj del dispositivo con feriados vacíos y genera entrega automática válida", () => {
  // Simular serverTimeOffset = 0 y feriadosCerrados = []
  const relojLocal = new Date();
  const feriadosFallback = [];
  const primera = C.primeraEntrega(relojLocal, feriadosFallback);
  assert(primera !== null, "Debe calcular primera entrega incluso con reloj local");

  const diaValor = C.formatoDiaEntrega(primera.ymd, primera.bloque);
  const horario = simularSincronizarHorario(diaValor);
  const textoAuto = formatearTextoEntregaAuto(diaValor);

  assert(diaValor.length > 10, "diaValor debe ser válido");
  assert(textoAuto.length > 5, "Texto automático debe ser generado");

  const parsed = C.parseDiaEntrega(diaValor);
  const esValida = C.validarEntrega(parsed.ymd, parsed.bloque, relojLocal, feriadosFallback, 14);
  assert.strictEqual(esValida, true, "La entrega calculada con reloj local debe ser válida");
});

// -----------------------------------------------------------------------------
// 4. Verificación de Payload (27 campos exactos y orden)
// -----------------------------------------------------------------------------
console.log("\n4. Verificación estricta de estructura y orden de Payload (27 campos):");

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

test("Payload simulado contiene exactamente los 27 campos en orden", () => {
  const p = construirPayloadSimulado({ diaEntrega: "Martes 28/10/2026 Tarde", horarioEntrega: "14 a 17 hs" });
  const keys = Object.keys(p);
  assert.strictEqual(keys.length, 27, `Debe tener 27 campos (tiene ${keys.length})`);
  assert.deepStrictEqual(keys, EXPECTED_FIELDS, "El orden y nombre de los campos debe coincidir");
});

test("script.js define orderData con exactamente los 27 campos en orden", () => {
  const scriptContent = fs.readFileSync(path.resolve("script.js"), "utf8");
  const orderDataMatch = scriptContent.match(/const orderData = \{([\s\S]*?)\n\s*\};/);
  assert(orderDataMatch !== null, "Se encontró la estructura orderData en script.js");

  const lines = orderDataMatch[1].split("\n")
    .map(l => l.trim())
    .filter(l => l.startsWith('"') || l.startsWith("'"));

  const extractedKeys = lines.map(l => {
    const m = l.match(/^["']([^"']+)["']\s*:/);
    return m ? m[1] : null;
  }).filter(Boolean);

  assert.strictEqual(extractedKeys.length, 27, `script.js orderData debe tener 27 campos (tiene ${extractedKeys.length})`);
  assert.deepStrictEqual(extractedKeys, EXPECTED_FIELDS, "El orden y nombres en script.js coincide con los 27 campos");
});

// -----------------------------------------------------------------------------
// 5. Verificación de textos de Pago y Elementos en index.html y script.js
// -----------------------------------------------------------------------------
console.log("\n5. Verificación de textos de Pago y Entrega Automática en archivos:");

const TEXTO_PAGO_REQUERIDO = "Pagás al recibir tu pedido: QR, transferencia, tarjeta de débito o crédito (no efectivo). El monto final puede variar levemente según el peso real de los productos.";

test("index.html contiene el texto de pago en el Resumen", () => {
  const htmlContent = fs.readFileSync(path.resolve("index.html"), "utf8");
  const summaryStart = htmlContent.indexOf('id="order-summary-card"');
  assert(summaryStart !== -1, "Debe existir #order-summary-card");
  const summaryEnd = htmlContent.indexOf('id="desktop-help"', summaryStart);
  const summaryBlock = htmlContent.substring(summaryStart, summaryEnd !== -1 ? summaryEnd : summaryStart + 1500);
  const plainText = summaryBlock.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert(plainText.includes(TEXTO_PAGO_REQUERIDO), "El resumen debe contener el texto de pago requerido");
  assert(summaryBlock.includes('class="payment-policy-box"'), "Debe contener la clase payment-policy-box en resumen");
});

test("index.html contiene el texto de pago en el Modal de Confirmación (#success-modal)", () => {
  const htmlContent = fs.readFileSync(path.resolve("index.html"), "utf8");
  const modalStart = htmlContent.indexOf('id="success-modal"');
  assert(modalStart !== -1, "Debe existir success-modal");
  const modalEnd = htmlContent.indexOf('id="combo-modal"', modalStart);
  const modalBlock = htmlContent.substring(modalStart, modalEnd !== -1 ? modalEnd : modalStart + 1000);
  const plainText = modalBlock.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  assert(plainText.includes(TEXTO_PAGO_REQUERIDO), "success-modal debe contener el texto de pago requerido");
  assert(modalBlock.includes('class="payment-policy-box modal-payment-box"'), "Debe contener la clase modal-payment-box");
});

test("index.html contiene delivery-auto-card y botón 'Programar otro día'", () => {
  const htmlContent = fs.readFileSync(path.resolve("index.html"), "utf8");
  assert(htmlContent.includes('id="delivery-auto-card"'), "Debe existir #delivery-auto-card");
  assert(htmlContent.includes('id="delivery-auto-text"'), "Debe existir #delivery-auto-text");
  assert(htmlContent.includes('id="btn-cambiar-entrega"'), "Debe existir #btn-cambiar-entrega");
  assert(htmlContent.includes("Programar otro día"), "Botón debe decir 'Programar otro día'");
  assert(htmlContent.includes('id="delivery-manual-container"'), "Debe existir #delivery-manual-container");
});

test("script.js contiene actualizarTextoEntregaAuto y toggle del selector manual", () => {
  const scriptContent = fs.readFileSync(path.resolve("script.js"), "utf8");
  assert(scriptContent.includes("function actualizarTextoEntregaAuto"), "Debe definir actualizarTextoEntregaAuto");
  assert(scriptContent.includes("btn-cambiar-entrega"), "Debe escuchar click en #btn-cambiar-entrega");
  assert(scriptContent.includes("delivery-manual-container"), "Debe alternar #delivery-manual-container");
});

console.log("\n==================================================================");
console.log(`TOTAL DE PRUEBAS: ${testsPassed} | PASADAS: ${testsPassed} | FALLIDAS: 0`);
console.log("==================================================================");
