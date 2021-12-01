const MARGIN = { top: 30, bottom: 30, left: 10, right: 10 };

// Datos.

var DATA_CASAS_PLANOS;
var CURRENT_ZOOM = 1;

var MIN_VALOR;
var MAX_VALOR;

var CASAS_SELECTED = []

var DATA_COMPARE = []

const COLORS = ['#FF785B','#D76BE1']

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

// Configuración Zoom.
const zoomHandler = (evento) => {

    const transformacion = evento.transform
    CURRENT_ZOOM = transformacion.k

    santiago_map
        .attr("transform", transformacion);

    casas_map
        .attr("transform", transformacion);

    // tooltipG_map
    //     .attr("transform", transformacion);

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


// Comparador de stats

const WIDTH_COMP = 500;
const HEIGHT_COMP = 120;

const height_comp = HEIGHT_COMP - 20 - 20
const width_comp = WIDTH_COMP - 20 - 20

const margin_comp_left = 50



// uf
const comparador_svg_uf = d3.select('svg#comparador-svg-uf')
                            .attr('width', WIDTH_COMP)
                            .attr('height', HEIGHT_COMP);

const g_uf = comparador_svg_uf.append("g")
                        .attr('transform', `translate(${margin_comp_left}, ${20})`);

const escalaX_comp_uf = d3.scaleLinear()
const escalaY_comp_uf = d3.scaleBand()

const xAxis_uf = comparador_svg_uf.append("g")
                        .attr('transform', `translate(${margin_comp_left}, ${height_comp + 20})`);

const yAxis_uf = comparador_svg_uf.append("g")
                        .attr('transform', `translate(${margin_comp_left}, ${20})`);

const title_uf = comparador_svg_uf.append("text")
                                .attr('transform', `translate(${margin_comp_left}, ${15})`)
                                .text("Valor UF");

// tooltipBar
const tooltipG_uf = comparador_svg_uf.append('g')
                .attr("display", "none");

const tooltipText_uf = tooltipG_uf.append("text")
                .style("fill", "black")

const tooltipTextX_uf = tooltipText_uf.append("tspan")
                .style("text-anchor", "middle")


const show_comparador_uf = (data) => {

    escalaY_comp_uf
        .domain(data.map((d) => d.index))
        .range([ 0, height_comp])
        .padding(.1)

    //console.log(data)
    xAxis_uf.call(d3.axisBottom(escalaX_comp_uf).ticks(4));
    yAxis_uf.call(d3.axisLeft(escalaY_comp_uf));

    g_uf
        .selectAll("rect")
            .data(data)
            .join(
                (enter) => {
                    enter
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_uf(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_uf.bandwidth())
                        .attr("fill", (d) => COLORS[data.indexOf(d)])
                        .on("mouseover", (_, d) => {
                            tooltipTextX_uf.text(`${parseInt(d.Valor_UF)}`)
                            //tooltipTextY.text(`Valor: ${d.Valor_UF}`)
                            tooltipG_uf.attr("display", true)
                                .attr('transform', `translate(${margin_comp_left+(escalaX_comp_uf(parseInt(d.Valor_UF)))},
                                                              ${20 + escalaY_comp_uf(d.index) + (escalaY_comp_uf.bandwidth()/2)})`)
                        })
                        .on("mouseleave", () => {
                            tooltipG_uf.attr("display", "none");
                        })
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_uf(d.index))
                        .attr("width", (d) => escalaX_comp_uf(parseInt(d.Valor_UF)))
                        .attr("height", escalaY_comp_uf.bandwidth())
                },
                (update) => {
                    update
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_uf(d.index))
                        .transition()
                        .duration(1000)
                        .attr("width", (d) => escalaX_comp_uf(parseInt(d.Valor_UF)))
                        .attr("height", escalaY_comp_uf.bandwidth())

                },
                (exit) => {
                    exit
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_uf(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_uf.bandwidth())
                        .remove()
                }
            )

}

// m2
const comparador_svg_m2 = d3.select('svg#comparador-svg-m2')
                            .attr('width', WIDTH_COMP)
                            .attr('height', HEIGHT_COMP);

const g_m2 = comparador_svg_m2.append("g")
                                    .attr('transform', `translate(${margin_comp_left}, ${20})`);

const escalaX_comp_m2 = d3.scaleLinear()
const escalaY_comp_m2 = d3.scaleBand()


const xAxis_m2 = comparador_svg_m2.append("g")
                                    .attr('transform', `translate(${margin_comp_left}, ${height_comp +20})`);

const yAxis_m2 = comparador_svg_m2.append("g")
                                    .attr('transform', `translate(${margin_comp_left}, ${20})`);

const title_m2 = comparador_svg_m2.append("text")
                                    .attr('transform', `translate(${margin_comp_left}, ${15})`)
                                    .text("Metros Cuadrados Totales");               
                                    
const tooltipG_m2 = comparador_svg_m2.append('g')
                .attr("display", "none");

const tooltipText_m2 = tooltipG_m2.append("text")
                .style("fill", "black")

const tooltipTextX_m2 = tooltipText_m2.append("tspan")
                .style("text-anchor", "middle")
//
const show_comparador_m2 = (data) => {

    escalaY_comp_m2
        .domain(data.map((d) => d.index))
        .range([ 0, height_comp])
        .padding(.1)

    //console.log(data)
    xAxis_m2.call(d3.axisBottom(escalaX_comp_m2).ticks(4));
    yAxis_m2.call(d3.axisLeft(escalaY_comp_m2));

    g_m2
        .selectAll("rect")
            .data(data)
            .join(
                (enter) => {
                    enter
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_m2(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_m2.bandwidth())
                        .attr("fill", (d) => COLORS[data.indexOf(d)])
                        .on("mouseover", (_, d) => {
                            tooltipTextX_m2.text(`${parseInt(d.Total_Superficie_M2)}`)
                            tooltipG_m2.attr("display", true)
                                .attr('transform', `translate(${margin_comp_left+(escalaX_comp_m2(parseInt(d.Total_Superficie_M2)))},
                                                              ${20 + escalaY_comp_m2(d.index) + (escalaY_comp_m2.bandwidth()/2)})`)
                        })
                        .on("mouseleave", () => {
                            tooltipG_m2.attr("display", "none");
                        })
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_m2(d.index))
                        .attr("width", (d) => escalaX_comp_m2(d.Total_Superficie_M2))
                        .attr("height", escalaY_comp_m2.bandwidth())
                },
                (update) => {
                    update
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_m2(d.index))
                        .transition()
                        .duration(1000)
                        .attr("width", (d) => escalaX_comp_m2(d.Total_Superficie_M2))
                        .attr("height", escalaY_comp_m2.bandwidth())

                },
                (exit) => {
                    exit
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_m2(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_m2.bandwidth())
                        .remove()
                }
            )

}

// m2c
const comparador_svg_m2c = d3.select('svg#comparador-svg-m2c')
                            .attr('width', WIDTH_COMP)
                            .attr('height', HEIGHT_COMP);

const g_m2c = comparador_svg_m2c.append("g")
                                    .attr('transform', `translate(${margin_comp_left}, ${20})`);

const escalaX_comp_m2c = d3.scaleLinear()
const escalaY_comp_m2c = d3.scaleBand()


const xAxis_m2c = comparador_svg_m2c.append("g")
                                    .attr('transform', `translate(${margin_comp_left}, ${height_comp +20})`);

const yAxis_m2c = comparador_svg_m2c.append("g")
                                    .attr('transform', `translate(${margin_comp_left}, ${20})`);

const title_m2c = comparador_svg_m2c.append("text")
                                    .attr('transform', `translate(${margin_comp_left}, ${15})`)
                                    .text("Metros Cuadrados Construídos");

const tooltipG_m2c = comparador_svg_m2c.append('g')
                .attr("display", "none");

const tooltipText_m2c = tooltipG_m2c.append("text")
                .style("fill", "black")

const tooltipTextX_m2c = tooltipText_m2c.append("tspan")
                .style("text-anchor", "middle")
//
const show_comparador_m2c = (data) => {

    escalaY_comp_m2c
        .domain(data.map((d) => d.index))
        .range([ 0, height_comp])
        .padding(.1)

    //console.log(data)
    xAxis_m2c.call(d3.axisBottom(escalaX_comp_m2c).ticks(4));
    yAxis_m2c.call(d3.axisLeft(escalaY_comp_m2c));

    g_m2c
        .selectAll("rect")
            .data(data)
            .join(
                (enter) => {
                    enter
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_m2c(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_m2c.bandwidth())
                        .attr("fill", (d) => COLORS[data.indexOf(d)])
                        .on("mouseover", (_, d) => {
                            tooltipTextX_m2c.text(`${parseInt(d.Superficie_Construida_M2)}`)
                            tooltipG_m2c.attr("display", true)
                                .attr('transform', `translate(${margin_comp_left+(escalaX_comp_m2c(parseInt(d.Superficie_Construida_M2)))},
                                                              ${20 + escalaY_comp_m2c(d.index) + (escalaY_comp_m2c.bandwidth()/2)})`)
                        })
                        .on("mouseleave", () => {
                            tooltipG_m2c.attr("display", "none");
                        })
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_m2c(d.index))
                        .attr("width", (d) => escalaX_comp_m2c(d.Superficie_Construida_M2))
                        .attr("height", escalaY_comp_m2c.bandwidth())
                },
                (update) => {
                    update
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_m2c(d.index))
                        .transition()
                        .duration(1000)
                        .attr("width", (d) => escalaX_comp_m2c(d.Superficie_Construida_M2))
                        .attr("height", escalaY_comp_m2c.bandwidth())

                },
                (exit) => {
                    exit
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_m2c(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_m2c.bandwidth())
                        .remove()
                }
            )

}

// h
const comparador_svg_h = d3.select('svg#comparador-svg-h')
                            .attr('width', WIDTH_COMP)
                            .attr('height', HEIGHT_COMP);

const g_h = comparador_svg_h.append("g")
                        .attr('transform', `translate(${30}, ${20})`);

const escalaX_comp_h = d3.scaleLinear()
const escalaY_comp_h = d3.scaleBand()

const xAxis_h = comparador_svg_h.append("g")
                        .attr('transform', `translate(${30}, ${height_comp + 20})`);

const yAxis_h = comparador_svg_h.append("g")
                        .attr('transform', `translate(${30}, ${20})`);

const title_h = comparador_svg_h.append("text")
            .attr('transform', `translate(${30}, ${15})`)
            .text("Habitaciones");

const tooltipG_h = comparador_svg_h.append('g')
            .attr("display", "none");

const tooltipText_h = tooltipG_h.append("text")
            .style("fill", "black")

const tooltipTextX_h = tooltipText_h.append("tspan")
            .style("text-anchor", "middle")

const show_comparador_h = (data) => {

    escalaY_comp_h
        .domain(data.map((d) => d.index))
        .range([ 0, height_comp])
        .padding(.1)

    //console.log(data)
    xAxis_h.call(d3.axisBottom(escalaX_comp_h).ticks(4));
    yAxis_h.call(d3.axisLeft(escalaY_comp_h));

    g_h
        .selectAll("rect")
            .data(data)
            .join(
                (enter) => {
                    enter
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_h(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_h.bandwidth())
                        .attr("fill", (d) => COLORS[data.indexOf(d)])
                        .on("mouseover", (_, d) => {
                            tooltipTextX_h.text(`${parseInt(d.N_Habitaciones)}`)
                            tooltipG_h.attr("display", true)
                                .attr('transform', `translate(${30 + (escalaX_comp_h(parseInt(d.N_Habitaciones)))},
                                                              ${20 + escalaY_comp_h(d.index) + (escalaY_comp_h.bandwidth()/2)})`)
                        })
                        .on("mouseleave", () => {
                            tooltipG_h.attr("display", "none");
                        })
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_h(d.index))
                        .attr("width", (d) => escalaX_comp_h(d.N_Habitaciones))
                        .attr("height", escalaY_comp_h.bandwidth())
                },
                (update) => {
                    update
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_h(d.index))
                        .transition()
                        .duration(1000)
                        .attr("width", (d) => escalaX_comp_h(d.N_Habitaciones))
                        .attr("height", escalaY_comp_h.bandwidth())

                },
                (exit) => {
                    exit
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_h(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_h.bandwidth())
                        .remove()
                }
            )

}

// b
const comparador_svg_b = d3.select('svg#comparador-svg-b')
                            .attr('width', WIDTH_COMP)
                            .attr('height', HEIGHT_COMP);

const g_b = comparador_svg_b.append("g")
                        .attr('transform', `translate(${30}, ${20})`);

const escalaX_comp_b = d3.scaleLinear()
const escalaY_comp_b = d3.scaleBand()

const xAxis_b = comparador_svg_b.append("g")
                        .attr('transform', `translate(${30}, ${height_comp + 20})`);

const yAxis_b = comparador_svg_b.append("g")
                        .attr('transform', `translate(${30}, ${20})`);

const title_b = comparador_svg_b.append("text")
                        .attr('transform', `translate(${30}, ${15})`)
                        .text("Baños");

const tooltipG_b = comparador_svg_b.append('g')
            .attr("display", "none");

const tooltipText_b = tooltipG_b.append("text")
            .style("fill", "black")

const tooltipTextX_b = tooltipText_b.append("tspan")
            .style("text-anchor", "middle")

const show_comparador_b = (data) => {

    escalaY_comp_b
        .domain(data.map((d) => d.index))
        .range([ 0, height_comp])
        .padding(.1)

    //console.log(data)
    xAxis_b.call(d3.axisBottom(escalaX_comp_b).ticks(4));
    yAxis_b.call(d3.axisLeft(escalaY_comp_b));

    g_b
        .selectAll("rect")
            .data(data)
            .join(
                (enter) => {
                    enter
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_b(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_b.bandwidth())
                        .attr("fill", (d) => COLORS[data.indexOf(d)])
                        .on("mouseover", (_, d) => {
                            tooltipTextX_b.text(`${parseInt(d.N_Baños)}`)
                            tooltipG_b.attr("display", true)
                                .attr('transform', `translate(${30 + (escalaX_comp_b(parseInt(d.N_Baños)))},
                                                              ${20 + escalaY_comp_b(d.index) + (escalaY_comp_b.bandwidth()/2)})`)
                        })
                        .on("mouseleave", () => {
                            tooltipG_b.attr("display", "none");
                        })
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_b(d.index))
                        .attr("width", (d) => escalaX_comp_b(d.N_Baños))
                        .attr("height", escalaY_comp_b.bandwidth())
                },
                (update) => {
                    update
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_b(d.index))
                        .transition()
                        .duration(1000)
                        .attr("width", (d) => escalaX_comp_b(d.N_Baños))
                        .attr("height", escalaY_comp_b.bandwidth())

                },
                (exit) => {
                    exit
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_b(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_b.bandwidth())
                        .remove()
                }
            )

}

// e
const comparador_svg_e = d3.select('svg#comparador-svg-e')
                            .attr('width', WIDTH_COMP)
                            .attr('height', HEIGHT_COMP);

const g_e = comparador_svg_e.append("g")
                        .attr('transform', `translate(${30}, ${20})`);

const escalaX_comp_e = d3.scaleLinear()
const escalaY_comp_e = d3.scaleBand()

const xAxis_e = comparador_svg_e.append("g")
                        .attr('transform', `translate(${30}, ${height_comp + 20})`);

const yAxis_e = comparador_svg_e.append("g")
                        .attr('transform', `translate(${30}, ${20})`);

const title_e = comparador_svg_e.append("text")
                        .attr('transform', `translate(${30}, ${15})`)
                        .text("Estacionamientos");
        
const tooltipG_e = comparador_svg_e.append('g')
            .attr("display", "none");

const tooltipText_e = tooltipG_e.append("text")
            .style("fill", "black")

const tooltipTextX_e = tooltipText_e.append("tspan")
            .style("text-anchor", "middle")

const show_comparador_e = (data) => {

    escalaY_comp_e
        .domain(data.map((d) => d.index))
        .range([ 0, height_comp])
        .padding(.1)

    //console.log(data)
    xAxis_e.call(d3.axisBottom(escalaX_comp_e).ticks(4));
    yAxis_e.call(d3.axisLeft(escalaY_comp_e));

    g_e
        .selectAll("rect")
            .data(data)
            .join(
                (enter) => {
                    enter
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_e(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_e.bandwidth())
                        .attr("fill", (d) => COLORS[data.indexOf(d)])
                        .on("mouseover", (_, d) => {
                            tooltipTextX_e.text(`${parseInt(d.N_Estacionamientos)}`)
                            tooltipG_e.attr("display", true)
                                .attr('transform', `translate(${30 + (escalaX_comp_e(parseInt(d.N_Estacionamientos)))},
                                                              ${20 + escalaY_comp_e(d.index) + (escalaY_comp_e.bandwidth()/2)})`)
                        })
                        .on("mouseleave", () => {
                            tooltipG_e.attr("display", "none");
                        })
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_e(d.index))
                        .attr("width", (d) => escalaX_comp_e(d.N_Estacionamientos))
                        .attr("height", escalaY_comp_e.bandwidth())
                },
                (update) => {
                    update
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_e(d.index))
                        .transition()
                        .duration(1000)
                        .attr("width", (d) => escalaX_comp_e(d.N_Estacionamientos))
                        .attr("height", escalaY_comp_e.bandwidth())

                },
                (exit) => {
                    exit
                        .transition()
                        .duration(1000)
                        .attr("x", 0)
                        .attr("y", (d) => escalaY_comp_e(d.index))
                        .attr("width", (d) => 0)
                        .attr("height", escalaY_comp_e.bandwidth())
                        .remove()
                }
            )

}
// Consfiguración Rango Precios.
// ref= https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518

const width_slider = WIDTH_MAP;
const height_slider = 30;
const slider_size = 450

const slider = document.getElementById("valor-range");

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
                        .text('Selecciona un Máximo de UF.')

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

// tooltipMapa

const tooltipG_map = svg.append('g')
                .attr("display", "none");
    
tooltipG_map.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 100)
                .attr("height", 50)
                .attr("rx", 20)
                .style("fill", "lightgray")
                .style("stroke", "black")
                .style("border-radius", "5%")

const tooltipText_map = tooltipG_map.append("text")
                .style("fill", "black")

const tooltipTextX_map = tooltipText_map.append("tspan")
                .attr("x", 5)
                .attr("y", 30)


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
                        .attr("id", function(d){
                            const id_str = `c${d.index}`
                            return id_str
                        })
                        .attr("cx", d => proyeccion([d.longitude, d.latitude])[0])
                        .attr("cy", d => proyeccion([d.longitude, d.latitude])[1])
                        .attr("r", 8/CURRENT_ZOOM)
                        .attr("opacity", 0)
                        .on("click", function(_, d){
                            if(!(DATA_COMPARE.includes(d))){
                                if (DATA_COMPARE.length==2){
                                    DATA_COMPARE.splice(0, 1)
                                }
    
                                DATA_COMPARE.push(d)
                                
                                d3.selectAll("circle.casa")
                                    .attr("fill", "black")
                                    .attr("opacity", 0.5)
    
                                for (c in DATA_COMPARE){
                                    const tmp_index = `#c${DATA_COMPARE[c].index}`
                                    d3.select(tmp_index)
                                        .attr("fill", COLORS[c])
                                        .attr("opacity", 1)
                                    
                                }
    
                                show_comparador_uf(DATA_COMPARE)
                                show_comparador_m2(DATA_COMPARE)
                                show_comparador_m2c(DATA_COMPARE)
                                show_comparador_h(DATA_COMPARE)
                                show_comparador_b(DATA_COMPARE)
                                show_comparador_e(DATA_COMPARE)
                            }
                        })
                        .on("mouseover", function(e, d){
                            tooltipTextX_map.text(`Index: ${d.index}`)
                            tooltipG_map.attr("display", true)
                                .attr('transform', `translate(${MARGIN.left},
                                                              ${10})`)
                        })
                        .on("mouseout", function(){
                            tooltipG_map.attr("display", "none");
                        })
                        .transition()
                        .duration(1000)
                        .attr("fill", "black")
                        .attr("opacity", 0.5)
                
            },
            (update) => {
                update
                    .attr("id", function(d){
                        const id_str = `c${d.index}`
                        return id_str
                    })
            },
            (exit) => {
                exit
                .transition()
                .duration(1000)
                .attr("opacity", 0)
                .remove()
            })
}



// Cargamos los datos de las casas.
d3.json("data/data.json")
    .then((data) => {

        DATA_CASAS_PLANOS = data.reduce((cur, acc) => [...cur, ...acc.data], []);
        const empty = []


        for(d of DATA_CASAS_PLANOS){
            d.index = DATA_CASAS_PLANOS.indexOf(d);
        };

        slider.onchange = () => {

            show_comparador_uf(empty)
            show_comparador_m2(empty)
            show_comparador_m2c(empty)
            show_comparador_h(empty)
            show_comparador_b(empty)
            show_comparador_e(empty)

            DATA_COMPARE = []

            d3.selectAll("circle.casa")
                .attr("fill", "black")
                .attr("opacity", 0.5)

            show_casas(DATA_CASAS_PLANOS, slider.value);
        
            d3.select('#text-range')
                .text(`[ ${MIN_VALOR} UF , ${slider.value} UF ]`)
        
        };

        MAX_VALOR = d3.max(DATA_CASAS_PLANOS.map((d) => parseInt(d.Valor_UF)));
        MIN_VALOR = d3.min(DATA_CASAS_PLANOS.map((d) => parseInt(d.Valor_UF)));

        const max_valor_m2 = d3.max(DATA_CASAS_PLANOS.map((d) => parseInt(d.Total_Superficie_M2)));
        const max_valor_m2c = d3.max(DATA_CASAS_PLANOS.map((d) => parseInt(d.Superficie_Construida_M2)));
        const max_valor_h = d3.max(DATA_CASAS_PLANOS.map((d) => parseInt(d.N_Habitaciones)));
        const max_valor_b = d3.max(DATA_CASAS_PLANOS.map((d) => parseInt(d.N_Baños)));
        const max_valor_e = d3.max(DATA_CASAS_PLANOS.map((d) => parseInt(d.N_Estacionamientos)));
        
        escalaX
            .domain([MIN_VALOR, MAX_VALOR])
            .range([0, 450]);
        
        escalaX_comp_uf 
            .domain([0, MAX_VALOR])
            .range([0, width_comp-40])

        escalaX_comp_m2
            .domain([0, max_valor_m2])
            .range([0, width_comp-40])

        escalaX_comp_m2c
            .domain([0, 10000])
            .range([0, width_comp-40])
        
        escalaX_comp_h
            .domain([0, max_valor_h])
            .range([0, width_comp-40])
        
        escalaX_comp_b
            .domain([0, max_valor_b])
            .range([0, width_comp-40])
        
        escalaX_comp_e
            .domain([0, max_valor_e])
            .range([0, width_comp-40])

        show_comparador_uf(empty)
        show_comparador_m2(empty)
        show_comparador_m2c(empty)
        show_comparador_h(empty)
        show_comparador_b(empty)
        show_comparador_e(empty)

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
