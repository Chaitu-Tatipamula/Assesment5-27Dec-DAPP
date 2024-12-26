"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { CgProfile } from 'react-icons/cg';


export function NavBar() {


  return (
    <div className="w-full px-10 border-b border-b-gray-700 py-2 flex justify-between items-center">
      <div className="gap-4 flex">
        <ConnectButton />
      </div>
    </div>
  )
}
