document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterRubro = document.getElementById('filterRubro');
    const filterComuna = document.getElementById('filterComuna');
    const filterGestion = document.getElementById('filterGestion');
    const btnClearFilters = document.getElementById('btnClearFilters');
    const cardsContainer = document.getElementById('cardsContainer');
    const resultsCount = document.getElementById('resultsCount');

    function normalizarTexto(texto) {
        if (!texto) return "";
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

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

            // Si la institución tiene imagen asignada de Supabase, la mostramos en un contenedor superior elegante
            let imagenHTML = '';
            if (rec.imagen) {
                imagenHTML = `
                    <div style="width: 100%; height: 160px; background-color: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px 8px 0 0; margin: -1.5rem -1.5rem 1.25rem -1.5rem; border-bottom: 1px solid #e2e8f0;">
                        <img src="${rec.imagen}" alt="${rec.nombre}" style="max-width: 100%; max-height: 100%; object-fit: contain; padding: 0.5rem;">
                    </div>
                `;
            }

            card.innerHTML = `
                <div>
                    ${imagenHTML}
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

    function limpiarFiltros() {
        searchInput.value = "";
        filterRubro.value = "Todos";
        filterComuna.value = "Todas";
        filterGestion.value = "Todas";
        renderRecursos(dbRecursos);
    }

    searchInput.addEventListener('input', filtrarRecursos);
    filterRubro.addEventListener('change', filtrarRecursos);
    filterComuna.addEventListener('change', filtrarRecursos);
    filterGestion.addEventListener('change', filtrarRecursos);
    btnClearFilters.addEventListener('click', limpiarFiltros);

    renderRecursos(dbRecursos);
});
