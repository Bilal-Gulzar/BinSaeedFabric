import React from 'react'
import { BsChatLeftDotsFill } from "react-icons/bs";

export default function ChatComponent() {
  return (
    <a
      href="https://wa.me/923278690391"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="bg-red-700 size-14 flex items-center justify-center  fixed bottom-5  rounded-full left-6">
        <BsChatLeftDotsFill size={30} className="text-white" />
      </div>
    </a>
  );
}
