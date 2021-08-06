import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import useResizeObserver from "../useResizeObserver";
import "./style.css";

const margin = { top: 20, right: 30, bottom: 30, left: 30 };

const posX = [150, 420];
const posY = [150, 150];

const Area = ({ question, domain }) => {
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
    const chartHeight = domain[1] * 2 + margin.top;
    let data = [];
    if (question.sizes[2] === 0) {
      data.push([posX[0], chartHeight - posY[0], question.sizes[0], "100"]);
      data.push([posX[1], chartHeight - posY[1], question.sizes[1], "?"]);
    } else {
      data.push([posX[0], chartHeight - posY[0], question.sizes[1], "?"]);
      data.push([posX[1], chartHeight - posY[1], question.sizes[0], "100"]);
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
      .attr("r", (d) => d[2]);

    g.selectAll(".mytooltip")
      .data(data)
      .join("text")
      .style("opacity", 1)
      .attr("class", "mytooltip")
      .text((d) => d[3])
      .attr("x", (d) => {
        return d[0];
      })
      .attr("y", (d) => height - margin.bottom)
      .attr("text-anchor", "middle");
  }, [dimensions, domain, question]);
  return (
    <div
      ref={wrapperRef}
      style={{
        marginBottom: "2rem",
        width: "600px",
        height: domain[1] * 2 + margin.top + margin.bottom,
      }}
    >
      <svg ref={svgRef}>
        <g />
      </svg>
    </div>
  );
};

export default Area;
