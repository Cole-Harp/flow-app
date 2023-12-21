

import Todos from "@/components/Scheduling/Todo/Todo";
import prisma_db from "@/lib/prisma_db";
import { FindOrCreateUser } from "@/lib/serv-actions/Auth";
import { getTasks } from "@/lib/serv-actions/Todo";


export default async function Page(context: { params: { folderId: string; }; }) {
  // const { folderId } = context.params as { folderId: string };
  // console.log(folderId)

  // const folder = await getFolder(folderId);

  // if (!folder) {
  //   return <div>Loading...</div>;
  // }

  const tasks = await getTasks();


  return (
    <div style={{ marginLeft: "20px", marginRight: "20px" }}>
        <Todos initTasks={tasks} />
    </div>
  );
};


