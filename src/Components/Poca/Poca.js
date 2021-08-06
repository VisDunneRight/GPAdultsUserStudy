import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import useResizeObserver from "../useResizeObserver";
import "./style.css";

const margin = { top: 20, right: 30, bottom: 30, left: 30 };
const posX = [50, 100];
const Poca = ({ question, domain }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    if (!question) return;
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();
    // if(!properties) return;

    //Grab the svg and set its viewbox
    const svg = d3.select(svgRef.current);
    svg.attr("viewBox", [0, 0, width, height]);
    const g = svg.select("g");
    const axis = [
      [margin.left, domain[0] + margin.top],
      [margin.left, domain[1] + margin.top],
      [width - margin.right, domain[1] + margin.top],
    ];
    let data = [];
    const chartHeight = domain[1] + margin.top;
    if (question.sizes[2] === 0) {
      data.push([posX[0], chartHeight - question.sizes[0], "100"]);
      data.push([posX[1], chartHeight - question.sizes[1], "?"]);
    } else {
      data.push([posX[0], chartHeight - question.sizes[1], "?"]);
      data.push([posX[1], chartHeight - question.sizes[0], "100"]);
    }

    //Data rename
    g.selectAll(".point")
      .data(data)
      .join("circle")
      .attr("class", "point")
      .attr("stroke", "#000")
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .attr("fill", "black")
      .attr("r", 5);

    const axisLine = d3.line();
    g.selectAll("path")
      .data([axis])
      .join("path")
      .attr("d", (value) => axisLine(value))
      .attr("fill", "none")
      .attr("stroke", "black");

    g.selectAll(".mytooltip")
      .data(data)
      .join("text")
      .style("opacity", 1)
      .attr("class", "mytooltip")
      .text((d) => d[2])
      .attr("x", (d) => {
        return d[0];
      })
      .attr("y", (d) => d[1] - 10)
      .attr("text-anchor", "middle");
  }, [dimensions, domain, question]);

  return (
    <div
      ref={wrapperRef}
      style={{
        marginBottom: "2rem",
        width: "400px",
        height: domain[1] + margin.top + margin.bottom,
      }}
    >
      <svg ref={svgRef}>
        <g />
      </svg>
    </div>
  );
};

export default Poca;
