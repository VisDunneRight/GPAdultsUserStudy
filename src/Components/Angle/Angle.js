import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import useResizeObserver from "../useResizeObserver";
import "./style.css";

const margin = { top: 20, right: 30, bottom: 30, left: 30 };
const cordLength = 80;
const xPos = 100;
const yPos = 100;

const drawAngle = (g, svg, data, translate, name, symbol) => {
  const radialLineGen = d3.lineRadial();
  const axisLine = radialLineGen(data);
  g.selectAll(".path_" + name)
    .data([data])
    .join("path")
    .attr("class", "path_" + name)
    .attr("d", axisLine)
    .attr("fill", "none")
    .attr("stroke", "black");

  svg
    .selectAll(".path_" + name)
    .attr("transform", `translate(${translate[0]}, ${translate[1]})`);

  g.selectAll(".mytooltip_" + name)
    .data([translate])
    .join("text")
    .style("opacity", 1)
    .attr("class", "mytooltip_" + name)
    .text((d) => symbol)
    .attr("x", (d) => d[0])
    .attr("y", (d) => d[1] + cordLength + margin.bottom / 2 + 4)
    .attr("text-anchor", "middle");
};

const Angle = ({ question, domain }) => {
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

    const radians = (value) => {
      return (value * Math.PI) / 180;
    };

    let data = [];
    if (question.sizes[2] === 0) {
      data.push([radians(question.sizes[3]), cordLength]);
      data.push([radians(question.sizes[3]), 0]);
      data.push([radians(question.sizes[3] + question.sizes[0]), cordLength]);
      data.push([radians(question.sizes[4]), cordLength]);
      data.push([radians(question.sizes[4]), 0]);
      data.push([radians(question.sizes[4] + question.sizes[1]), cordLength]);
      drawAngle(g, svg, data.slice(0, 3), [xPos, yPos], "radial1", "100");
      drawAngle(
        g,
        svg,
        data.slice(3, 6),
        [xPos + cordLength * 2.1, yPos],
        "radial2",
        "?"
      );
    } else {
      data.push([radians(question.sizes[4]), cordLength]);
      data.push([radians(question.sizes[4]), 0]);
      data.push([radians(question.sizes[4] + question.sizes[1]), cordLength]);
      data.push([radians(question.sizes[3]), cordLength]);
      data.push([radians(question.sizes[3]), 0]);
      data.push([radians(question.sizes[3] + question.sizes[0]), cordLength]);
      drawAngle(g, svg, data.slice(0, 3), [xPos, yPos], "radial1", "?");
      drawAngle(
        g,
        svg,
        data.slice(3, 6),
        [xPos + cordLength * 2.1, yPos],
        "radial2",
        "100"
      );
    }
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

export default Angle;
