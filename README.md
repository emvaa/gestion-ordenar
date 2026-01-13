# 📊 Visualizador de Reportes CSV

Aplicación web independiente para visualizar, ordenar y analizar los reportes CSV generados por el sistema de gestión de reservas.

## 🎯 Características

- ✅ **Carga de archivos CSV** - Arrastra y suelta o selecciona archivos
- 📊 **Visualización ordenada** - Tabla interactiva con ordenamiento por columnas
- 🔍 **Búsqueda y filtros** - Filtra por cliente, edificio, estado de pago, etc.
- 📈 **Estadísticas visuales** - Resumen de reservas, ingresos y pendientes
- 📄 **Paginación** - Navegación cómoda por grandes volúmenes de datos
- 💾 **Exportación** - Exporta los datos filtrados a CSV
- 📱 **Responsive** - Funciona perfectamente en móviles y tablets
- 🎨 **Interfaz moderna** - Diseño limpio y fácil de usar

## 🚀 Instalación y Uso

### Opción 1: Alojamiento Estático (Recomendado)

1. **Sube los archivos** a tu servicio de alojamiento estático:
   - GitHub Pages
   - Netlify
   - Vercel
   - Firebase Hosting
   - Cualquier servidor web estático

2. **Estructura de archivos:**
   ```
   visualizador-reportes/
   ├── index.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   ├── csvParser.js
   │   └── app.js
   └── README.md
   ```

3. **Accede a la aplicación** desde tu navegador

### Opción 2: Servidor Local

Si quieres probarlo localmente:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## 📋 Formato del CSV

La aplicación está diseñada para trabajar con el formato CSV generado por el sistema de reportes, que incluye las siguientes columnas:

- ID Reserva
- Cliente
- Cédula
- Teléfono
- Departamento
- Edificio
- Check-in
- Check-out
- Días
- Monto
- Pagado
- Método de Pago
- Fecha de Pago
- Estado

Al final del CSV puede incluir un resumen con estadísticas del mes.

## 🎨 Características de la Interfaz

### Estadísticas
Muestra tarjetas con:
- Total de reservas
- Reservas pagadas
- Total de ingresos
- Total pendiente

### Filtros
- **Búsqueda general**: Busca en cliente, cédula, teléfono, departamento y edificio
- **Filtro de pago**: Pagado / Pendiente
- **Filtro de edificio**: Lista dinámica de edificios
- **Filtro de estado**: Confirmada, En Curso, Completada

### Tabla Interactiva
- **Ordenamiento**: Haz clic en cualquier encabezado para ordenar
- **Badges de estado**: Indicadores visuales para pagos y estados
- **Formato de moneda**: Montos formateados con símbolo ₲
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### Paginación
- 50 registros por página (configurable)
- Navegación con botones anterior/siguiente
- Indicador de registros mostrados

## 🔧 Personalización

### Cambiar items por página

En `js/app.js`, modifica la variable:
```javascript
let itemsPerPage = 50; // Cambia este valor
```

### Cambiar colores

En `css/styles.css`, modifica las variables CSS:
```css
:root {
    --primary: #2563eb;
    --success: #10b981;
    /* ... más colores */
}
```

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Navegadores móviles modernos

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3 (con variables CSS)
- JavaScript Vanilla (sin dependencias)
- FileReader API para lectura de archivos
- Drag & Drop API

## 📝 Notas

- Los archivos CSV se procesan completamente en el navegador (sin enviar datos a servidores)
- Compatible con el formato CSV generado por el sistema de reportes
- Maneja correctamente caracteres especiales y UTF-8
- Soporta archivos con BOM (Byte Order Mark)

## 🐛 Solución de Problemas

### El CSV no se carga correctamente
- Verifica que el archivo tenga la extensión `.csv`
- Asegúrate de que el formato coincida con el esperado
- Revisa la consola del navegador para errores

### Los datos no se muestran
- Verifica que el CSV tenga la línea de encabezados
- Asegúrate de que las columnas coincidan con el formato esperado

### Problemas con caracteres especiales
- El CSV debe estar en UTF-8
- El sistema maneja automáticamente el BOM si está presente

## 📄 Licencia

Este proyecto es parte del sistema de gestión de reservas y mantiene la misma licencia.

## 🤝 Contribuciones

Este es un proyecto independiente pero relacionado. Si encuentras problemas o tienes sugerencias, puedes reportarlos en el repositorio principal.

---

**Desarrollado para facilitar la visualización y análisis de reportes de reservas** 🏢📊
