// "use client";
// import React, { useEffect, useRef } from "react";
// import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


// export default function OrderSortingAndfiltering({
//   sorting,
//   setSorting,
//   filter,
//   setFilter,
// }: {
//   sorting: boolean;
//   setSorting: React.Dispatch<React.SetStateAction<boolean>>;
//   filter: boolean;
//   setFilter: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   const modalRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!modalRef.current) return;

//     if (sorting) {
//       disableBodyScroll(modalRef.current);
//     } else {
//       enableBodyScroll(modalRef.current);
//     }

//     return () => {
//       if (modalRef.current) enableBodyScroll(modalRef.current);
//     };
//   }, [sorting]);
//   return (
//     <div
//       onClick={() => setSorting(false)}
//       className={`${
//         sorting ? "fixed bg-black/80 inset-0 z-50 min-h-screen" : ""
//       }`}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className={`min-h-screen w-[280px] xs:w-[330px] z-50 fixed right-0 top-0 bg-white ${
//           sorting ? "" : "translate-x-full"
//         } transition-all duration-500 overflow-x-hidden p5`}
//         ref={modalRef}
//       >
//         <div className="flex w-full gap-4 *:font-medium shadow-sm z-30 p-5 border-none">
//           <button
//             onClick={() => setFilter(false)}
//             className={`${
//               !filter ? " bg-gray-100 text-red-500 " : "text-gray-500"
//             } w-full p-4  font-medium text-sm rounded-md border-none`}
//           >
//             Sort
//           </button>
//           <button
//             onClick={() => setFilter(true)}
//             className={`w-full p-4 text-sm rounded-md border-none ${
//               filter ? " bg-gray-100 text-red-500 " : "text-gray-500"
//             } `}
//           >
//             Filter
//           </button>
//         </div>
//         <div className="pb-8 overflow-y-auto">
//           {filter ? (
//             <div className="p-5  mt-4">
//               <h3 className="font-bold text-sm mb-5 ">Order date</h3>
//               <RadioGroup defaultValue="last7days">
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="today" id="today" />
//                   <Label htmlFor="today">Today</Label>
//                 </div>
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem defaultChecked value="last7days" id="7" />
//                   <Label htmlFor="7">Last 7 days</Label>
//                 </div>
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="last30days" id="30" />
//                   <Label htmlFor="30">Last 30 days</Label>
//                 </div>
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="last90days" id="90" />
//                   <Label htmlFor="90">Last 90 days</Label>
//                 </div>
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="last12months" id="12" />
//                   <Label htmlFor="12">Last 12 months</Label>
//                 </div>
//               </RadioGroup>
//               <div className="font-medium text-red-500 underline underline-offset-2 text-sm my-5">
//                 Clear section
//               </div>
//             </div>
//           ) : (
//             <div className="p-5  mt-4">
//               <RadioGroup defaultValue="newest-to-oldest">
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="newest-to-oldest" id="1" />
//                   <Label htmlFor="1">Newest to oldest</Label>
//                 </div>
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="Oldest-to-newest" id="2" />
//                   <Label htmlFor="2">Oldest to newest</Label>
//                 </div>
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="Order-number-(high to low)" id="3" />
//                   <Label htmlFor="3">Order number (high to low)</Label>
//                 </div>
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="Order-number-(low to high)" id="4" />
//                   <Label htmlFor="4">Order number (low to high)</Label>
//                 </div>
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="Order-total-(high to low)" id="5" />
//                   <Label htmlFor="5">Order total (high to low)</Label>
//                 </div>
//                 <div className="flex items-center space-x-2.5 space-y-2.5">
//                   <RadioGroupItem value="Order-total-(low to high)" id="6" />
//                   <Label htmlFor="6">Order total (low to high)</Label>
//                 </div>
//               </RadioGroup>
//             </div>
//           )}
//         </div>
//         <div className="h-[90px] bg-white absolute   w-full p-5 z-40 shadow-sm bottom-0">
//           <div className="flex  w-full gap-4   border-none  ">
//             <button className="w-full p-4 text-red-500 font-medium text-sm rounded-md border-none">
//               Clear all
//             </button>
//             <button className="bg-[#D12442] font-medium hover:bg-[#a51a32]  w-full p-4 text-white text-sm rounded-md border-none">
//               Apply
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
