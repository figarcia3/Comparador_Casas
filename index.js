const MARGIN = { top: 30, bottom: 30, left: 10, right: 10 };

// Datos.

var DATA_CASAS_PLANOS;

// Spider

// Configuración mapa.
const WIDTH_MAP = 600;
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

// Configuración Zoom.
const zoomHandler = (evento) => {

    const transformacion = evento.transform

    santiago_map
        .attr("transform", transformacion);

    casas_map
        .attr("transform", transformacion);
    
    // casas_map
    //         .selectAll("circle.casa")
    //             .attr("transform", function(){
    //                 const x = transformacion.applyX(d3.select(this).attr("cx"))
    //                 const y = transformacion.applyY(d3.select(this).attr("cy"))

    //                 return `translate(${x}, ${y})`;
    //             })
}

const zoom = d3.zoom()
                .extent([ [0, 0], [width_map, height_map], ])
                .translateExtent([ [0, 0], [width_map, height_map], ])
                .scaleExtent([1, 4])
                .on("zoom", zoomHandler);

map.call(zoom);

// Consfiguración Rango Precios.
// ref= https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

const width_slider = 600;
const height_slider = 100;

const slider_size = 300

const sliderRange = d3.sliderBottom();

var gRange = d3
        .select('div#range-container')
        .append('svg')
        .attr('width', width_slider)
        .attr('height', height_slider)
        .append('g')
        .attr('transform', `translate(${(width_slider - slider_size)/2}, ${MARGIN.top})`);

// Filtro por el rango de precios.
const show_casas = (data_casas, val) => {

    const min = val[0]
    const max = val[1]

    data_casas_filter = data_casas.filter((d) => (d.Valor_UF >= min & d.Valor_UF <= max))

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
                        .attr("r", 2)
                        .attr("fill", "black")
                        .attr("opacity", 0.5)
            },
            (update) => {
                update
                    .attr("cx", d => proyeccion([d.longitude, d.latitude])[0])
                    .attr("cy", d => proyeccion([d.longitude, d.latitude])[1])
                    .attr("r", 2)
                    .attr("fill", "black")
                    .attr("opacity", 0.5)
            },
            (exit) => {
                exit.remove()
            })
}



// Cargamos los datos de las casas.
d3.json("data/data.json")
    .then((data) => {

        DATA_CASAS_PLANOS = data.reduce((cur, acc) => [...cur, ...acc.data], []);

        const max_Valor = d3.max(DATA_CASAS_PLANOS.map((d) => d.Valor_UF));
        const min_Valor = d3.min(DATA_CASAS_PLANOS.map((d) => parseInt(d.Valor_UF)));
        
        const default_value = [5000,20000]

        show_casas(DATA_CASAS_PLANOS, default_value);

        sliderRange
            .min(min_Valor)
            .max(max_Valor)
            .width(slider_size)
            .ticks(10)
            .default(default_value)
            .fill('#2196f3')
            .on('onchange', val => {
                show_casas(DATA_CASAS_PLANOS,val)
            });
        
        gRange.call(sliderRange);

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
                                    .attr("id", function(d) {
                                        const nombre = d.properties.NOM_COM
                                        const array_nombre = nombre.split(' ')
                                        return array_nombre.join('-');
                                    })
                                    .attr("d", caminos_geo)
                        }
                    )

    })
    .catch((error) => {
        console.log(error);
    })
