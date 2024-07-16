'use client'

import { styled, Switch } from "@mui/material";
import Image from "next/image";
import SunImg from "@/utils/images/sun.png";
import MoonImg from "@/utils/images/moon.png";
import HideImg from "@/utils/images/hide.png";
import SeeImg from "@/utils/images/see.png";
import React, { useEffect, useState } from "react";
import Column from "@/components/Column";
import { Input } from "@/utils/Tags/Input";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/requests/User";
import { getTables } from "@/utils/requests/Table";
import { getColumns } from "@/utils/requests/Column";
import { User } from "@/utils/requests/User";
import { Table } from "@/utils/requests/Table";
import { Column as ColumnType } from "@/utils/requests/Column";

export default function UserPage({ params }: { params: { user: string } }) {
    const [mode, setMode] = useState<"light" | "dark">(
        typeof window !== "undefined" ? localStorage.getItem("theme") as ("light" | "dark") : "dark"
    );
    const [showAddNewTask, setShowAddNewTask] = useState(false);
    const [user, setUser] = useState<User>();
    const [boards, setBoards] = useState<Table[]>([]);
    const [columns, setColumns] = useState<ColumnType[]>([]);
    const [hideSidebar, setHideSidebar] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.back();
        }

        async function fetchUser() {
            const user = await getUser(params.user);
            setUser(user);
        }

        async function fetchBoards(userID : number) {
            const boards = await getTables(userID);
            setBoards(boards);
        }

        async function fetchColumns(tableID : number) {
            const columns = await getColumns(tableID);
            setColumns(columns);
        }

        fetchUser();
       // fetchBoards(user!.id);
       // fetchColumns(boards[0].id);

    }, []);

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
      
    const addNewBoard = () => {
        
    }

    const hideSidebarFn = () => {
      const aside = document.querySelector(".aside-content");
      const main = document.querySelector(".main-content");
      const cDiv = document.querySelector(".cDiv");
      if (aside?.classList.contains("w-[22vw]")) {
        aside.classList.remove("w-[22vw]");
        aside.classList.remove("inline");
        aside.classList.add("hidden");
        aside.classList.add("w-0");
        aside.classList.add("opacity-0");
        main?.classList.add("w-[100vw]");
        cDiv?.classList.add("w-[100vw]");
        cDiv?.classList.remove("w-[78vw]");
        setHideSidebar(true);
      } else {
        aside?.classList.add("w-[22vw]");
        aside?.classList.add("inline");
        aside?.classList.remove("hidden");
        aside?.classList.remove("w-0");
        aside?.classList.remove("opacity-0");
        main?.classList.remove("w-[100vw]");
        cDiv?.classList.remove("w-[100vw]");
        cDiv?.classList.add("w-[78vw]");
        setHideSidebar(false);
      }
    }

    return (
        <main className="kanban-template">
            <aside className={`aside-content inline p-6 font-bold w-[22vw] h-screen ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h3 className={`text-2xl ${mode === "dark" ? "text-white" : "text-black"}`}>{params.user} Kanban</h3>
                <div className="mt-10">
                    <h4 className="text-gray-400 text-sm">ALL BOARDS {"()"}</h4>
                    <div className="mt-2">
                        <button className="chosen-board py-2 pl-10 pr-24 -ml-10 rounded-3xl hover:opacity-90">Default Board</button>
                        <button className="create-board py-2 pl-7 -ml-7 hover:opacity-90">+Create New Board</button>
                    </div>
                </div>
                <div className="mt-[21rem]">
                    <div className={`flex gap-3 items-center size-fit rounded-md py-2 px-16 ${mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`}>
                        <Image src={SunImg} alt="sun" width={25} height={25} />
                        <AntSwitch checked={mode === "dark" ? true : false} onClick={toggleMode} />
                        <Image src={MoonImg} alt="moon" width={20} height={20} />
                    </div>
                </div>
            </aside>
            {
              hideSidebar ?
              <button onClick={hideSidebarFn} className="rounded-full flex justify-center items-center w-10 h-10 border-black border-2 absolute bottom-[1rem] left-2"><Image src={SeeImg} alt="see" width={25} height={25} /></button>
              :
              <button type="button" onClick={hideSidebarFn} className={`flex font-semibold absolute bottom-[4.5rem] left-8 gap-3 items-center size-fit mt-2 py-2 pr-20 pl-16 -m-16 rounded-3xl hover:opacity-80 ${mode === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300"}`}><Image src={HideImg} alt="hide" width={25} height={25} />Hide Sidebar</button>
            }

            <div className={`cDiv font-bold flex items-center justify-between p-5 border-b border-l border-gray-500 w-[78vw] h-[15vh] ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h1 className={`text-xl ${mode === "dark" ? "text-white" : "text-black"}`}>Platform Launch</h1>
                <div className="flex gap-3 items-center">
                    <button className="bg-button font-bold text-base p-3 px-4 rounded-3xl" onClick={() => setShowAddNewTask(!showAddNewTask)}>+ Add New Task</button>
                    <div className="dropdown">
                        <button className="text-gray-600 text-2xl">&#8942;</button>
                        <div className="dropdown-content">
                            <span>Delete Board</span>
                            <span>Change Board</span>
                            <span>Delete Column</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content h-[80vh] pl-4 pt-4 flex gap-6">
                <Column mode={mode} userID={1} />
                <button className={`h-full w-[22vw] font-bold ${mode === "dark" ? "text-gray-500 bg-[#24242F]" : "text-gray-400 bg-[#E5E5E5]"} hover:opacity-90`}>+ New Column</button>
            </div>

          {
            showAddNewTask ? 
            <div className={`flex flex-col p-5 gap-4 absolute top-[5vh] left-[35vw] w-[30vw] h-[90vh] z-10 rounded-md ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
              <h1 className={`font-semibold text-xl ${mode === "dark" ? "text-white" : "text-black"}`}>New Task</h1>
              <form className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className={`font-semibold text-sm ${mode === "dark" ? "text-white" : "text-black"}`}>Title</label>
                  <Input placeholder="e.g: Take a coffee" type="text" id="title" name="title" className="w-full font-semibold" />  
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className={`font-semibold text-sm ${mode === "dark" ? "text-white" : "text-black"}`}>Description</label>
                  <textarea placeholder="e.g: Always good to take a break" name="description" id="description" rows={4} className="resize-none text-gray-400 text-sm p-2 rounded w-full input-border"></textarea>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className={`font-semibold text-sm ${mode === "dark" ? "text-white" : "text-black"}`}>Subtasks</label>
                  <div className="flex gap-4">
                    <Input type="text" className="subtasks font-semibold text-sm w-full" name="subtasks" />
                    <button className="text-gray-400 font-bold">X</button>
                  </div>
                  <button className="bg-button font-bold text-base p-2 rounded-3xl w-full">+ Add New Subtask</button>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="status" className={`font-semibold text-sm ${mode === "dark" ? "text-white" : "text-black"}`}>Status</label>
                  <select name="status" id="status" className="w-full font-semibold input-border rounded p-1 text-gray-400">
                    <option value="todo" className={`text-gray-400 font-semibold p-1 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>To Do</option>
                    <option value="inprogress" className={`text-gray-400 font-semibold p-1 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>In Progress</option>
                    <option value="done" className={`text-gray-400 font-semibold p-1 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>Done</option>
                  </select>
                </div>
                <button className="bg-button font-bold text-base p-2 rounded-3xl w-full">Create Task</button>
              </form>
            </div>
            : null
          }

          {
            showAddNewTask ?  <span className="absolute top-0 left-0 w-screen h-screen bg-black opacity-50" onClick={() => setShowAddNewTask(false)}></span> : null
          }
        </main>
    );
}