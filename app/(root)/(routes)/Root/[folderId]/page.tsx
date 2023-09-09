

import { SearchInput } from "@/components/flow_dashboard/Dashboard_Ui/search-input";

import prisma_db from "@/lib/prisma_db";
import { Folders } from "@/components/flow_dashboard/Dashboard_Ui/folders";
import { FindOrCreateUser } from "@/lib/serv-actions/findOrCreateUser";

import Flow_Dashboard from "@/components/flow_dashboard/dashboard";
import { useEffect, useState } from "react";
import RootDashboard from "@/components/RootDashboard.tsx/dashboard";
import { getFolder } from "@/lib/serv-actions/getFolder";
import { stringify } from "querystring";





  
  export default  async function Flow(context: { params: { folderId: string; }; }) {
    const { folderId } = context.params as { folderId: string };
    console.log(folderId)

  
  const id= (await FindOrCreateUser()).clerkUserId;
    console.log(folderId, "HEREHERHE")


    const folder = await getFolder(folderId);
    if (!folder) {
      return <div>Loading...</div>;
    }
  

  const folder_flows = await prisma_db.flowInstance.findMany({
    where: {
        
      folderId: folderId,
      userId: id
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const folder_docs = await prisma_db.doc.findMany({
    where: {
        
      folderId: folderId,
      userId: id
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedFlows = Array.isArray(folder_flows) ? folder_flows.map((folder_flows) => ({
    ...folder_flows,
  })) : [];


  const serializedDocs = Array.isArray(folder_docs) ? folder_docs.map((doc) => ({
    ...doc,
  })) : [];




  return (
    <div style={{ marginLeft: "20px", marginRight: "20px" }}>
      {/* <SearchInput />
      <Folders data={folders}/>
      <Flows data={folder_contents} /> */}
      <RootDashboard initial_folder = {folder} initial_flows = {serializedFlows} initial_docs={serializedDocs} />
    </div>
  );
};


