"use client";

import React, { useEffect, useState } from "react";
import ReactFlowWrapper from "../../../../components/Flow/FlowComponent";
import { getFlow } from "../../../../lib/serv-actions/getFlow";






export default function Flow(context: { params: { flowId: string; }; }) {
  const { flowId } = context.params as { flowId: string };
  const [flow, setFlow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFlow = await getFlow(flowId);
      setFlow(fetchedFlow);
    };

    fetchData();
  }, [flowId]);

  if (!flow) {
    return <div>Loading...</div>;
  }

  // Wrap the ReactFlowWrapper component with AppContext.Consumer
  return (
      <div className="dark:border-inherit text-inherit to-inherit">
        <ReactFlowWrapper {...flow} />
      </div>

  );
}

