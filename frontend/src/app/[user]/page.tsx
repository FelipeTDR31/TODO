'use client'

import { Box, Button, Drawer, IconButton, Menu, MenuItem, Modal, styled, Switch } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import anime from 'animejs/lib/anime.es.js';
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
import { getSubtasks } from "@/utils/requests/Subtask";
import { getTasks } from "@/utils/requests/Task";
import { createTable } from "@/utils/requests/Table";
import { createColumn } from "@/utils/requests/Column";
import { updateColumn } from "@/utils/requests/Column";
import { createSubtask } from "@/utils/requests/Subtask";
import { createTask } from "@/utils/requests/Task";
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
    const [numberOfSubtasks, setNumberOfSubtasks] = useState(1);
    const [showBoardCreation, setShowBoardCreation] = useState(false);
    const [showDrawer, setShowDrawer] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTable, setSelectedTable] = useState<Table>();
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          router.back();
      }

      async function fetchUser() {
          const user = await getUser(params.user);
          setUser(user);
          createTable("Default Board", user.id);
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
      if (user) {
          
          //fetchBoards(user.id);
          //fetchColumns(boards[0].id);
      }

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

    const createBoard = async () => {
      const boardName = document.getElementById("boardName") as HTMLInputElement
      const name = boardName.value
      const board = await createTable(name,user!.id)
      setBoards([...boards, board])
      setShowBoardCreation(false);
    }

    function hideDrawer() {
      setShowDrawer(!showDrawer);
      if (!showDrawer) {
        anime({
          targets: [".cBox", ".main-content"],
          width: "78vw",
          duration: 10,
        })
        anime({
          targets: ".main-content",
          translateX: "0vw",
          easing: "easeOutCubic",
          duration: 10,
        })
      }else{
        anime({
          targets: [".cBox", ".main-content"],
          width: "100vw",
          duration: 10,
        })
        anime({
          targets: ".main-content",
          translateX: "-22vw",
          easing: "easeOutCubic",
          duration: 10,
        })
      }
    }

    return (
        <Box className="kanban-template">
            <Drawer
             open={showDrawer} 
             anchor="left"
             onClose={hideDrawer}
             >
              <Box className={`aside-content flex flex-col justify-around p-6 font-bold w-[22vw] h-screen ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h3 className={`text-3xl -ml-3 -mt-8 ${mode === "dark" ? "text-white" : "text-black"}`}>{params.user} Kanban</h3>
                <Box>
                    <h4 className="text-gray-400 text-sm">Your Boards {"()"}</h4>
                    <Box className="mt-2 flex flex-col" id="boards">
                        {
                            boards.map((board, index) => {
                              let lastElement = boards.length -1
                              if (index === lastElement) {
                                return(
                                  <button id={board.id.toString()} key={index} className="chosen-board text-lg py-2 pl-10 pr-24 -ml-10 rounded-3xl hover:opacity-90">{board.name}</button>
                                )
                              }else{
                                return(
                                  <button id={board.id.toString()} key={index} className="text-lg py-2 pl-10 pr-24 -ml-10 rounded-3xl hover:opacity-90">{board.name}</button>
                                )
                              }
                            })
                        }
                        <button className="create-board text-lg py-2 pl-7 -ml-7 hover:opacity-90" onClick={() => {setShowBoardCreation(true)}}>+Create New Board</button>
                    </Box>
                </Box>
                <Box>
                    <Box className={`flex gap-3 items-center size-fit rounded-md py-2 px-16 ${mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`}>
                        <Image src={SunImg} alt="sun" width={25} height={25} />
                        <AntSwitch checked={mode === "dark" ? true : false} onClick={toggleMode} />
                        <Image src={MoonImg} alt="moon" width={20} height={20} />
                    </Box>
                    <IconButton onClick={hideDrawer} >
                      <Box className={`flex items-center gap-3 font-semibold py-2 pr-20 pl-16 -m-16 mt-[0.5rem] rounded-3xl hover:opacity-80 ${mode === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300"}`}>
                        <Image src={HideImg} alt="hide" width={25} height={25} />
                        <span className="text-lg">Hide Sidebar</span>
                      </Box>
                    </IconButton>
                </Box>
              </Box>
            </Drawer>

            <button onClick={hideDrawer} className="rounded-full flex justify-center items-center w-10 h-10 absolute bottom-[1rem] left-2 hover:bg-gray-600 z-10">
              <Image src={SeeImg} alt="see" width={25} height={25} />
            </button>

            <Box className={`cBox absolute top-0 right-0 font-bold flex items-center justify-between p-5 border-b border-l border-gray-500 w-[78vw] h-[15vh] ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h1 className={`text-xl ${mode === "dark" ? "text-white" : "text-black"}`}>Platform Launch</h1>
                <Box className="flex gap-3 items-center">
                    <button className="bg-button font-bold text-base p-3 px-4 rounded-3xl" onClick={() => {setShowAddNewTask(!showAddNewTask)}}>+ Add New Task</button>
                    <Box>
                      <Button onClick={() => setShowDropdown(!showDropdown)} className="dropdown">
                        <MoreVertIcon />
                      </Button>
                      <Menu
                        open={showDropdown}
                        onClose={() => setShowDropdown(false)}
                        anchorEl={document.querySelector(".dropdown")}
                      >
                        <MenuItem>Delete Board</MenuItem>
                        <MenuItem>Update Board</MenuItem>
                        <MenuItem>Delete Column</MenuItem>
                      </Menu>
                    </Box>
                </Box>
            </Box>

            <Box className="main-content w-[78vw] absolute top-[15vh] left-[22vw] h-[80vh] pl-4 pt-4 flex gap-6">
                <button className={`h-full w-[22vw] font-bold ${mode === "dark" ? "text-gray-500 bg-[#24242F]" : "text-gray-400 bg-[#E5E5E5]"} hover:opacity-90`}>+ New Column</button>
            </Box>

            <Modal
              open={showAddNewTask}
              onClose={() => setShowAddNewTask(false)}
              keepMounted
            >
              <Box className={`flex flex-col p-5 gap-4 absolute top-[5vh] left-[35vw] w-[30vw] h-[90vh] z-10 rounded-md ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h1 className={`font-semibold text-xl ${mode === "dark" ? "text-white" : "text-black"}`}>New Task</h1>
                <form className="flex flex-col gap-3">
                  <Box className="flex flex-col gap-2">
                    <label htmlFor="title" className={`font-semibold text-sm ${mode === "dark" ? "text-white" : "text-black"}`}>Title</label>
                    <Input placeholder="e.g: Take a coffee" type="text" id="title" name="title" className="w-full font-semibold" />  
                  </Box>
                  
                  <Box className="flex flex-col gap-2">
                    <label htmlFor="description" className={`font-semibold text-sm ${mode === "dark" ? "text-white" : "text-black"}`}>Description</label>
                    <textarea placeholder="e.g: Always good to take a break" name="description" id="description" rows={4} className="resize-none text-gray-400 text-sm p-2 rounded w-full input-border"></textarea>
                  </Box>
                  
                  <Box className="flex flex-col gap-2">
                    <label className={`font-semibold text-sm ${mode === "dark" ? "text-white" : "text-black"}`}>Subtasks</label>
                    <Box className="flex flex-col items-center p-1 gap-2 overflow-y-auto scrollbar-hidden max-h-[5.2rem] rounded-lg bg-[rgba(0,0,0,0.2)]">
                      {
                        [...Array(numberOfSubtasks)].map((_, index) => (
                          <Box className="flex gap-2 subtasks" key={index} id={index.toString()}>
                            <Input type="text" className="subtasksInput font-semibold text-sm w-[20rem]" name="subtasks" />
                            <button type="button" className="text-gray-400 font-bold" onClick={() => {if (numberOfSubtasks > 1) document.querySelectorAll(".subtasks").forEach((subtask) => subtask.id == index.toString() ? subtask.remove() : null)}}>X</button>
                          </Box>
                        ))
                      }
                    </Box>
                    <button className="bg-button font-bold text-base p-2 rounded-3xl w-full" onClick={() => setNumberOfSubtasks(numberOfSubtasks + 1)}>+ Add New Subtask</button>
                  </Box>
                  
                  <Box className="flex flex-col gap-2">
                    <label htmlFor="status" className={`font-semibold text-sm ${mode === "dark" ? "text-white" : "text-black"}`}>Status</label>
                    <select name="status" id="status" className="w-full font-semibold input-border rounded p-1 text-gray-400">
                      <option value="todo" className={`text-gray-400 font-semibold p-1 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>To Do</option>
                      <option value="inprogress" className={`text-gray-400 font-semibold p-1 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>In Progress</option>
                      <option value="done" className={`text-gray-400 font-semibold p-1 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>Done</option>
                    </select>
                  </Box>
                  <button className="bg-button font-bold text-base p-2 rounded-3xl w-full">Create Task</button>
                </form>
              </Box>
            </Modal>

            <Modal
              open={showBoardCreation}
              onClose={() => setShowBoardCreation(false)}
              keepMounted
            >
              <Box className={`flex flex-col items-center font-semibold p-5 gap-4 absolute top-[30vh] left-[35vw] z-10 rounded-md ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <Input placeholder="Board Name" type="text" id="boardName" name="boardName" />
                <button onClick={createBoard} className="bg-button font-bold text-base p-2 rounded-3xl w-full">Create Board</button>
              </Box>
            </Modal>
            
        </Box>
    );
}