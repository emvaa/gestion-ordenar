/**
 * Parser de CSV para reportes de reservas
 * Maneja el formato específico del CSV generado por el sistema de reportes
 */

class CSVParser {
    constructor() {
        this.data = [];
        this.headers = [];
        this.resumen = null;
    }

    /**
     * Parsea el contenido del CSV
     * @param {string} csvContent - Contenido del archivo CSV
     * @returns {Object} - Objeto con datos y resumen
     */
    parse(csvContent) {
        // Limpiar BOM si existe
        csvContent = csvContent.replace(/^\uFEFF/, '');
        
        const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line);
        
        if (lines.length === 0) {
            throw new Error('El archivo CSV está vacío');
        }

        // Buscar la línea de encabezados
        let headerIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('ID') && lines[i].includes('Cliente')) {
                headerIndex = i;
                break;
            }
        }

        if (headerIndex === -1) {
            throw new Error('No se encontraron encabezados válidos en el CSV');
        }

        // Parsear encabezados
        this.headers = this.parseCSVLine(lines[headerIndex]);
        
        // Normalizar nombres de columnas
        this.headers = this.headers.map(h => this.normalizeHeader(h));

        // Parsear datos
        this.data = [];
        for (let i = headerIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detectar inicio del resumen
            if (line.startsWith('RESUMEN') || line === '') {
                // Parsear resumen si existe
                this.parseResumen(lines.slice(i));
                break;
            }

            const row = this.parseCSVLine(line);
            if (row.length === this.headers.length) {
                const dataRow = {};
                this.headers.forEach((header, index) => {
                    dataRow[header] = this.cleanValue(row[index]);
                });
                this.data.push(dataRow);
            }
        }

        return {
            data: this.data,
            resumen: this.resumen,
            headers: this.headers
        };
    }

    /**
     * Parsea una línea CSV considerando comillas
     * @param {string} line - Línea del CSV
     * @returns {Array} - Array de valores
     */
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Comilla escapada
                    current += '"';
                    i++; // Saltar la siguiente comilla
                } else {
                    // Toggle de comillas
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Fin del campo
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        // Agregar el último campo
        values.push(current.trim());

        return values;
    }

    /**
     * Normaliza nombres de encabezados
     * @param {string} header - Nombre del encabezado
     * @returns {string} - Nombre normalizado
     */
    normalizeHeader(header) {
        const mapping = {
            'ID Reserva': 'id',
            'ID': 'id',
            'Cliente': 'cliente',
            'Cédula': 'cedula',
            'Teléfono': 'telefono',
            'Departamento': 'departamento',
            'Edificio': 'edificio',
            'Check-in': 'check_in',
            'Check-out': 'check_out',
            'Días': 'dias',
            'Monto': 'monto',
            'Pagado': 'pagado',
            'Método de Pago': 'metodo_pago',
            'Método': 'metodo_pago',
            'Fecha de Pago': 'fecha_pago',
            'Fecha Pago': 'fecha_pago',
            'Estado': 'estado'
        };

        return mapping[header] || header.toLowerCase().replace(/\s+/g, '_');
    }

    /**
     * Limpia y formatea valores
     * @param {string} value - Valor a limpiar
     * @returns {any} - Valor limpio
     */
    cleanValue(value) {
        if (!value || value === 'N/A' || value === '') {
            return null;
        }

        // Remover comillas si existen
        value = value.replace(/^"|"$/g, '');

        // Intentar convertir números
        if (/^\d+$/.test(value)) {
            return parseInt(value, 10);
        }

        if (/^\d+\.\d+$/.test(value)) {
            return parseFloat(value);
        }

        return value;
    }

    /**
     * Parsea la sección de resumen del CSV
     * @param {Array} lines - Líneas del resumen
     */
    parseResumen(lines) {
        this.resumen = {};

        for (const line of lines) {
            if (!line || line.startsWith('RESUMEN')) continue;

            const parts = this.parseCSVLine(line);
            if (parts.length >= 2) {
                const key = parts[0].toLowerCase().replace(/\s+/g, '_');
                const value = this.cleanValue(parts[1]);
                
                if (key.includes('total_reservas')) {
                    this.resumen.total_reservas = value;
                } else if (key.includes('reservas_pagadas')) {
                    this.resumen.reservas_pagadas = value;
                } else if (key.includes('reservas_pendientes')) {
                    this.resumen.reservas_pendientes = value;
                } else if (key.includes('total_ingresos')) {
                    this.resumen.total_ingresos = value;
                } else if (key.includes('total_pendientes')) {
                    this.resumen.total_pendientes = value;
                } else if (key.includes('total_general')) {
                    this.resumen.total_general = value;
                }
            }
        }
    }

    /**
     * Calcula estadísticas de los datos
     * @returns {Object} - Estadísticas calculadas
     */
    calculateStats() {
        if (this.data.length === 0) {
            return {
                total_reservas: 0,
                reservas_pagadas: 0,
                reservas_pendientes: 0,
                total_ingresos: 0,
                total_pendientes: 0,
                total_general: 0
            };
        }

        const reservasPagadas = this.data.filter(r => r.pagado === 'Sí' || r.pagado === true);
        const reservasPendientes = this.data.filter(r => r.pagado === 'No' || r.pagado === false);

        const totalIngresos = reservasPagadas.reduce((sum, r) => {
            const monto = typeof r.monto === 'number' ? r.monto : parseFloat(r.monto) || 0;
            return sum + monto;
        }, 0);

        const totalPendientes = reservasPendientes.reduce((sum, r) => {
            const monto = typeof r.monto === 'number' ? r.monto : parseFloat(r.monto) || 0;
            return sum + monto;
        }, 0);

        return {
            total_reservas: this.data.length,
            reservas_pagadas: reservasPagadas.length,
            reservas_pendientes: reservasPendientes.length,
            total_ingresos: totalIngresos,
            total_pendientes: totalPendientes,
            total_general: totalIngresos + totalPendientes
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVParser;
}
