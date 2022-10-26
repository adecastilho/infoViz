import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3'


export const BarChart = () => {
    const ref = useRef()

    // function getBizData() {
    //     const bizData = [];
    //     return new Promise((resolve, reject) => {
    //         createReadStream('./data/rawData.csv')
    //             .pipe(csv())
    //             .on('data', (data) => bizData.push(data))
    //             .on('end', () => {
    //                 console.log(bizData[0]);
    //
    //                 resolve( bizData.map(biz => ({
    //                         name: biz.Name,
    //                         category: biz.Category,
    //                         openedYear: biz.IssuedYear,
    //                         closedYear: biz.ExpiredYear,
    //                         openedIn2018: biz.IssuedYear == '2018' ? 1 : 0,
    //                         openedIn2019: biz.IssuedYear == '2019' ? 1 : 0,
    //                         openedIn2020: biz.IssuedYear == '2020' ? 1 : 0,
    //                         openedIn2021: biz.IssuedYear == '2021' ? 1 : 0,
    //                         closedIn2018: biz.ExpiredYear == '2018' ? 1 : 0,
    //                         closedIn2019: biz.ExpiredYear == '2019' ? 1 : 0,
    //                         closedIn2020: biz.ExpiredYear == '2020' ? 1 : 0,
    //                         closedIn2021: biz.ExpiredYear == '2021' ? 1 : 0
    //                     }))
    //                 )
    //                 //.filter(biz => biz.closedIn2020)
    //
    //             })
    //     })
    // }

    function drawBarChart(closedData, openedData){
        const canvasHeight = 600
        const canvasWidth = 800
        const scale = 1
        const borderColour = "gold"
        const fillColour = "teal"
        const svgCanvas = d3.select(ref.current)
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .style('border', `1px solid ${borderColour}`)
        svgCanvas.selectAll('rect')
            .data(closedData).enter()
            .append('rect')
            .attr('width', 40)
            .attr('height', (datapoint) => datapoint * scale)
            .attr('fill', fillColour)
            .attr('x', (datapoint, iteration) => iteration * 45)
            .attr('y', (datapoint) => canvasHeight - datapoint * scale)
    }

    useEffect(() => {
        // getBizData().then(r => {
        //     console.log(r)
        //     const yearsOfInterest = ['2018', '2019', '2020', '2021']
        //
        //     const openedYearCounts = r.reduce(function (d, row) {
        //         if (yearsOfInterest.includes(row.openedYear) ){
        //             d[row.openedYear] = ++d[row.openedYear] || 1;
        //         }
        //         return d;
        //     }, {});

            // const closedYearCounts = r.reduce(function (d, row) {
            //     if (yearsOfInterest.includes(row.closedYear) ) {
            //         d[row.closedYear] = ++d[row.closedYear] || 1;
            //     }
            //     return d;
            // }, {});
            //
            // const closedData = Object.values(closedYearCounts)
            // const openedData = Object.values(openedYearCounts)

            const closedData = [10, 200, 300, 500]
            const openedData = [200, 300, 400, 400]
            drawBarChart(closedData, openedData)
            //}
        //)
    }, [])

    return (
        <div ref={ref}></div>
    )
}
export default BarChart