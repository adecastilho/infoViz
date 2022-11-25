function main2() {

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
        legendHeight = 200;

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
            tData[index] = filterExpiredInYear(data, year)
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
                .text(function(d){ return d.data.Count})
                .attr("font-size", "15px")
                .attr("fill", "white")

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

