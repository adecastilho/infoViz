function main() {
    treeMap()
    heatMap()
}

function heatMap() {
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
    const oldSvg = d3.select('#heat')
        .select("svg")
        .remove()

    // append the svg object to the body of the page
    const svg = d3.select("#heat")
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

function treeMap() {

    // clear if re-rendering
    var elements = ["#t1", '#t2', '#t3', '#t4', '#treeLegend']
    elements.forEach(e => {
        d3.select(e)
            .select("svg")
            .remove()
    })


    var type = document.querySelector('input[name="radAnswer"]:checked').value;
    console.log(type)
    const elem = document.getElementsByTagName("body")
    const bodyColor = window.getComputedStyle(elem[0], null).getPropertyValue("background-color");
    // get year from input
    //var year = document.getElementById("yearInput").value


    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 0, bottom: 40, left: 0},
        width = 1820 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        legendHeight = 120;

    var myColor

// append the svg object to the body of the page
    var svg1 = d3.select("#t1")
        .append("svg")
        .attr("width", width/4  )
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var svg2 = d3.select("#t2")
        .append("svg")
        .attr("width", width/4 )
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var svg3 = d3.select("#t3")
        .append("svg")
        .attr("width", width/4 )
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var svg4 = d3.select("#t4")
        .append("svg")
        .attr("width", width/4 )
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var svgLegend = d3.select("#treeLegend")
        .append("svg")
        .attr("width", width)
        .attr("height", legendHeight)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + ", 0)");

    function getSvgForIndex(i) {
        switch(i) {
            case 0:
                return svg1
            case 1:
                return svg2
            case 2:
                return svg3
            case 3:
                return svg4
        }
    }

    //Read the data
    d3.csv("treeMapData.csv").then(function (data) {

        // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
        var categories = Array.from(new Set(data.map(d => d.Category)))
        categories = categories.filter(c => c != 'Origin')
        myColor = d3.scaleOrdinal().domain(categories)
            .range(d3.schemeSet3);

        var tData = []
        var years = [2018, 2019, 2020, 2021]
        years.forEach((year, index) => {
            switch (type) {
                case "all":
                    tData[index] = filterOpenInYear(data, year)
                    break
                case "new":
                    tData[index] = filterIssuedInYear(data, year)
                    break
                case "closed":
                    tData[index] = filterExpiredInYear(data, year)
            }
            tData[index] = countByCategoryForTree(tData[index], categories)
        })

        tData.forEach( (data, index) => {
            const root = d3.hierarchy(data).sum( d =>  d.Count);
            // Then d3.treemap computes the position of each element of the hierarchy
            // The coordinates are added to the root object above
            d3.treemap()
                .size([width/4, height])
                .padding(4)
                (root)

            getSvgForIndex(index)
                .selectAll("rect")
                .data(root.leaves())
                .enter()
                .append("rect")
                .attr('x', function (d) {
                    return d.x0; })
                .attr('y', function (d) { return d.y0; })
                .attr('width', function (d) { return d.x1 - d.x0; })
                .attr('height', function (d) { return d.y1 - d.y0; })
                .style("stroke", "black")
                .style("fill", function(d){
                    return myColor(d.data.Category)} )

            // and to add the text labels
            getSvgForIndex(index)
                .selectAll("text")
                .data(root.leaves())
                .enter()
                .append("text")
                .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
                .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
                .text(function(d){ return (d.data.Count) ? (d.data.Count) : "" })
                .attr("font-size", "15px")
                .attr("fill", "black")

            getSvgForIndex(index)
                .append("text")
                .attr("x", 10)
                .attr("y", -10)
                .text(() => {
                    switch(index) {
                        case 0:
                        case 1:
                            return years[index] + " (Pre-Covid)"
                        default:
                            return years[index] + " (Covid Pandemic)"
                    }

                })
                .attr("font-size", "30px")
                .attr("fill",  "grey" )

        })

        //create legend

        const legendPadding = {
            left: 30,
            top:  10
        };
        const legendRectSizes = {
            width:  30,
            height: 30
        }

        const x = svgLegend.append("g")
            .attr("id", "legend");

        x.append("rect")
            .attr("y", legendRectSizes.height)
            .attr("width", width)
            .attr("height", legendRectSizes.height * 2)
            .attr("fill", bodyColor)

        x.append("g").selectAll("rect")
            .attr("id","legend")
            .data(tData[0].children)
            .enter()
            .append("rect")
            .attr("class", "legend-item")
            .attr("y", legendRectSizes.height )
            .attr("x", (d,i  ) => {
                return (legendPadding.left + 120 ) * i - categories[i].length + 20

            })
            .attr("width", legendRectSizes.width)
            .attr("height", legendRectSizes.height)
            .attr("fill", function(d){
                return myColor(d.Category)} )

        x.append("g").selectAll("text")
            .data(tData[0].children )
            .enter().append("text")
            .attr("font-size", "16px")
            .attr("fill",  "#465353")
            .attr("y", legendRectSizes.height * 2.5)
            .attr("x", (d,i ) => (legendPadding.left + 120 )  * i - categories[i].length + 20)
            .text( d => {
                return d.Category
            })

    })



}



// helper functions

function filterOpenInYear(data, year) {
    return data.filter(d => d.IssuedYear <= year && d.ExpiredYear >= year)
}

function filterIssuedInYear(data, year) {
    return data.filter(d => d.IssuedYear == year)
}

function filterExpiredInYear(data, year) {
    const filtered = data.filter(d => d.ExpiredYear == year)
    return filtered
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

function countByCategoryForTree(data, categories) {
    var countList = []

    categories.forEach(c => {
        var count = data.filter(d => d.Category == c).length
        countList.push({Category: c, Count: count, Parent: "Origin"})
    })

    return {Category: "Origin", children: countList}
}

