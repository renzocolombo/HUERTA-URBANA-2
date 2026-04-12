/**
 * actualizar-precios.js
 * 
 * Lee precios.json y actualiza los data attributes en index.html:
 *   - data-monto-minimo en <body>
 *   - data-precios      en <body>  (JSON serializado)
 * 
 * GitHub Actions ejecuta este script cada vez que precios.json cambia.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const preciosPath = path.join(ROOT, 'precios.json');
const htmlPath = path.join(ROOT, 'index.html');

// --- Leer precios.json ---
if (!fs.existsSync(preciosPath)) {
  console.error('[ERROR] precios.json no encontrado en:', preciosPath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(preciosPath, 'utf-8'));

// --- Procesar Productos ---
if (data.productos) {
  data.productos = data.productos
    .filter(p => p.activo !== false) // Filtrar inactivos
    .map(p => {
      // Capitalizar primera letra
      const nombre = p.nombre.trim();
      p.nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
      return p;
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar A-Z
}

// --- Procesar Combos ---
if (data.combos) {
  data.combos = data.combos
    .filter(c => c.activo !== false) // Filtrar inactivos
    .map(c => {
      const nombre = c.nombre.trim();
      c.nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
      return c;
    });
}

const precios = data;
const montoMinimo = precios.monto_minimo || 35000;
const preciosJSON = JSON.stringify(precios).replace(/'/g, '&apos;').replace(/"/g, '&quot;');

// --- Leer index.html ---
if (!fs.existsSync(htmlPath)) {
  console.error('[ERROR] index.html no encontrado en:', htmlPath);
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf-8');

// --- Reemplazar / insertar data attributes en <body> ---
// Patrón: <body ... data-monto-minimo="..." data-precios="...">
// Si ya existen, los actualiza. Si no, los inserta.

// Eliminar atributos viejos si existen
html = html.replace(/\s*data-monto-minimo="[^"]*"/, '');
html = html.replace(/\s*data-precios="[^"]*"/, '');

// Insertar los nuevos data attributes en la etiqueta <body>
html = html.replace(
  /<body([^>]*)>/,
  `<body$1 data-monto-minimo="${montoMinimo}" data-precios="${preciosJSON}">`
);

// --- Guardar index.html actualizado ---
fs.writeFileSync(htmlPath, html, 'utf-8');

console.log(`[OK] index.html actualizado:`);
console.log(`     → monto_minimo : ${montoMinimo}`);
console.log(`     → combos       : ${(precios.combos || []).length}`);
console.log(`     → productos    : ${(precios.productos || []).length}`);
