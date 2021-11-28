const MARGIN = { top: 30, bottom: 30, left: 10, right: 10 };

// Datos.

var DATA_CASAS_PLANOS;

// Spider

// Configuración mapa.
const WIDTH_MAP = 600;
const HEIGHT_MAP = WIDTH_MAP * 3/4;

const height_map = HEIGHT_MAP - MARGIN.top - MARGIN.bottom
const width_map = WIDTH_MAP - MARGIN.left - MARGIN.right

const svg = d3.select('svg#santiago-svg')
                .attr('width', WIDTH_MAP)
                .attr('height', HEIGHT_MAP);

const map = svg.append('g')
                .attr('width', width_map)
                .attr('height', height_map)
                .attr('id', 'geo-container')
                .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

const santiago_map = map.append("g").attr("id", "santiago");
const casas_map = map.append("g").attr("id", "casas");

let casas;
// let comunas;

const proyeccion = d3.geoWinkel3().scale(2);

// Configuración Zoom.
const zoomHandler = (evento) => {

    console.log(evento)

    const transformacion = evento.transform;

    santiago_map
        .attr("transform", transformacion);
    
    casas_map
        .attr("transform", transformacion);
            // .selectAll("circle.casa")
            //     .attr("cx", function(){
            //         const x = transformacion.applyX(d3.select(this).attr("cx"));
            //         return x;
            //     })
            //     .attr("cy", function(){
            //         const y = transformacion.applyY(d3.select(this).attr("cy"));
            //         return y;
            //     })
}

const zoom = d3.zoom()
                .extent([ [0, 0], [width_map, height_map], ])
                .translateExtent([ [0, 0], [width_map, height_map], ])
                .scaleExtent([1, 4])
                .on("zoom", zoomHandler);

map.call(zoom);

// Consfiguración Rango Precios.
// ref= https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

// Cargamos los datos de las casas.
d3.json("data/data.json")
    .then((data) => {

        DATA_CASAS_PLANOS = data.reduce((cur, acc) => [...cur, ...acc.data], []);

        d3.max(DATA_CASAS_PLANOS.map((d) => d.Valor_UF));
        d3.min(DATA_CASAS_PLANOS.map((d) => parseInt(d.Valor_UF)));


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
                    .data(datos_geo.features)
                    .enter()
                    .append("path")
                        .attr("class", "santiago")
                        .attr("d", caminos_geo)

        casas_map
                    .selectAll("circle.casa")
                    .data(DATA_CASAS_PLANOS)
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
                        }
                    )

    })
    .catch((error) => {
        console.log(error);
    })
