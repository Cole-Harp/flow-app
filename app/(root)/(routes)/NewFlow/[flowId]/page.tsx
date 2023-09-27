"use client";

import React, { useEffect, useState } from "react";
import { Node, Edge } from "reactflow";
import { updateFlow } from "@/lib/serv-actions/Flow";
import ReactFlowWrapper from "@/components/Flow/FlowComponent";
import { Button, Menu, MenuItem } from "@mui/material";

const nodes: Node[] = [
  {
    id: "1",
    type: "blockNode",
    position: { x: 100, y: 100 },
    data: {},
    hidden: false,
  },
  {
    id: "2",
    type: "blockNode",
    position: { x: 400, y: 100 },
    data: {},
    hidden: false,
  },
];

const edges: Edge[] = [
  {
    id: "1",
    source: "1",
    target: "2",
    type: "blockNode",
    data: {},
  },
];

const templates = [
  {
    name: "Template 1",
    borderColor: "red",
    nodes: nodes,
    edges: edges,
  },
  {
    name: "Template 2",
    borderColor: "green",
    nodes: [
      {
        id: "1",
        type: "blockNode",
        position: { x: 100, y: 200 },
        data: {},
        hidden: false,
      },
      {
        id: "2",
        type: "blockNode",
        position: { x: 400, y: 300 },
        data: {},
        hidden: false,
      },
      // Add your nodes here for Template 2
    ],
    edges: [
      // Add your edges here for Template 2
    ],
  },
  {
    name: "Template 3",
    borderColor: "blue",
    nodes: [
      // Add your nodes here for Template 3
    ],
    edges: [
      // Add your edges here for Template 3
    ],
  },
];


export default function Flow(context: { params: { flowId: string; }; }) {
  const { flowId } = context.params as { flowId: string };
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number | null>(null);
  const [flow, setFlow] = useState<{ nodes: string; edges: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  const handleTemplateSelection = (templateIndex: number) => {
    setSelectedTemplateIndex(templateIndex);
    setAnchorEl(null);
  };

  const handleTemplateChoice = () => {
    updateFlow(flowId, flow.nodes, flow.edges)
  };

  useEffect(() => {
    if (selectedTemplateIndex !== null) {
      const selectedTemplate = templates[selectedTemplateIndex];
      const nodes = JSON.stringify(selectedTemplate.nodes);
      const edges = JSON.stringify(selectedTemplate.edges);
      setFlow({ nodes, edges });
    } else {
      setFlow(null);
    }
  }, [selectedTemplateIndex]);

  return (
    <div className=" h-1/2 p-5 relative">
      <Button
        
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Select a template
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {templates.map((template, index) => (
          <MenuItem key={template.name} onClick={() => handleTemplateSelection(index)}>
            {template.name}
          </MenuItem>
        ))}
      </Menu>
      {selectedTemplateIndex !== null && (
        <Button
          className="{classes.button}"
          onClick={() => handleTemplateChoice()}
        >
          Use template
        </Button>
      )}
      {flow && (
        <div className="border border-border nodrag nopan nozoom">
          <ReactFlowWrapper key={selectedTemplateIndex} nodes={flow.nodes} edges={flow.edges} />
        </div>
      )}
    </div>
  );
}