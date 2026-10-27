import * as C from "./entregaCalendario.js";

console.log("==================================================================");
console.log("PRUEBAS DEL SELECTOR CON RELOJES SIMULADOS (CON Y SIN FERIADO)");
console.log("==================================================================");

const casos = [
  { desc: "Lunes 09:00 (sin feriado)", fecha: "2026-11-02T09:00:00-03:00", feriados: [] },
  { desc: "Lunes 09:00 (con martes 03 cerrado)", fecha: "2026-11-02T09:00:00-03:00", feriados: ["2026-11-03"] },
  { desc: "Lunes 12:00 (sin feriado)", fecha: "2026-11-02T12:00:00-03:00", feriados: [] },
  { desc: "Viernes 11:00 (sin feriado)", fecha: "2026-11-06T11:00:00-03:00", feriados: [] },
  { desc: "Viernes 11:00 (con viernes 06 feriado)", fecha: "2026-11-06T11:00:00-03:00", feriados: ["2026-11-06"] },
  { desc: "Viernes 13:00 (sin feriado)", fecha: "2026-11-06T13:00:00-03:00", feriados: [] },
  { desc: "Viernes 13:00 (con sábado 07 cerrado)", fecha: "2026-11-06T13:00:00-03:00", feriados: ["2026-11-07"] },
  { desc: "Viernes 16:00 (sin feriado)", fecha: "2026-11-06T16:00:00-03:00", feriados: [] },
  { desc: "Viernes 16:00 (con lunes 09 cerrado)", fecha: "2026-11-06T16:00:00-03:00", feriados: ["2026-11-09"] },
  { desc: "Sábado 10:00 (sin feriado)", fecha: "2026-11-07T10:00:00-03:00", feriados: [] },
  { desc: "Sábado 10:00 (con lunes 09 cerrado)", fecha: "2026-11-07T10:00:00-03:00", feriados: ["2026-11-09"] },
  { desc: "Domingo 23:30 (sin feriado)", fecha: "2026-11-08T23:30:00-03:00", feriados: [] },
  { desc: "Domingo 23:30 (con lunes 09 cerrado)", fecha: "2026-11-08T23:30:00-03:00", feriados: ["2026-11-09"] },
];

function simularSelector(instanteStr, feriados) {
  const instante = new Date(instanteStr);
  const disponibles = C.bloquesDisponibles(instante, feriados, 14);
  const primera = C.primeraEntrega(instante, feriados);
  
  // Agrupar por día
  const grupos = {};
  disponibles.forEach(({ ymd, bloque }) => {
    if (!grupos[ymd]) grupos[ymd] = [];
    grupos[ymd].push(bloque);
  });

  const dias = Object.keys(grupos);
  const primeraOpcionTexto = primera ? C.formatoDiaEntrega(primera.ymd, primera.bloque) : "Ninguna";
  const primerGrupoLabel = dias.length > 0 ? `${C.DIAS[C.dowDeYmd(dias[0])]} ${dias[0].split("-")[2]}/${dias[0].split("-")[1]}` : "";

  return {
    primeraEntrega: primera,
    preseleccion: primeraOpcionTexto,
    primerGrupo: primerGrupoLabel,
    totalGrupos: dias.length,
    totalBloques: disponibles.length,
    primeros4Bloques: disponibles.slice(0, 4).map(b => `${C.formatoDiaEntrega(b.ymd, b.bloque)}`)
  };
}

casos.forEach(c => {
  const res = simularSelector(c.fecha, c.feriados);
  console.log(`\n▶ ${c.desc}`);
  console.log(`  Preselección (1ª disponible): ${res.preseleccion}`);
  console.log(`  Primer grupo (optgroup):     ${res.primerGrupo}`);
  console.log(`  Total opciones disponibles:  ${res.totalBloques} bloques en ${res.totalGrupos} días`);
  console.log(`  Primeras 4 opciones:         ${res.primeros4Bloques.join(" | ")}`);
});

console.log("\n==================================================================");
console.log("SIMULACIÓN DE PAYLOAD (dia_entrega en orderData)");
console.log("==================================================================");

// Supongamos un pedido hecho un viernes a las 11:30
const ahoraSim = new Date("2026-11-06T11:30:00-03:00");
const feriadosSim = [];
const primera = C.primeraEntrega(ahoraSim, feriadosSim);
const diaEntregaPayload = C.formatoDiaEntrega(primera.ymd, primera.bloque);
const horarioEntregaPayload = C.etiquetaBloque(primera.bloque);

const payloadSimulado = {
  "numero_pedido": "HU-123456",
  "fecha": "2026-11-06 11:30:00",
  "nombre": "TEST Web",
  "telefono": "11 1234 5678",
  "email": "test@huertaurbana.com.ar",
  "direccion": "Av. Siempre Viva 742",
  "localidad": "Pilar",
  "dia_entrega": diaEntregaPayload,
  "horario_entrega": horarioEntregaPayload,
  "metodo_pago": "mercadopago",
  "producto": "1 KILO TOMATE, 1/2 KILO LECHUGA",
  "cantidad": 2,
  "total": 35000,
  "cupon": "",
  "cupon_codigo": "",
  "cupon_descuento": 0,
  "uid": "usr_test_123",
  "credito_usado": 0,
  "codigo_referido_usado": "",
  "descuento": 0,
  "acepto_tc_publicidad": "SI",
  "estado": "Pendiente",
  "observaciones": "Sin observaciones",
  "fecha_entrega": `${diaEntregaPayload} (${horarioEntregaPayload})`,
  "ficha_entrega": "https://www.huertaurbana.com.ar/pedido/HU-123456",
  "external_reference": "HU-123456",
  "notification_url": "https://hook.us2.make.com/uwcvtbynbitqnxvm5ekx75by8jyuljxr"
};

console.log("dia_entrega generado:", payloadSimulado.dia_entrega);
console.log("Payload completo:\n", JSON.stringify(payloadSimulado, null, 2));

console.log("\n==================================================================");
console.log("SIMULACIÓN DE REVALIDACIÓN EN HORARIO DE CORTE");
console.log("==================================================================");

// Caso: El cliente seleccionó viernes tarde a las 11:50, pero tarda y confirma a las 12:05
const entregaElegida = { ymd: "2026-11-06", bloque: "T" };
const horaSeleccion = new Date("2026-11-06T11:50:00-03:00");
const horaEnvio = new Date("2026-11-06T12:05:00-03:00");

const validaAlElegir = C.validarEntrega(entregaElegida.ymd, entregaElegida.bloque, horaSeleccion, []);
const validaAlEnviar = C.validarEntrega(entregaElegida.ymd, entregaElegida.bloque, horaEnvio, []);

console.log(`A las 11:50, entrega ${C.formatoDiaEntrega(entregaElegida.ymd, entregaElegida.bloque)} es válida:`, validaAlElegir);
console.log(`A las 12:05 (pasó corte), entrega ${C.formatoDiaEntrega(entregaElegida.ymd, entregaElegida.bloque)} es válida:`, validaAlEnviar);

if (!validaAlEnviar) {
  const nuevaPrimera = C.primeraEntrega(horaEnvio, []);
  console.log(`Acción: SE BLOQUEA EL ENVÍO. Alerta: "Paso el horario de corte: elegi una nueva entrega"`);
  console.log(`Selector actualizado con nueva primera entrega: ${C.formatoDiaEntrega(nuevaPrimera.ymd, nuevaPrimera.bloque)}`);
}
