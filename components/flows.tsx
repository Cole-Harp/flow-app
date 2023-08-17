// "use client";

// import { FlowInstance } from "@prisma/client"
// import { Card, CardFooter, CardHeader } from "@/components/ui/card"
// import Link from "next/link";
// import { CreateFlowDialog } from "./flow_dashboard/CreateFlowDialog";
// import { useState } from "react";
// import { createFlow } from "@/lib/serv-actions/createFlow";

// interface FlowProps{
//     data: (FlowInstance)[];
// }

// export const Flows = ({
//     data
// }: FlowProps) => {

//   const [dialogOpen, setDialogOpen] = useState(false);

//   const handleCreateFlow = async (flowTitle: string) => {
//     createFlow(flowTitle)
//   };

//   if (data.length === 0) {

//         return (
//           <><div>
//             <button
//               onClick={() => setDialogOpen(true)}
//               className="flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition"
//             >
//               New Flow
//             </button>
//             <CreateFlowDialog
//               open={dialogOpen}
//               onClose={() => setDialogOpen(false)}
//               onCreate={handleCreateFlow} />

//                       </div><div className="pt-10 flex flex-col items-center justify-center space-y-3">
//                           <div className="relative w-60 h-60">
//                             {/* <Image
//                   fill
//                   className="grayscale"
//                   src="/empty.png"
//                   alt="Empty"
//                 /> */}
//                 EmptyAf
//               </div>
//               <p className="text-sm text-muted-foreground">No Flows found.</p>
//             </div></>
//         )
//       }
//       return (
//         <><div>
//           <button
//             onClick={() => setDialogOpen(true)}
//             className="flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition"
//           >
//             New Flow
//           </button>
//           <CreateFlowDialog
//             open={dialogOpen}
//             onClose={() => setDialogOpen(false)}
//             onCreate={handleCreateFlow} />

//         </div><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
//             {data.map((item) => (
//               <Card key={item.title} className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0">
//                 <Link href={`/Dashboard/Flow/${item.flowId}`}>
//                   <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
//                     {/* <div className="relative w-32 h-32">
//               <Image
//                 src={item.src}
//                 fill
//                 className="rounded-xl object-cover"
//                 alt="Character"
//               />
//             </div> */}
//                     <p className="font-bold">
//                       {item.title}
//                     </p>
//                     {/* <p className="text-xs">
//               {item.description}
//             </p> */}
//                   </CardHeader>
//                   {/* <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
//               <p className="lowercase">@{item.userName}</p>
//               <div className="flex items-center">
//                 <MessagesSquare className="w-3 h-3 mr-1" />
//                 {item._count.messages}
//               </div>
//             </CardFooter> */}
//                 </Link>
//               </Card>
//             ))}
//           </div></>
//       )
//     }