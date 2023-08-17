//Hook
import { useState } from "react";
import { FlowInstance } from "@prisma/client";

type UseFlowInstancesResult = {
  flowInstances: FlowInstance[];
  setFlowInstances: (flowInstances: FlowInstance[] | null) => void;
};

export function useFlowInstances(initialFlowInstances: FlowInstance[]): UseFlowInstancesResult {
  const [flowInstances, setFlowInstances] = useState(initialFlowInstances);

  const updateFlowInstances = (updatedInstances: FlowInstance[]) => {
    setFlowInstances(updatedInstances);
  };

  return {
    flowInstances,
    setFlowInstances: updateFlowInstances,
  };
}
