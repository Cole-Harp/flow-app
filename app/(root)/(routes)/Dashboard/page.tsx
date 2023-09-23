import { SearchInput } from "@/components/flow_dashboard/Dashboard_Ui/search-input";

import prisma_db from "@/lib/prisma_db";
import { Folders } from "@/components/flow_dashboard/Dashboard_Ui/folders";
import { FindOrCreateUser } from "@/lib/serv-actions/findOrCreateUser";

import Flow_Dashboard from "@/components/flow_dashboard/dashboard";




interface DashboardPageProps {
  searchParams: {
    folderId: string;
    title: string;
  };
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  searchParams
  
  const id= (await FindOrCreateUser()).clerkUserId;
    console.log(id, "HEREHERHE")

  

  const folder_flows = await prisma_db.flowInstance.findMany({
    where: {
        
      folderId: searchParams.folderId,
      title: {
        search: searchParams.title,
      },
      userId: id
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const folder_docs = await prisma_db.doc.findMany({
    where: {
        
      folderId: searchParams.folderId,
      title: {
        search: searchParams.title,
      },
      userId: id
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const folders = await prisma_db.folder.findMany({
    where: {
        userId: id
    },
  });

  const serializedFlows = Array.isArray(folder_flows) ? folder_flows.map((folder_flows) => ({
    ...folder_flows,
  })) : [];


  const serializedFolders = Array.isArray(folders) ? folders.map((folder) => ({
    ...folder,
  })) : [];

  const serializedDocs = Array.isArray(folder_docs) ? folder_docs.map((doc) => ({
    ...doc,
  })) : [];


  console.log(folders, "FOLDERS")

  return (
    <div style={{ marginLeft: "40px", marginRight: "20px", marginTop: "25px" }}>
      <SearchInput />
      <Folders data={folders}/>
      {/* <Flows data={folder_contents} /> */}
      <Flow_Dashboard initial_folders = {serializedFolders} initial_flows = {serializedFlows} initial_docs={serializedDocs} />
    </div>
  );
};

export default DashboardPage;
