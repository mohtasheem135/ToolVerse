"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import useMounted from "@/hooks/useMounted";

const TreeVisualizer = () => {
  const mounted = useMounted();

  const svgRef = useRef(null); // Reference to the SVG container
  const [treeData, setTreeData] = useState(null);
  const [traversal, setTraversal] = useState([]);
  const [input, setInput] = useState(""); // For user input

  // Function to parse the user input into tree data
  const parseInputToTree = (input) => {
    const nodesMap = {};
    const inputArray = input.split(";");

    inputArray.forEach((nodeData) => {
      const [parent, children] = nodeData.split("->");
      const parentNode = parent.trim();
      const childNodes = children
        ? children.split(",").map((child) => child.trim())
        : [];

      if (!nodesMap[parentNode]) {
        nodesMap[parentNode] = { name: parentNode, children: [] };
      }
      childNodes.forEach((child) => {
        if (!nodesMap[child]) {
          nodesMap[child] = { name: child, children: [] };
        }
        nodesMap[parentNode].children.push(nodesMap[child]);
      });
    });

    return nodesMap[Object.keys(nodesMap)[0]]; // Return the root node
  };

  // Function to draw the tree using D3.js
  const drawTree = (data) => {
    const svg = d3.select(svgRef.current);
    const width = 500; // Dynamically get the width of the SVG container
    const height = 500; // Dynamically get the height of the SVG container

    const margin = { top: 20, right: 320, bottom: 20, left: 10 };
    const treeWidth = width - margin.left - margin.right;
    const treeHeight = height - margin.top - margin.bottom;

    svg.attr("width", width).attr("height", height);

    // Clear any previous tree drawing
    svg.selectAll("*").remove();

    // Set the tree layout
    const treeLayout = d3.tree().size([treeHeight, treeWidth]);

    // Create the root node
    const root = d3.hierarchy(data);
    const treeNodes = treeLayout(root);

    // Create the links (lines between nodes)
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll("line")
      .data(treeNodes.links())
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x + margin.left)
      .attr("y1", (d) => d.source.y + margin.top)
      .attr("x2", (d) => d.target.x + margin.left)
      .attr("y2", (d) => d.target.y + margin.top)
      .attr("stroke", "#aaa");

    // Create the nodes (circles)
    const nodes = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll("circle")
      .data(treeNodes.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x + margin.left)
      .attr("cy", (d) => d.y + margin.top)
      .attr("r", 10)
      .attr("fill", "#000099");

    // Create text labels for the nodes
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll("text")
      .data(treeNodes.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x + margin.left-7)
      .attr("y", (d) => d.y + margin.top - 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text((d) => d.data.name);
  };

  // Traversal algorithms
  const bfsTraversal = () => {
    if (!treeData) return;

    let queue = [treeData];
    let visited = [];
    let order = [];

    const interval = setInterval(() => {
      if (queue.length > 0) {
        let node = queue.shift();
        visited.push(node.name);
        order.push(node.name);

        // Add children to queue
        if (node.children) {
          queue.push(...node.children);
        }

        // Highlight the node
        const highlightedNodes = d3.select(svgRef.current).selectAll("circle");
        highlightedNodes.attr("fill", (d) =>
          order.includes(d.data.name) ? "red" : "#69b3a2"
        );
      } else {
        clearInterval(interval);
        setTraversal(order); // Update traversal state
      }
    }, 500); // Delay for animation effect
  };

  const dfsTraversal = () => {
    if (!treeData) return;

    let stack = [treeData];
    let visited = [];
    let order = [];

    const interval = setInterval(() => {
      if (stack.length > 0) {
        let node = stack.pop();
        visited.push(node.name);
        order.push(node.name);

        // Add children to stack (right first to maintain left-to-right order)
        if (node.children) {
          stack.push(...node.children.reverse());
        }

        // Highlight the node
        const highlightedNodes = d3.select(svgRef.current).selectAll("circle");
        highlightedNodes.attr("fill", (d) =>
          order.includes(d.data.name) ? "blue" : "#69b3a2"
        );
      } else {
        clearInterval(interval);
        setTraversal(order); // Update traversal state
      }
    }, 500); // Delay for animation effect
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleGenerateTree = () => {
    const generatedTree = parseInputToTree(input);
    setTreeData(generatedTree);
    drawTree(generatedTree); // Redraw the tree
  };
  
  const handleReset = (e) => {
    e.preventDefault();
    setTreeData(null);
    setTraversal([]);
    setInput("")
    const generatedTree = parseInputToTree("");
    drawTree(generatedTree); // Redraw the tree

  };

  if (!mounted) return null;
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-3">
        Tree Traversal Visualization
      </h1>
      <div className="flex">
        <div className="w-1/2">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter tree structure (e.g., 1 -> 2,3; 2 -> 4,5)"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleGenerateTree}
            >
              Generate
            </button>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={bfsTraversal}
              >
                BFS Traversal
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={dfsTraversal}
              >
                DFS Traversal
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
            {traversal.length > 0 ? (
              <div className="px-2 py-1 bg-green-400 w-[300px] rounded">
                <h2>Traversal Result:</h2>
                <p>{traversal.join(" -> ")}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="w-1/2">
          <svg
            className="ml-4"
            ref={svgRef}
          ></svg>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizer;
