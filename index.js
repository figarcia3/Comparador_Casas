const MARGIN = { top: 30, bottom: 30, left: 10, right: 10 };

// Datos.

var DATA_CASAS_PLANOS;
var CURRENT_ZOOM = 1;

var MIN_VALOR;
var MAX_VALOR;

// Spider

// Configuración mapa.
const WIDTH_MAP = 500;
const HEIGHT_MAP = WIDTH_MAP * 9/16;

const height_map = HEIGHT_MAP - MARGIN.top - MARGIN.bottom
const width_map = WIDTH_MAP - MARGIN.left - MARGIN.right

const svg = d3.select('svg#santiago-svg')
                .attr('width', WIDTH_MAP)
                .attr('height', HEIGHT_MAP);

const map = svg.append('g')
                .attr('id', 'geo-container')
                .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

const santiago_map = map.append("g").attr("id", "santiago");
const casas_map = map.append("g").attr("id", "casas");


const proyeccion = d3.geoWinkel3().scale(2);

// Configuración comparador

const comparador_svg = d3.select('svg#comparador-svg')
                            .attr('width', WIDTH_MAP)
                            .attr('height', 400);

// Configuración Zoom.
const zoomHandler = (evento) => {

    const transformacion = evento.transform
    CURRENT_ZOOM = transformacion.k

    santiago_map
        .attr("transform", transformacion);

    casas_map
        .attr("transform", transformacion);

    casas_map
            .selectAll("circle.casa")
                .attr("r", 8/CURRENT_ZOOM)
}

const zoom = d3.zoom()
                .extent([ [0, 0], [width_map, height_map], ])
                .translateExtent([ [0, 0], [width_map, height_map], ])
                .scaleExtent([1,64])
                .on("zoom", zoomHandler);

map.call(zoom);


// Filtro por el rango de precios.
const show_casas = (data_casas, val) => {

    // const min = val[0]
    const max = val

    data_casas_filter = data_casas.filter((d) => (d.Valor_UF <= max))

    casas_map
        .selectAll("circle.casa")
        .data(data_casas_filter)
        .join(
            (enter) => {
                enter
                    .append("circle")
                        .attr("class", "casa")
                        .attr("cx", d => proyeccion([d.longitude, d.latitude])[0])
                        .attr("cy", d => proyeccion([d.longitude, d.latitude])[1])
                        .attr("r", 8/CURRENT_ZOOM)
                        .attr("opacity", 0)
                        .transition()
                        .duration(1000)
                        .attr("fill", "black")
                        .attr("opacity", 0.5)
            },
            (update) => {

            },
            (exit) => {
                exit
                .transition()
                .duration(1000)
                .attr("opacity", 0)
                .remove()
            })
}

// Consfiguración Rango Precios.
// ref= https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

const width_slider = WIDTH_MAP;
const height_slider = 30;

const slider_size = 450

const slider = document.getElementById("valor-range");

slider.onchange = () => {
    show_casas(DATA_CASAS_PLANOS, slider.value);

    d3.select('#text-range')
        .text(`[ ${MIN_VALOR} UF , ${slider.value} UF ]`)

};

// Axis range slider.
const slider_svg = d3.select('#range-container')
                        .append("svg")
                        .attr('height', height_slider)
                        .attr('width', slider_size)

const slider_axis = slider_svg
                        .append('g')
                        .attr('transform',`translate(${0}, ${0})`)

const escalaX = d3.scaleLinear()

// Text hoverable map
const text_comuna = d3.select('#text-container')
                        .append('text')
                        .attr('id', 'text-comuna')
                        .text('Ninguna comuna seleccionada.')

const text_range = d3.select('#text-range-container')
                        .append('text')
                        .attr('id', 'text-range')
                        .text('Selecciona un rango')

// Funciones mapa
const get_id_name = (nombre_comuna) => {
    const nombre = nombre_comuna
    const array_nombre = nombre.split(' ')
    return array_nombre.join('-');
}

const mouse_over_map = (nombre_comuna) => {
    
    const nombre = nombre_comuna
    const id_comuna = get_id_name(nombre)

    d3.selectAll(".santiago")
        .transition()
        .duration(100)
        .style("opacity", .2)

    d3.select(`#${id_comuna}`)
        .transition()
        .duration(100)
        .style("opacity", 1)

    d3.select('#text-comuna').text(nombre)
}

const mouse_leave_map = () => {

    d3.selectAll(".santiago")
        .transition()
        .duration(100)
        .style("opacity", 1)
    d3.select('#text-comuna').text('Ninguna comuna seleccionada.')
}

// Cargamos los datos de las casas.
d3.json("data/data2.json")
    .then((data) => {

        DATA_CASAS_PLANOS = data.reduce((cur, acc) => [...cur, ...acc.data], []);

        MAX_VALOR = d3.max(DATA_CASAS_PLANOS.map((d) => d.Valor_UF));
        MIN_VALOR = d3.min(DATA_CASAS_PLANOS.map((d) => parseInt(d.Valor_UF)));

        escalaX
            .domain([MIN_VALOR, MAX_VALOR])
            .range([0, 450]);
        
        slider_axis
            .transition()
            .duration(1000)
            .call(d3.axisBottom(escalaX)
                    .ticks(5)
                    .tickFormat(x => `${x}UF`));
    })
    .catch((error) => {
        console.log(error);
    })

// Cargamos los datos del geojson santiago.
d3.json("data/santiago.json")
    .then((datos_geo) => {

        // Fitteamos
        proyeccion.fitSize([width_map, height_map], datos_geo);
        const caminos_geo = d3.geoPath().projection(proyeccion);

        santiago_map
                    .selectAll("path.santiago")
                    .data(datos_geo.features, (d) => d.properties)
                    .join(
                        (enter) => {
                            enter
                                .append("path")
                                    .attr("class", "santiago")
                                    .attr("id", (d) => get_id_name(d.properties.NOM_COM))
                                    .attr("d", caminos_geo)
                                    .style("stroke", "black")
                                    .style("stroke-width", ".1")
                                    .attr("fill", "lightblue")
                                    .attr("opacity", 1)
                                    .on("mouseover", (_, d) => mouse_over_map(d.properties.NOM_COM))
                                    .on("mouseleave", mouse_leave_map)
                        }
                    )

    })
    .catch((error) => {
        console.log(error);
    })
