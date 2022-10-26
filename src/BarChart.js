import React, {useEffect, useRef} from 'react'
import * as d3 from 'd3'

export const BarChart = () => {
    const ref = useRef()

    function drawBarChart(data){
        const canvasHeight = 600
        const canvasWidth = 800
        const scale = 20
        const borderColour = "gold"
        const fillColour = "teal"
        const svgCanvas = d3.select(ref.current)
            .append('svg')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight)
            .style('border', `1px solid ${borderColour}`)
        svgCanvas.selectAll('rect')
            .data(data).enter()
            .append('rect')
            .attr('width', 40)
            .attr('height', (datapoint) => datapoint * scale)
            .attr('fill', fillColour)
            .attr('x', (datapoint, iteration) => iteration * 45)
            .attr('y', (datapoint) => canvasHeight - datapoint * scale)
    }

    useEffect(() => {
        const data = [ 2, 4, 2, 6, 8 ]
        drawBarChart(data)
    }, [])

    return (
        <div ref={ref}></div>
    )
}
export default BarChart