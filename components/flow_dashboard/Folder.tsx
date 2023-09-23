import { useState } from "react";
import {
  Typography,
  Paper,
  IconButton,
  MenuItem,
  Menu,
  ClickAwayListener
} from "@mui/material";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from '@mui/icons-material/Article';
import { CreateFlowDialog } from "./Dialogs/CreateFlowDialog";
import { DeleteFlowDialog } from "./Dialogs/DeleteFlowDialog";
import { DeleteFolderDialog } from "./Dialogs/DeleteFolderDialog";
import { deleteFlow } from "@/lib/serv-actions/deleteFlow";
import { createFlow } from "@/lib/serv-actions/createFlow";
import { useRouter } from "next/navigation";
import FavoriteButton from "./FavoriteButton";
import { deleteDoc } from "@/lib/serv-actions/deleteDoc";
import { createDoc } from "@/lib/serv-actions/createDoc";
import { CreateDocDialog } from "./Dialogs/CreateDocDialog";
import { Grid } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteDocDialog } from "./Dialogs/DeleteDocDialog";

type FolderProps = {
  folder: any;
  flowInstances: any[];
  docs: any[];
  title: string;
  onDeleteFlow: (id: string) => void;
  onDeleteDoc: (id: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onConfirmOpen: (flowInstance: any) => void;
  onCreate: (title: string, folderId: string) => void;
  onFavoriteFolder: (folder: string) => void;
};

export function Folder({
  folder,
  flowInstances,
  docs,
  onDeleteFlow,
  onDeleteFolder,
  onDeleteDoc,
  onFavoriteFolder,
}: FolderProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmDocOpen, setConfirmDocOpen] = useState(false);
  const [flowToDelete, setFlowToDelete] = useState<any>(null);
  const [docToDelete, setDocToDelete] = useState<any>(null);
  const [createFlowDialogOpen, setCreateFlowDialogOpen] = useState(false);
  const [createDocDialogOpen, setCreateDocDialogOpen] = useState(false);
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false);
  const [deleteDocDialogOpen, setDeleteDocDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const [title, setTitle] = useState("Filler");
  const router = useRouter();
  const handleConfirmOpen = (flowInstance: any) => {
    if(flowInstance){
    setFlowToDelete(flowInstance);
    setConfirmOpen(true);}
  };

  const handleConfirmDocOpen = (doc: any) => {
      setDocToDelete(doc);
      setConfirmDocOpen(true);
  };

  const handleConfirmDocClose = () => {
    setConfirmDocOpen(false);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);

  };

  const handleDeleteFlow = (flowId: string) => {
    onDeleteFlow(flowId);
    deleteFlow(flowId);
    handleConfirmClose();
  };

  const handleDeleteDoc = (docId: string) => {
    onDeleteDoc(docId);
    deleteDoc(docId);
    handleConfirmDocClose();
  };

  const handleFavorite = () => {
    onFavoriteFolder(folder);
  };

  const handleDeleteFolder = () => {
    onDeleteFolder(folder.folderId);
    setDeleteFolderDialogOpen(false);
  };

  const handleCreateNewFlow = async () => {
    setTitle(title);
    const flow = await createFlow(title, folder.folderId);
    setTitle("");
    setCreateFlowDialogOpen(false);
    if (!flow) {
      return <div>Loading</div>;
    }

    router.push(`/NewFlow/${flow.flowId}`);
  };

  const handleCreateNewDoc = async () => {
    setTitle(title);
    const doc = await createDoc(title, folder.folderId);
    setTitle("");
    setCreateFlowDialogOpen(false);
    if (!doc) {
      return <div>Loading</div>;
    }

    router.push(`/Doc/${doc.docId}`);
  };

  const middleIndex = Math.ceil(flowInstances.length / 2);
  const leftFlowInstances = flowInstances.slice(0, middleIndex);
  const rightFlowInstances = flowInstances.slice(middleIndex);

  return (
    <div className="text-stone-900 font-display ">
    <Paper elevation={1} className=" bg-secondary rounded-xl group relative transition ease-in-out delay-150" style={{ padding: "10px" }}>
      <div className="text-stone-900 font-display" style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="pl-2">        
          <Link href={`/Root/${folder.folderId}`} passHref>
          <Typography variant="h1">{folder.name}</Typography>
          </Link>
        </div>


        <div className="invisible group-hover:visible transition ease-in-out delay-500 pr-4 hover:shadow-lg">
          {/* <FavoriteButton
            onFavorite={handleFavorite}
          /> */}
          <IconButton
          className="pr-4"
            edge="end"
            color="secondary"
            onClick={() => setDeleteFolderDialogOpen(true)}
          >
            <FolderOffIcon />
          </IconButton>
          <IconButton
            edge="end"
            color="primary"
            onClick={handleMenuOpen}
          >
                        <AddIcon />
          </IconButton>
            <div className="relative">
             <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              
            >
              
              <MenuItem
                onClick={() => {
                  setCreateFlowDialogOpen(true);
                  handleMenuClose();

                }}
              >
                Add Flow
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setCreateDocDialogOpen(true);
                  handleMenuClose();

                }}
              >
                Add Doc
              </MenuItem>
            </Menu>
            </div>
        </div>
      </div>
      <div className="text-stone-900 font-display" style={{ display: "flex", justifyContent: "center" }}>
        <div className=" bg-inherit " style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", position: 'static' }}>
          {flowInstances.length > 0 ? (
            flowInstances.map((flowInstance) => (
              <Paper elevation={10} className="bg-white pt-4  rounded-xl shadow-md duration-500 hover:scale-105  hover:border-cyan-100" style={{ paddingRight: "16px", margin: "5px", position: "static" }} key={flowInstance.flowId}>
                <div>
                  <div className="content-center text-center w-full text-stone-900 font-display">
                    <Link href={`/Flow/${flowInstance.flowId}`} passHref>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100"  className=" fill-current content-center text-center w-full pb-2">
                        <path d="M6 21.5C4.067 21.5 2.5 19.933 2.5 18C2.5 16.067 4.067 14.5 6 14.5C7.5852 14.5 8.92427 15.5538 9.35481 16.9991L15 16.9993V15L17 14.9993V9.24332L14.757 6.99932H9V8.99996H3V2.99996H9V4.99932H14.757L18 1.75732L22.2426 5.99996L19 9.24132V14.9993L21 15V21H15V18.9993L9.35499 19.0002C8.92464 20.4458 7.58543 21.5 6 21.5ZM6 16.5C5.17157 16.5 4.5 17.1715 4.5 18C4.5 18.8284 5.17157 19.5 6 19.5C996Z"></path>
                      </svg>
                      <Typography variant="h5" component="div" className="text-center">
                        {flowInstance.title}
                      </Typography>
                      <Typography variant="subtitle2" component="div" className="text-center text-stone-900 font-display">
                        Updated at: {new Date(flowInstance.updatedAt).toString().slice(0, 21)}
                      </Typography>
                    </Link>
                  </div>
                  <IconButton edge="end" color="secondary" onClick={() => handleConfirmOpen(flowInstance)}>
                    <DeleteIcon className=" group-hover:visible transition ease-in-out delay-500"/>
                  </IconButton>
                </div>
              </Paper>
            ))
            ) : (
              <Paper elevation={10} className="bg-white pt-4" style={{ paddingRight: "16px", margin: "5px", position: "static" }}>
          
                <div className="content-center text-center w-full text-stone-900 font-display">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100"  className="fill-stone-600 content-center text-center w-full pb-2">
                        <path d="M6 21.5C4.067 21.5 2.5 19.933 2.5 18C2.5 16.067 4.067 14.5 6 14.5C7.5852 14.5 8.92427 15.5538 9.35481 16.9991L15 16.9993V15L17 14.9993V9.24332L14.757 6.99932H9V8.99996H3V2.99996H9V4.99932H14.757L18 1.75732L22.2426 5.99996L19 9.24132V14.9993L21 15V21H15V18.9993L9.35499 19.0002C8.92464 20.4458 7.58543 21.5 6 21.5ZM6 16.5C5.17157 16.5 4.5 17.1715 4.5 18C4.5 18.8284 5.17157 19.5 6 19.5C996Z"></path>
                      </svg>
                  <Typography variant="h5" component="div" className="text-center">
                    No recent flows found.
                  </Typography>
                  <Typography variant="subtitle2" component="div" className="text-center">
                    Updated at: Never
                  </Typography>
                  <IconButton

                    edge="end"
                    color="primary"
                    onClick={handleMenuOpen}
                  >
                    <AddIcon />
                  </IconButton>
                
                  </div>



              </Paper>
            )}


        </div>

          <div className="bg-inherit " style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", position: 'static' }}>
            {docs.length > 0 ? (
              docs.map((doc) => (
                <Paper elevation={10} className="bg-white pt-4 overflow-hidden rounded-xl shadow-md duration-200 hover:scale-105 hover:shadow-xl" style={{ paddingRight: "16px", margin: "5px", position: "static" }} key={doc.docId}>
                  <div>
                    <div className="content-center text-center w-full ">
                      <Link href={`/Doc/${doc.docId}`} passHref>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" className=" fill-stone-800 content-center text-center w-full "><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM7 6H11V10H7V6ZM7 12H17V14H7V12ZM7 16H17V18H7V16ZM13 7H17V9H13V7Z"></path></svg>
                
                        <Typography variant="h5" component="div" gutterBottom className="text-center text-stone-900 font-display">
                          {doc.title}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom className="text-stone-900 font-display">
                          Updated at: {new Date(doc.updatedAt).toString().slice(0, 21)}
                        </Typography>
                      </Link>

                    </div>
                    <IconButton edge="end" color="secondary" onClick={() => handleConfirmDocOpen(doc)}>
                    <DeleteIcon />
                  </IconButton>
                  </div>
                </Paper>



              ))
            ) : (
              <Paper elevation={10} className="bg-white pt-4" style={{ paddingRight: "16px", margin: "5px", position: "static" }}>
          
                <div className="content-center text-center w-full">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="100" height="100" className="fill-stone-800 content-center text-center w-full "><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM7 6H11V10H7V6ZM7 12H17V14H7V12ZM7 16H17V18H7V16ZM13 7H17V9H13V7Z"></path></svg>
                        
                  <Typography variant="h5" component="div" className="text-center text-stone-900 font-display">
                    No recent docs found.
                  </Typography>
                  <Typography variant="subtitle2" component="div" className="text-center text-stone-900 font-display">
                    Updated at: Never
                  </Typography>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={handleMenuOpen}
                  >
                    <AddIcon />
                  </IconButton>
                
                  </div>



              </Paper>
            )}


          </div>




      </div>
      <DeleteFlowDialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        onDelete={handleDeleteFlow}
        flowToDelete={flowToDelete}
      />
      <DeleteFolderDialog
        open={deleteFolderDialogOpen}
        onClose={() => setDeleteFolderDialogOpen(false)}
        onDelete={handleDeleteFolder}
        folderToDelete={folder}
      />
      <DeleteDocDialog
        open={confirmDocOpen}
        onClose={handleConfirmDocClose}
        onDelete={handleDeleteDoc}
        docToDelete={docToDelete}
      />
      <CreateFlowDialog
        open={createFlowDialogOpen}
        onClose={() => setCreateFlowDialogOpen(false)}
        onCreate={handleCreateNewFlow}
        title={title}
        onTitleChange={setTitle}
      />
      <CreateDocDialog
        open={createDocDialogOpen}
        onClose={() => setCreateDocDialogOpen(false)}
        onCreate={handleCreateNewDoc}
        title={title}
        onTitleChange={setTitle}
      />
    </Paper>
    </div>
  );
}