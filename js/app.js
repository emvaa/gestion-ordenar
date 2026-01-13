/**
 * Aplicación principal del visualizador de reportes
 */

// Estado global
let allData = [];
let filteredData = [];
let currentPage = 1;
let itemsPerPage = 50;
let currentSort = { column: null, direction: 'asc' };
let parser = new CSVParser();

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

/**
 * Inicializa todos los event listeners
 */
function initializeEventListeners() {
    const fileInput = document.getElementById('csvFile');
    const uploadBox = document.getElementById('uploadBox');
    const searchInput = document.getElementById('searchInput');
    const filterPagado = document.getElementById('filterPagado');
    const filterEdificio = document.getElementById('filterEdificio');
    const filterEstado = document.getElementById('filterEstado');
    const resetFilters = document.getElementById('resetFilters');
    const exportBtn = document.getElementById('exportBtn');
    const loadNewFile = document.getElementById('loadNewFile');

    // Carga de archivo
    fileInput.addEventListener('change', handleFileSelect);
    uploadBox.addEventListener('click', () => fileInput.click());
    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('dragleave', handleDragLeave);
    uploadBox.addEventListener('drop', handleDrop);

    // Filtros y búsqueda
    searchInput.addEventListener('input', applyFilters);
    filterPagado.addEventListener('change', applyFilters);
    filterEdificio.addEventListener('change', applyFilters);
    filterEstado.addEventListener('change', applyFilters);
    resetFilters.addEventListener('click', resetAllFilters);
    exportBtn.addEventListener('click', exportFilteredData);
    loadNewFile.addEventListener('click', () => {
        document.getElementById('contentSection').classList.add('hidden');
        document.getElementById('uploadBox').style.display = 'block';
        allData = [];
        filteredData = [];
        resetAllFilters();
    });

    // Ordenamiento de columnas
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.getAttribute('data-sort');
            sortData(column);
        });
    });
}

/**
 * Maneja la selección de archivo
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        loadCSVFile(file);
    }
}

/**
 * Maneja el drag over
 */
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

/**
 * Maneja el drag leave
 */
function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

/**
 * Maneja el drop de archivo
 */
function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
        loadCSVFile(file);
    } else {
        alert('Por favor, selecciona un archivo CSV válido');
    }
}

/**
 * Carga y procesa el archivo CSV
 */
function loadCSVFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const result = parser.parse(e.target.result);
            allData = result.data;
            filteredData = [...allData];
            
            // Actualizar estadísticas
            updateStats(result.resumen || parser.calculateStats());
            
            // Actualizar filtros de edificios
            updateEdificioFilter();
            
            // Mostrar contenido
            document.getElementById('contentSection').classList.remove('hidden');
            document.getElementById('uploadBox').style.display = 'none';
            
            // Mostrar información del archivo
            document.getElementById('fileInfo').textContent = 
                `Archivo cargado: ${file.name} (${file.size} bytes) - ${allData.length} registros`;
            
            // Renderizar tabla
            currentPage = 1;
            renderTable();
            renderPagination();
            
        } catch (error) {
            alert(`Error al procesar el archivo: ${error.message}`);
            console.error(error);
        }
    };
    
    reader.onerror = () => {
        alert('Error al leer el archivo');
    };
    
    reader.readAsText(file, 'UTF-8');
}

/**
 * Actualiza las estadísticas
 */
function updateStats(stats) {
    document.getElementById('totalReservas').textContent = stats.total_reservas || 0;
    document.getElementById('reservasPagadas').textContent = stats.reservas_pagadas || 0;
    document.getElementById('totalIngresos').textContent = formatCurrency(stats.total_ingresos || 0);
    document.getElementById('totalPendientes').textContent = formatCurrency(stats.total_pendientes || 0);
}

/**
 * Formatea moneda
 */
function formatCurrency(amount) {
    return `₲ ${new Intl.NumberFormat('es-PY').format(amount)}`;
}

/**
 * Actualiza el filtro de edificios
 */
function updateEdificioFilter() {
    const filterEdificio = document.getElementById('filterEdificio');
    const edificios = [...new Set(allData.map(r => r.edificio).filter(Boolean))].sort();
    
    // Limpiar opciones excepto "Todos"
    filterEdificio.innerHTML = '<option value="">Todos los edificios</option>';
    
    edificios.forEach(edificio => {
        const option = document.createElement('option');
        option.value = edificio;
        option.textContent = edificio;
        filterEdificio.appendChild(option);
    });
}

/**
 * Aplica todos los filtros
 */
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterPagado = document.getElementById('filterPagado').value;
    const filterEdificio = document.getElementById('filterEdificio').value;
    const filterEstado = document.getElementById('filterEstado').value;

    filteredData = allData.filter(row => {
        // Búsqueda general
        if (searchTerm) {
            const searchableText = [
                row.cliente,
                row.cedula,
                row.telefono,
                row.departamento,
                row.edificio
            ].join(' ').toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }

        // Filtro de pago
        if (filterPagado && row.pagado !== filterPagado) {
            return false;
        }

        // Filtro de edificio
        if (filterEdificio && row.edificio !== filterEdificio) {
            return false;
        }

        // Filtro de estado
        if (filterEstado && row.estado !== filterEstado) {
            return false;
        }

        return true;
    });

    currentPage = 1;
    renderTable();
    renderPagination();
}

/**
 * Resetea todos los filtros
 */
function resetAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterPagado').value = '';
    document.getElementById('filterEdificio').value = '';
    document.getElementById('filterEstado').value = '';
    
    filteredData = [...allData];
    currentPage = 1;
    renderTable();
    renderPagination();
}

/**
 * Ordena los datos
 */
function sortData(column) {
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }

    filteredData.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        // Manejar valores nulos
        if (aVal === null || aVal === undefined) aVal = '';
        if (bVal === null || bVal === undefined) bVal = '';

        // Convertir a números si es posible
        if (typeof aVal === 'string' && !isNaN(aVal) && aVal !== '') {
            aVal = parseFloat(aVal);
        }
        if (typeof bVal === 'string' && !isNaN(bVal) && bVal !== '') {
            bVal = parseFloat(bVal);
        }

        // Comparar
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return currentSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (currentSort.direction === 'asc') {
            return aStr.localeCompare(bStr);
        } else {
            return bStr.localeCompare(aStr);
        }
    });

    // Actualizar indicadores visuales
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.classList.remove('sorted-asc', 'sorted-desc');
        if (th.getAttribute('data-sort') === column) {
            th.classList.add(`sorted-${currentSort.direction}`);
        }
    });

    renderTable();
}

/**
 * Renderiza la tabla
 */
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = '';

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="14" class="text-center">No se encontraron registros</td></tr>';
        return;
    }

    pageData.forEach(row => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${row.id || 'N/A'}</td>
            <td>${row.cliente || 'N/A'}</td>
            <td>${row.cedula || 'N/A'}</td>
            <td>${row.telefono || 'N/A'}</td>
            <td>${row.departamento || 'N/A'}</td>
            <td>${row.edificio || 'N/A'}</td>
            <td>${row.check_in || 'N/A'}</td>
            <td>${row.check_out || 'N/A'}</td>
            <td>${row.dias || 'N/A'}</td>
            <td>${row.monto ? formatCurrency(row.monto) : 'N/A'}</td>
            <td>${getPagadoBadge(row.pagado)}</td>
            <td>${row.metodo_pago || 'N/A'}</td>
            <td>${row.fecha_pago || 'N/A'}</td>
            <td>${getEstadoBadge(row.estado)}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

/**
 * Obtiene el badge de pago
 */
function getPagadoBadge(pagado) {
    if (pagado === 'Sí' || pagado === true) {
        return '<span class="badge badge-success">Pagado</span>';
    }
    return '<span class="badge badge-danger">Pendiente</span>';
}

/**
 * Obtiene el badge de estado
 */
function getEstadoBadge(estado) {
    if (!estado) return 'N/A';
    
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('confirmada') || estadoLower.includes('confirmado')) {
        return '<span class="badge badge-success">Confirmada</span>';
    }
    if (estadoLower.includes('curso') || estadoLower.includes('en curso')) {
        return '<span class="badge badge-info">En Curso</span>';
    }
    if (estadoLower.includes('completada') || estadoLower.includes('completado')) {
        return '<span class="badge badge-success">Completada</span>';
    }
    if (estadoLower.includes('cancelada') || estadoLower.includes('cancelado')) {
        return '<span class="badge badge-danger">Cancelada</span>';
    }
    
    return `<span class="badge badge-warning">${estado}</span>`;
}

/**
 * Renderiza la paginación
 */
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    
    // Botón anterior
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">« Anterior</button>`;
    
    // Números de página
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        html += `<button onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            html += `<span class="pagination-info">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="pagination-info">...</span>`;
        }
        html += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Botón siguiente
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">Siguiente »</button>`;
    
    // Información
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredData.length);
    html += `<span class="pagination-info">Mostrando ${start}-${end} de ${filteredData.length} registros</span>`;
    
    pagination.innerHTML = html;
}

/**
 * Va a una página específica
 */
function goToPage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
    renderPagination();
    
    // Scroll al inicio de la tabla
    document.querySelector('.table-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Exporta los datos filtrados a CSV
 */
function exportFilteredData() {
    if (filteredData.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Crear CSV
    let csv = 'ID,Cliente,Cédula,Teléfono,Departamento,Edificio,Check-in,Check-out,Días,Monto,Pagado,Método de Pago,Fecha de Pago,Estado\n';
    
    filteredData.forEach(row => {
        const escapar = (texto) => {
            if (!texto || texto === 'N/A') return 'N/A';
            return `"${String(texto).replace(/"/g, '""')}"`;
        };
        
        csv += `${row.id || ''},${escapar(row.cliente)},${escapar(row.cedula)},${escapar(row.telefono)},${escapar(row.departamento)},${escapar(row.edificio)},${row.check_in || ''},${row.check_out || ''},${row.dias || ''},${row.monto || ''},${row.pagado || ''},${escapar(row.metodo_pago)},${row.fecha_pago || ''},${escapar(row.estado)}\n`;
    });

    // Crear blob y descargar
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_filtrado_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
