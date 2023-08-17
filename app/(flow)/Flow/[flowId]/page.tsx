"use client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import ReactFlowWrapper from "../../../../components/Flow/FlowComponent";
import { getFlow } from "../../../../lib/serv-actions/getFlow";
import Providers from "../../../providers";
// Add this import
import { defaultFontMapper, displayFontMapper } from "@/app/styles/fonts";
import { cn } from "@/lib/utils";


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
    <ReactFlowWrapper {...flow} />



  );
}

