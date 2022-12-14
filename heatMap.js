function main() {
    // get year from input
    var year = document.getElementById("yearInput").value
    var selectedNs = [...document.getElementById("neighbourhoodInput").options]
        .filter(option => option.selected)
        .map(option => option.value)
    var selectedCs = [...document.getElementById("categoryInput").options]
        .filter(option => option.selected)
        .map(option => option.value)

    // set the dimensions and margins of the graph
    const margin = {top: 80, right: 25, bottom: 150, left: 150},
        width = 210 + (40 * selectedCs.length) - margin.left - margin.right,
        height = 260 + (40 * selectedNs.length) - margin.top - margin.bottom,
        full_width = 210 + 360

    // clear if re-rendering
    const oldSvg = d3.select('#my_dataviz')
        .select("svg")
        .remove()

    // append the svg object to the body of the page
    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", full_width )
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Read the data
    // d3.csv("2021countByNeighbourhoodCategory.csv").then(function (data) {
    d3.csv("victoria_data_better_categories.csv").then(function (data) {

        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        var categories = Array.from(new Set(data.map(d => d.Category)))
            .filter(c => selectedCs.includes(c))
        var neighbourhoods = Array.from(new Set(data.map(d => d.Neighbourhood)))
            .filter(n => selectedNs.includes(n))

        data = filterOpenInYear(data, year)
        data = countByNeighbourhoodCategory(data, categories, neighbourhoods)
        
        // Build X scales and axis:
        const x = d3.scaleBand()
            .range([0, width])
            .domain(categories)
            .padding(0.05);
        svg.append("g")
            .attr("id", "x-labels")
            .style("font-size", 15)
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain").remove()
        d3.select("#x-labels")
            .selectAll("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-75)")


        // Build Y scales and axis:
        const y = d3.scaleBand()
            .range([height, 0])
            .domain(neighbourhoods)
            .padding(0.05);
        svg.append("g")
            .style("font-size", 15)
            .call(d3.axisLeft(y).tickSize(0))
            .select(".domain").remove()

        // Build color scale
        var myColor = d3.scaleLinear()
            .range(["white", "#69b3a2"])
            .domain([1, 100])

        // create a tooltip
        const tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            .style("position", "absolute")
            .style("width", "auto")

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function (event, d) {
            tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)
        }
        const mousemove = function (event, d) {
            tooltip
                .html("The exact value of<br>this cell is: " + d.Count)
                .style("left", (event.x) + 20 + "px")
                .style("top", (event.y) + 20 + "px")
        }
        const mouseleave = function (event, d) {
            tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
        }

        // add the squares
        svg.selectAll()
            .data(data, function (d) {
                return d.Category + ':' + d.Neighbourhood;
            })
            .join("rect")
            .attr("x", function (d) {
                return x(d.Category)
            })
            .attr("y", function (d) {
                return y(d.Neighbourhood)
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) {
                return myColor(d.Count)
            })
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    })

    // Add title to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -50)
        .attr("text-anchor", "left")
        .style("font-size", "22px")
        .text(year);

    // Add subtitle to graph
    svg.append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "left")
        .style("font-size", "14px")
        .style("fill", "grey")
        .style("max-width", 400)
        .text("Number of businesses by neighbourhood and category");
}

function filterOpenInYear(data, year) {
    return data.filter(d => d.IssuedYear <= year && d.ExpiredYear >= year)
}

function filterIssuedInYear(data, year) {
    return data.filter(d => d.IssuedYear == year)
}

function filterExpiredInYear(data, year) {
    return data.filter(d => d.ExpiredYear == year)
}

function countByNeighbourhoodCategory(data, categories, neighbourhoods) {
    var countList = []
    neighbourhoods.forEach(n => {
        categories.forEach(c => {
            var count = data.filter(d => d.Category == c && d.Neighbourhood == n)
                .length
            countList.push({Category: c, Neighbourhood: n, Count: count})
        })
    })
    return countList
}