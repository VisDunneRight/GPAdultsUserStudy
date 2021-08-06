import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import useResizeObserver from "../useResizeObserver";
import "./style.css";

const margin = { top: 20, right: 30, bottom: 30, left: 30, between: 50 };
const chartWidth = 400;
const posX = 50;
const generatePlot = (svg, question, leftTop, rightBottom, name) => {
  //Grab the svg and set its viewbox
  const g = svg.select("g");
  const axis = [
    [leftTop[0], leftTop[1]],
    [leftTop[0], rightBottom[1]],
    [rightBottom[0], rightBottom[1]],
  ];
  let data = [];
  data.push([posX, rightBottom[1] - question[0], question[1]]);

  // Data rename
  g.selectAll(".point_" + name)
    .data(data)
    .join("circle")
    .attr("class", "point_" + name)
    .attr("stroke", "#000")
    .attr("cx", (d) => d[0])
    .attr("cy", (d) => d[1])
    .attr("fill", "black")
    .attr("r", 5);

  const axisLine = d3.line();
  g.selectAll(".path_" + name)
    .data([axis])
    .join("path")
    .attr("class", "path_" + name)
    .attr("d", (value) => axisLine(value))
    .attr("fill", "none")
    .attr("stroke", "black");

  g.selectAll(".mytooltip_" + name)
    .data(data)
    .join("text")
    .style("opacity", 1)
    .attr("class", "mytooltip_" + name)
    .text((d) => d[2])
    .attr("x", (d) => {
      return d[0];
    })
    .attr("y", (d) => d[1] - 10)
    .attr("text-anchor", "middle");
};

const Poua = ({ question, domain }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (!question) return;
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();
    // if(!properties) return;
    const svg = d3.select(svgRef.current);
    svg.attr("viewBox", [0, 0, width, height]);
    let data = [];
    if (question.sizes[2] === 0) {
      data.push([question.sizes[0], "100"]);
      data.push([question.sizes[1], "?"]);
    } else {
      data.push([question.sizes[1], "?"]);
      data.push([question.sizes[0], "100"]);
    }
    generatePlot(
      svg,
      data[0],
      [margin.left, margin.top],
      [margin.left + chartWidth, domain[1] + margin.top],
      "chart1"
    );
    generatePlot(
      svg,
      data[1],
      [margin.left, domain[1] + margin.top + margin.between],
      [margin.left + chartWidth, domain[1] * 2 + margin.top + margin.between],
      "chart2"
    );
  }, [dimensions, domain, question]);

  return (
    <div
      ref={wrapperRef}
      style={{
        marginBottom: "2rem",
        width: chartWidth,
        height: domain[1] * 2 + margin.top + margin.bottom + margin.between,
      }}
    >
      <svg ref={svgRef}>
        <g />
      </svg>
    </div>
  );
};

export default Poua;
