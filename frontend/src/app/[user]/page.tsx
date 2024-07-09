'use client'

import { styled, Switch } from "@mui/material";
import Image from "next/image";
import SunImg from "@/utils/images/sun.png";
import MoonImg from "@/utils/images/moon.png";
import HideImg from "@/utils/images/hide.png";
import React, { useEffect, useState } from "react";

export default function UserPage({ params }: { params: { user: string } }) {
    const [mode, setMode] = useState<"light" | "dark">(
        typeof window !== "undefined" ? localStorage.getItem("theme") as ("light" | "dark") : "dark"
    );

    const toggleMode = (e : any) => {
        const newMode = mode === "light" ? "dark" : "light";
        const body = document.querySelector("body");
        setMode(newMode);
        localStorage.setItem("theme", newMode);
        if (newMode === "dark") {
            e.currentTarget.checked = true;
            body?.classList.remove("bg-primary-light");
            body?.classList.add("bg-primary-dark");
        }else{
            e.currentTarget.checked = false;
            body?.classList.remove("bg-primary-dark");
            body?.classList.add("bg-primary-light");
        }
    };

    const AntSwitch = styled(Switch)(({ theme }) => ({
        width: 38,
        height: 20,
        padding: 0,
        display: 'flex',
        '&:active': {
          '& .MuiSwitch-thumb': {
            width: 18,
          },
          '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(14.4px)',
          },
        },
        '& .MuiSwitch-switchBase': {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(18px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: mode === 'dark' ? '#177ddc' : '#1890ff',
            },
          },
        },
        '& .MuiSwitch-thumb': {
          boxShadow: '0 4px 8px 0 rgb(0 35 11 / 20%)',
          width: 16,
          height: 16,
          borderRadius: 8,
          transition: theme.transitions.create(['width'], {
            duration: 200,
          }),
        },
        '& .MuiSwitch-track': {
          borderRadius: 32 / 2,
          opacity: 1,
          backgroundColor:
            mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
          boxSizing: 'border-box',
        },
      }));
      

    return (
        <main className="kanban-template">
            <aside className={`aside-content p-6 font-bold w-[22vw] h-screen ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h3 className={`text-2xl ${mode === "dark" ? "text-white" : "text-black"}`}>{params.user} Kanban</h3>
                <div className="mt-10">
                    <h4 className="text-gray-400 text-sm">ALL BOARDS {"()"}</h4>
                    <div>
                        <button className="create-board py-4 pl-7 pr-5 -ml-7 hover:opacity-90">+Create New Board</button>
                    </div>
                </div>
                <div className="mt-[22rem]">
                    <div className={`flex gap-3 items-center size-fit rounded-md py-2 px-16 ${mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`}>
                        <Image src={SunImg} alt="sun" width={25} height={25} />
                        <AntSwitch checked={mode === "dark" ? true : false} onClick={toggleMode} />
                        <Image src={MoonImg} alt="moon" width={20} height={20} />
                    </div>
                    <button className={`flex gap-3 items-center size-fit mt-2 py-2 pr-20 pl-16 -m-16 rounded-3xl hover:opacity-80 ${mode === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300"}`}><Image src={HideImg} alt="hide" width={25} height={25} />Hide Sidebar</button>
                </div>
            </aside>

            <div className={`cDiv font-bold flex items-center justify-between p-5 border-b border-l border-gray-500 w-[78vw] h-[15vh] ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h1 className={`text-xl ${mode === "dark" ? "text-white" : "text-black"}`}>Platform Launch</h1>
                <div className="flex gap-3 items-center">
                    <button className="bg-button font-bold text-base p-3 px-4 rounded-3xl">+ Add New Task</button>
                    <div className="dropdown">
                        <button className="text-gray-600 text-2xl">&#8942;</button>
                        <div className="dropdown-content">
                            <a href="#">Option 1</a>
                            <a href="#">Option 2</a>
                            <a href="#">Option 3</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content h-[80vh] pl-5 pt-5">
                <button className={`h-full w-[20vw] font-bold ${mode === "dark" ? "text-gray-500 bg-[#24242F]" : "text-gray-400 bg-[#E5E5E5]"} hover:opacity-90`}>+ New Column</button>
            </div>
        </main>
    );
}