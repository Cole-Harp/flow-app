
import prisma_db from "@/lib/prisma_db";
import { FindOrCreateUser } from "@/lib/serv-actions/Auth";
import RootDashboard from "@/components/Dashboards/Root_Dashboard/dashboard";
import { getFolder } from "@/lib/serv-actions/Folder";


export default async function Flow(context: { params: { folderId: string; }; }) {
  const { folderId } = context.params as { folderId: string };
  console.log(folderId)
  const id = (await FindOrCreateUser()).id;
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

  return (
    <div style={{ marginLeft: "20px", marginRight: "20px" }}>
      {/* <SearchInput />
      <Folders data={folders}/>
      <Flows data={folder_contents} /> */}
      <RootDashboard initial_folder={folder} initial_flows={folder_flows} initial_docs={folder_docs} />
    </div>
  );
};


