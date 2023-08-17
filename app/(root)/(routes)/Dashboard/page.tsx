import { SearchInput } from "@/components/search-input";
import { UserButton } from "@clerk/nextjs";
import prisma_db from "@/lib/prisma_db";
import { Folders } from "@/components/folders";
import { findOrCreateUser } from "@/lib/serv-actions/findOrCreateUser";
import { auth } from "@clerk/nextjs";
import useRouter from "next/navigation";
import Flow_Dashboard from "@/components/flow_dashboard/dashboard";
import{ updateFlow }from "../../../../lib/serv-actions/updateFlow"



interface DashboardPageProps {
  searchParams: {
    folderId: string;
    title: string;
  };
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  searchParams
  
  const id= (await findOrCreateUser()).clerkUserId;
    console.log(id, "HEREHERHE")

  

  const folder_contents = await prisma_db.flowInstance.findMany({
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

  const serializedFlows = Array.isArray(folder_contents) ? folder_contents.map((folder_contents) => ({
    ...folder_contents,
  })) : [];


  const serializedFolders = Array.isArray(folders) ? folders.map((folder) => ({
    ...folder,
  })) : [];

  console.log(folders, "FOLDERS")

  return (
    <div style={{ marginLeft: "20px", marginRight: "20px" }}>
      <SearchInput />
      <Folders data={folders}/>
      {/* <Flows data={folder_contents} /> */}
      <Flow_Dashboard initial_folders = {serializedFolders} initial_flows = {serializedFlows} />
    </div>
  );
};

export default DashboardPage;
