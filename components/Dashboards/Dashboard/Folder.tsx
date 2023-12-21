import { useState } from "react";
// import {
//   Typography,
//   Paper,
//   IconButton,
//   MenuItem,
//   Menu,
//   ClickAwayListener
// } from "@mui/material";


import { Box, Button, Typography, Paper, Grid, Link , styled, List, ListItem} from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: "var(--novel-stone-800)", // Example usage of a variable
  backgroundColor: "var(--novel-white)", // Default background color
  boxShadow: theme.shadows[1],
  borderRadius: "var(--radius)", // Example usage of a variable
  '&:hover': {
    backgroundColor: "var(--novel-stone-100)", // Hover background color
    boxShadow: theme.shadows[5],
  },
}));

import DeleteIcon from "@mui/icons-material/Delete";
import FolderOffIcon from "@mui/icons-material/FolderOff";
import AddIcon from "@mui/icons-material/Add";
import { DeleteDialog } from "../Dialogs/DeleteDialog";
import { CreateDialog } from "../Dialogs/CreateDialog";
import { deleteFlow, updateFlow, updateFlowTitle } from "@/lib/serv-actions/Flow";
import { createFlow } from "@/lib/serv-actions/Flow";
import { useRouter } from "next/navigation";
import { deleteDoc } from "@/lib/serv-actions/Doc";
import { createDoc } from "@/lib/serv-actions/Doc";
import { EditIcon } from "lucide-react";


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
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const [title, setTitle] = useState("Filler");
  const router = useRouter();
  const handleConfirmOpen = (flowInstance: any) => {
    if (flowInstance) {
      setFlowToDelete(flowInstance);
      setConfirmOpen(true);
    }
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
    setCreateDocDialogOpen(false); // Corrected from setCreateFlowDialogOpen
    if (!doc) {
      return <div>Loading...</div>;
    }

    router.push(`/Doc/${doc.docId}`);
  };


  return (
    <Box className="w-full mt-4 mb-2 pb-4 bg-secondary pt-2 px-3 rounded-2xl">
      <FolderLink folder={folder} />
      <Flows flowInstances={flowInstances} setCreateFlowDialogOpen={setCreateFlowDialogOpen} handleDeleteFlow={handleDeleteFlow} />
      <Docs docs={docs} setCreateDocDialogOpen={setCreateDocDialogOpen} handleDeleteDoc={handleDeleteDoc} />
    </Box>
  );
  
};

export default Folder;

const FolderLink = ({ folder }) => (
  <Box className="flex justify-center items-center mb-2">
    <Link href={`/Root/${folder.folderId}`} underline="hover" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }} key={folder.folderId}>
      <StyledPaper className="w-full text-center py-2">
        <Typography variant="h6" component="h2" fontWeight="bold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
          {folder.name}
        </Typography>
      </StyledPaper>
    </Link>
  </Box>
);

// Flows Component
const Flows = ({ flowInstances, setCreateFlowDialogOpen, handleDeleteFlow }) => {
  const placeholders = [];
  for (let i = flowInstances.length; i < 3; i++) {
    flowInstances.push(<PlaceholderItem key={`placeholder-${i}`} />);
  }
  return (
  <Box className="group">
    <Box className="flex justify-between items-center mb-2">
      <Typography variant="h6" component="h2" fontWeight="bold">
        Flows:
      </Typography>
      <Button 
  onClick={() => setCreateFlowDialogOpen(true)} 
  variant="text" 
  color="primary" 
  size="small"
  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  style={{ padding: 0, minWidth: 0 }} // Remove padding and set minimum width to 0
>
  <AddIcon style={{ backgroundColor: 'transparent', borderRadius: '50%' }}/>
</Button>
    </Box>
    <List style={{ padding: 0 }}>
      {flowInstances.map(flow => (
        <ListItem 
          key={flow.id} 
          className="flex justify-between items-center px-2 pt-2 rounded mb-2 bg-white"
          onMouseEnter={(e) => (e.currentTarget.lastChild as HTMLElement).style.opacity = '1'}
          onMouseLeave={(e) => (e.currentTarget.lastChild as HTMLElement).style.opacity = '0'}
        >
          
          <Link href={`/Flow/${flow.flowId}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
          <Typography variant="body1" component="p" fontWeight="bold">
            {flow.title}
          </Typography>
          {/* <Typography variant="body2">
            Last Updated: {flow.lastUpdatedAt}
          </Typography> */}
          </Link>
                    <Button 
            onClick={() => handleDeleteFlow(flow.id)} 
            variant="text" 
            color="secondary" 
            size="small" 
            style={{ opacity: 0, transition: 'opacity 300ms',padding: 0, minWidth: 0 }}
          >
          <DeleteIcon style={{ backgroundColor: 'transparent', borderRadius: '30%' }} />
          </Button>
        </ListItem>
      ))}
    </List>
  </Box>
)
        };

// Docs Component
const Docs = ({ docs, setCreateDocDialogOpen, handleDeleteDoc }) => {
  const placeholders = [];
  for (let i = docs.length; i < 3; i++) {
    docs.push(<PlaceholderItem key={`placeholder-${i}`} />);
  }
  return (
  <Box className="group pt-2">
    <Box className="flex justify-between items-center mb-2 ">
      <Typography variant="h6" component="h2" fontWeight="bold">
        Docs:
      </Typography>
      <Button 
  onClick={() => setCreateDocDialogOpen(true)} 
  variant="text" 
  color="primary" 
  size="small"
  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
  style={{ padding: 0, minWidth: 0 }} // Remove padding and set minimum width to 0
>
  <AddIcon style={{ backgroundColor: 'transparent', borderRadius: '50%' }}/>
</Button>
    </Box>
    <List>
      {docs.map(doc => (

        <ListItem 
          key={doc.id} 

          className="flex justify-between items-center px-2 pt-2 rounded mb-2 bg-white"
          onMouseEnter={(e) => (e.currentTarget.lastChild as HTMLElement).style.opacity = '1'}
          onMouseLeave={(e) => (e.currentTarget.lastChild as HTMLElement).style.opacity = '0'}
        >
        <Link href={`/Doc/${doc.docId}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
          <Typography variant="body1" component="p" fontWeight="bold">
            {doc.title}
          </Typography>
          {/* <Typography variant="body2">
            Last Updated: {doc.lastUpdatedAt}
          </Typography> */}
          </Link>
          <Button 
            onClick={() => handleDeleteDoc(doc.docId)} 
            variant="text" 
            color="secondary" 
            size="small" 
            style={{ opacity: 0, transition: 'opacity 300ms',padding: 0, minWidth: 0 }}
          >
          <DeleteIcon style={{ backgroundColor: 'transparent', borderRadius: '30%' }} />
          </Button>
        </ListItem>
      ))}
    </List>
  </Box>
);
        };

const PlaceholderItem = () => (
  <ListItem className="flex justify-between items-center px-0 pt-2 border-b-2" style={{ opacity: 0.3 }}>
    <Typography variant="body1" component="p" style={{ color: 'grey' }} fontWeight="bold">
      Placeholder
    </Typography>
  </ListItem>
);


// Main Component





  // function FlowCard(flowInstance) {
  //   const [isEditing, setIsEditing] = useState(false);
  //   const [newTitle, setNewTitle] = useState("");
  
  //   const handleRenameClick = () => {
  //     setIsEditing(true);
  //   };
  
  //   const handleFlowTitleUpdate = (event) => {
  //     event.preventDefault();
  //     updateFlowTitle(flowInstance.flowId, newTitle);
  //     setIsEditing(false);
  //   };
  
  //   const renderFlowTitle = () => {
  //     return (
  //       <div>
  //         <Link href={`/Flow/${flowInstance.flowId}`} passHref>
  //         <Typography
  //           variant="h5"
  //           component="div"
  //           className="font-display text-center"
  //         >
  //           {flowInstance.title}
  //         </Typography>
  //         <Typography
  //           variant="subtitle2"
  //           component="div"
  //           className="font-display text-center text-stone-900 "
  //         >
  //           Updated at:{" "}
  //           {new Date(flowInstance.updatedAt).toString().slice(0, 21)}
  //         </Typography>
  //         </Link>
  //       </div>
  //     );
  //   };
  // }
  
  //   const renderFlowTitleForm = () => {
  //     return (
  //       <form onSubmit={handleFlowTitleUpdate}>
  //         <input
  //           type="text"
  //           value={newTitle}
  //           onChange={(event) => setNewTitle(event.target.value)}
  //           className="border rounded-md px-2 py-1 w-5/6"
  //         />
  //         <button
  //           type="submit"
  //           className="z-auto bg-green-500 text-white px-2 py-1 rounded-md ml-2"
  //         >
  //           Save
  //         </button>
  //       </form>
  //     );
  //   };
  
  //   return (
  //     <Paper
  //       elevation={10}
  //       className="group my-3 px-3 mr-3 bg-white pt-6 rounded-xl shadow-md duration-500 hover:scale-105 hover:border-cyan-100"
  //       style={{ paddingRight: "16px", position: "static" }}
  //       key={flowInstance.flowId}
  //     >
  //       <div className="">
  //         <div className="mt-4 content-center text-center w-full text-stone-900 h-52">
  //           <Link href={`/Flow/${flowInstance.flowId}`} passHref>
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               viewBox="0 0 24 24"
  //               width="100"
  //               height="100"
  //               className="fill-current content-center text-center w-full pb-2"
  //             >
  //               <path d="M6 21.5C4.067 21.5 2.5 19.933 2.5 18C2.5 16.067 4.067 14.5 6 14.5C7.5852 14.5 8.92427 15.5538 9.35481 16.9991L15 16.9993V15L17 14.9993V9.24332L14.757 6.99932H9V8.99996H3V2.99996H9V4.99932H14.757L18 1.75732L22.2426 5.99996L19 9.24132V14.9993L21 15V21H15V18.9993L9.35499 19.0002C8.92464 20.4458 7.58543 21.5 6 21.5ZM6 16.5C5.17157 16.5 4.5 17.1715 4.5 18C4.5 18.8284 5.17157 19.5 6 19.5C996Z"></path>
  //             </svg>
  //           </Link>
  //           {isEditing ? renderFlowTitleForm() : renderFlowTitle()}
  //         </div>
  //       </div>
  //       <div className="flex justify-end">
  //         <IconButton
  //           edge="end"
  //           color="secondary"
  //           onClick={handleRenameClick}
  //           className={`invisible group-hover:visible hover:bg-red-400 bottom-0`}
  //         >
  //           <EditIcon className="transition ease-in-out delay-500" />
  //         </IconButton>
  //         <IconButton
  //           edge="end"
  //           color="secondary"
  //           onClick={() => handleConfirmOpen(flowInstance)}
  //           className={`invisible group-hover:visible hover:bg-red-400 bottom-0`}
  //         >
  //           <DeleteIcon className="transition ease-in-out delay-500" />
  //         </IconButton>
  //       </div>
  //     </Paper>
  //   );
  // }



// function emptyDocCard(handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void) {
//   return <Paper elevation={10} className="bg-white pt-4" style={{ paddingRight: "16px", margin: "5px", position: "static" }}>

//     <div className="content-center text-center w-full">
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" className="fill-stone-800 content-center text-center w-full "><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM7 6H11V10H7V6ZM7 12H17V14H7V12ZM7 16H17V18H7V16ZM13 7H17V9H13V7Z"></path></svg>

//       <Typography variant="h5" component="div" className="text-center text-stone-900 ">
//         No recent docs found.
//       </Typography>
//       <Typography variant="subtitle2" component="div" className="text-center text-stone-900 ">
//         Updated at: Never
//       </Typography>
//       <IconButton
//         edge="end"
//         color="primary"
//         onClick={handleMenuOpen}
//       >
//         <AddIcon />
//       </IconButton>

//     </div>



//   </Paper>;
// }

// function docCard(doc: any, handleConfirmDocOpen: (doc: any) => void): JSX.Element {
//   return (
//     <Paper
//       elevation={10}
//       className="group my-3 px-3 mr-3 bg-white pt-6 rounded-xl shadow-md duration-500 hover:scale-105 hover:border-cyan-100"
//       style={{ paddingRight: '16px', position: 'static' }}
//       key={doc.docId}
//     >
//       <div className="">
//         <div className="mt-4 content-center text-center w-full text-stone-900   h-52">
//           <Link href={`/Doc/${doc.docId}`} passHref>
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" className=" fill-stone-800 content-center text-center w-full "><path fill="none" d="M0 0h24v24H0z"></path><path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM7 6H11V10H7V6ZM7 12H17V14H7V12ZM7 16H17V18H7V16ZM13 7H17V9H13V7Z"></path></svg>

//             <Typography variant="h5" component="div" className="font-display text-center">
//               {doc.title}
//             </Typography>
//             <Typography variant="subtitle2" component="div" className="font-display text-center text-stone-900 ">
//               Updated at: {new Date(doc.updatedAt).toString().slice(0, 21)}
//             </Typography>
//           </Link>
//         </div>
//       </div>
//       <IconButton
//         edge="end"
//         color="secondary"
//         onClick={() => handleConfirmDocOpen(doc)}
//         className={`invisible delete-icon-${doc.flowId} group-hover:visible hover:bg-red-400 bottom-0`}
//       >
//         <DeleteIcon className="transition ease-in-out delay-500" />
//       </IconButton>
//     </Paper>
//   );
// }

// function emptyFlowCard(handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void) {
//   return <Paper elevation={10} className="bg-white pt-4" style={{ paddingRight: "16px", margin: "5px", position: "static" }}>

//     <div className="content-center text-center w-full text-stone-900 ">
//       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100" height="100" className="fill-stone-600 content-center text-center w-full pb-2">
//         <path d="M6 21.5C4.067 21.5 2.5 19.933 2.5 18C2.5 16.067 4.067 14.5 6 14.5C7.5852 14.5 8.92427 15.5538 9.35481 16.9991L15 16.9993V15L17 14.9993V9.24332L14.757 6.99932H9V8.99996H3V2.99996H9V4.99932H14.757L18 1.75732L22.2426 5.99996L19 9.24132V14.9993L21 15V21H15V18.9993L9.35499 19.0002C8.92464 20.4458 7.58543 21.5 6 21.5ZM6 16.5C5.17157 16.5 4.5 17.1715 4.5 18C4.5 18.8284 5.17157 19.5 6 19.5C996Z"></path>
//       </svg>
//       <Typography variant="h5" component="div" className="text-center">
//         No recent flows found.
//       </Typography>
//       <Typography variant="subtitle2" component="div" className="text-center">
//         Updated at: Never
//       </Typography>
//       <IconButton

//         edge="end"
//         color="primary"
//         onClick={handleMenuOpen}
//       >
//         <AddIcon />
//       </IconButton>
//     </div>
//   </Paper>;
// }


