import { SearchInput } from "@/components/Dashboards/Dashboard_Ui/search-input";
import prisma_db from "@/lib/prisma_db";
import { Folders } from "@/components/Dashboards/Dashboard_Ui/folders";
import Dashboard from "@/components/Dashboards/Dashboard/dashboard";
import { FindOrCreateUser } from "@/lib/serv-actions/Auth";
import { Search } from "lucide-react";
import { title } from "process";
import { Folder } from "@prisma/client";


interface DashboardPageProps {
  searchParams: {
    folderId: string;
    name: string;
    title: string;
  };
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {

  
  const id= (await FindOrCreateUser()).id;
    console.log(id, "HEREHERHE")

  

    const folderData = await prisma_db.folder.findMany({
      where: {
        userId: id,
        folderId: searchParams.folderId,
        name: {
          search: searchParams.name
        }

      },
      include: {
        flowInstances: {
          where: {
            userId: id,
            // title: {
            //   search: searchParams.name
            // }
          },
          take: 3,
          orderBy: {
            updatedAt: 'desc',
          },
        },
        docs: {
          take: 3,
          orderBy: {
            updatedAt: 'desc',
          },
        }
      }
    });
    
    const folders = await prisma_db.folder.findMany({
      where: {
        userId: id,
        // name: {
        //   search: searchParams.name
        // }
      },
    });


  console.log(folderData, folders, "FOLDERS")
  
  return (


    <div  className=" ml-4 mr-5 mt-2">
      <SearchInput />
      <Folders data={folders} />
      <Dashboard initial_folders = {folderData} />
    </div>
  );
};

export default DashboardPage;
