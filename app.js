document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterRubro = document.getElementById('filterRubro');
    const filterComuna = document.getElementById('filterComuna');
    const filterGestion = document.getElementById('filterGestion');
    const btnClearFilters = document.getElementById('btnClearFilters');
    const cardsContainer = document.getElementById('cardsContainer');
    const resultsCount = document.getElementById('resultsCount');

    // Función auxiliar para quitar acentos y pasar a minúsculas
    function normalizarTexto(texto) {
        if (!texto) return "";
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Función para renderizar las tarjetas
    function renderRecursos(recursosAExhibir) {
        cardsContainer.innerHTML = '';
        
        resultsCount.textContent = `Se encontraron ${recursosAExhibir.length} recurso(s)`;

        if (recursosAExhibir.length === 0) {
            cardsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No se encontraron instituciones con los filtros seleccionados</h3>
                    <p>Intente modificando los criterios de búsqueda.</p>
                </div>
            `;
            return;
        }

        recursosAExhibir.forEach(rec => {
            const card = document.createElement('div');
            card.className = 'resource-card';

            card.innerHTML = `
                <div>
                    <div class="card-header">
                        <h3 class="card-title">${rec.nombre}</h3>
                        <span class="tag-rubro">${rec.rubro}</span>
                    </div>
                    <div class="card-subrubro">${rec.subrubro}</div>
                    <div class="card-body">
                        <p><strong>Dirección:</strong> ${rec.direccion}</p>
                        <p><strong>Teléfono:</strong> ${rec.telefono}</p>
                        <p><strong>Barrio:</strong> ${rec.barrio}</p>
                        <p style="margin-top: 0.5rem;">${rec.detalles}</p>
                    </div>
                </div>
                <div class="card-footer">
                    <span class="badge-gestion">${rec.gestion}</span>
                    <span class="badge-comuna">${rec.comuna}</span>
                </div>
            `;

            cardsContainer.appendChild(card);
        });
    }

    // Función de filtrado combinada (insensible a acentos y mayúsculas)
    function filtrarRecursos() {
        const textoBusqueda = normalizarTexto(searchInput.value.trim());
        const rubroSeleccionado = filterRubro.value;
        const comunaSeleccionada = filterComuna.value;
        const gestionSeleccionada = filterGestion.value;

        const filtrados = dbRecursos.filter(rec => {
            const contenidoRecurso = normalizarTexto(
                `${rec.nombre} ${rec.barrio} ${rec.direccion} ${rec.detalles} ${rec.subrubro}`
            );

            const coincideTexto = contenidoRecurso.includes(textoBusqueda);
            const coincideRubro = (rubroSeleccionado === "Todos" || rec.rubro === rubroSeleccionado);
            const coincideComuna = (comunaSeleccionada === "Todas" || rec.comuna === comunaSeleccionada);
            const coincideGestion = (gestionSeleccionada === "Todas" || normalizarTexto(rec.gestion).includes(normalizarTexto(gestionSeleccionada)));

            return coincideTexto && coincideRubro && coincideComuna && coincideGestion;
        });

        renderRecursos(filtrados);
    }

    // Función para limpiar todos los filtros
    function limpiarFiltros() {
        searchInput.value = "";
        filterRubro.value = "Todos";
        filterComuna.value = "Todas";
        filterGestion.value = "Todas";
        renderRecursos(dbRecursos);
    }

    // Event Listeners
    searchInput.addEventListener('input', filtrarRecursos);
    filterRubro.addEventListener('change', filtrarRecursos);
    filterComuna.addEventListener('change', filtrarRecursos);
    filterGestion.addEventListener('change', filtrarRecursos);
    btnClearFilters.addEventListener('click', limpiarFiltros);

    // Carga inicial
    renderRecursos(dbRecursos);
});