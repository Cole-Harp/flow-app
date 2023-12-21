
import ReactFlowWrapper from "../../../../components/Flow/FlowComponent";
import { getFlow } from "../../../../lib/serv-actions/Flow";

export default async function Flow(context: { params: { flowId: string; }; }) {
  const { flowId } = context.params as { flowId: string };
  const fetchedFlow = await getFlow(flowId);

  return (

      <ReactFlowWrapper {...fetchedFlow} />

  );
}

