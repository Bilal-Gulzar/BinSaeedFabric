// "use client"
// import { useEffect, useRef } from 'react';
// import { IoCloseOutline } from 'react-icons/io5';
// import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
// export default function SizeGuide({
//   show,
//   hide,
// }: {
//   show: Boolean;
//   hide: React.Dispatch<React.SetStateAction<Boolean>>
// }) {

//     const modalRef = useRef<HTMLDivElement| null>(null);
  
//     useEffect(() => {
//        if (!modalRef.current) return;
  
//        if (show) {
//          disableBodyScroll(modalRef.current);
//        } else {
//          enableBodyScroll(modalRef.current);
//        }
  
//        return () => {
//          if (modalRef.current) enableBodyScroll(modalRef.current);
//        };
//      }, [show]);
  
//   return (
//     <section
//       className={`fixed backdrop-blur-sm top-0 right-0 left-0 bg-black/30 z-50  flex justify-center items-center min-w-[100vw] min-h-[100vh] ${
//         show ? "" : "translate-y-full"
//       }`}
//     >
//       <div
//         className={`w-[92%] sm:w-[650px]  p-5  shadow-md relative bg-white ${
//           show ? "translate-y-0" : "translate-y-full"
//         } duration-300 transition-all ease-in-out`}
//         ref={modalRef}
//       >
//         <img src="/sizeChart.webp" alt="size chart" />
//         <div
//           onClick={() => {
//             hide(false);
//           }}
//           className="-top-2.5 -right-2.5 cursor-pointer absolute bg-black text-white"
//         >
//           <IoCloseOutline className="size-7 m-1.5" />
//         </div>
//       </div>
//     </section>
//   );
// }


"use client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type React from "react"

interface SizeGuideProps {
  show: boolean
  hide: (show: boolean) => void
}

const SizeGuide: React.FC<SizeGuideProps> = ({ show, hide }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Size Guide</h2>
          <Button variant="ghost" size="sm" onClick={() => hide(false)} className="p-1">
            <X size={20} />
          </Button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left">Size</th>
                  <th className="border border-gray-300 p-3 text-left">Chest (inches)</th>
                  <th className="border border-gray-300 p-3 text-left">Waist (inches)</th>
                  <th className="border border-gray-300 p-3 text-left">Length (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">Small</td>
                  <td className="border border-gray-300 p-3">34-36</td>
                  <td className="border border-gray-300 p-3">28-30</td>
                  <td className="border border-gray-300 p-3">26-27</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Medium</td>
                  <td className="border border-gray-300 p-3">38-40</td>
                  <td className="border border-gray-300 p-3">32-34</td>
                  <td className="border border-gray-300 p-3">27-28</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Large</td>
                  <td className="border border-gray-300 p-3">42-44</td>
                  <td className="border border-gray-300 p-3">36-38</td>
                  <td className="border border-gray-300 p-3">28-29</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">Extra Large</td>
                  <td className="border border-gray-300 p-3">46-48</td>
                  <td className="border border-gray-300 p-3">40-42</td>
                  <td className="border border-gray-300 p-3">29-30</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <h3 className="font-semibold mb-2">How to Measure:</h3>
            <ul className="space-y-1">
              <li>
                • <strong>Chest:</strong> Measure around the fullest part of your chest
              </li>
              <li>
                • <strong>Waist:</strong> Measure around your natural waistline
              </li>
              <li>
                • <strong>Length:</strong> Measure from shoulder to desired length
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeGuide
