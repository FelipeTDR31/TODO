'use client'

import { Box, Button, Drawer, FormControl, InputLabel, Menu, MenuItem, Modal, Select, SelectChangeEvent, styled, Switch } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import anime from 'animejs/lib/anime.es.js';
import Image from "next/image";
import SunImg from "@/utils/images/sun.png";
import MoonImg from "@/utils/images/moon.png";
import HideImg from "@/utils/images/hide.png";
import SeeImg from "@/utils/images/see.png";
import React, { MouseEventHandler, useContext, useEffect, useRef, useState } from "react";
import Column from "@/components/Column";
import { Input } from "@/utils/Tags/Input";
import { useRouter } from "next/navigation";
import { getUser } from "@/utils/requests/User";
import { getTables } from "@/utils/requests/Table";
import { createColumn, getColumns } from "@/utils/requests/Column";
import { Subtask } from "@/utils/requests/Subtask";
import { createTable } from "@/utils/requests/Table";
import { createTask } from "@/utils/requests/Task";
import { User } from "@/utils/requests/User";
import { Table } from "@/utils/requests/Table";
import { Column as ColumnType } from "@/utils/requests/Column";
import { Textarea } from "@/utils/Tags/Textarea";
import { createRoot, hydrateRoot } from "react-dom/client";
import Task from "@/components/Task";
import { ModeContext } from "@/components/Context";
export default function UserPage({ params }: { params: { user: string } }) {
    const context = useContext(ModeContext);
    const [showAddNewTask, setShowAddNewTask] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [boards, setBoards] = useState<Table[]>([]);
    const { selectedTable, setSelectedTable } = context!;
    const [numberOfSubtasks, setNumberOfSubtasks] = useState(1);
    const [showBoardCreation, setShowBoardCreation] = useState(false);
    const [showDrawer, setShowDrawer] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [status, setStatus] = useState<string>("");
    const [input, setInput] = useState<string | undefined>();
    let isFirstRender = true;
    const router = useRouter();
    const hasMounted = useRef(false);
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          //router.push("/login");
      }

      async function fetchUser() {
          const user = await getUser(params.user);
          setUser(user);
      }

      async function fetchBoards(userID : number) {
          const boards = await getTables(userID);
          setSelectedTable(boards[boards.length - 1]);
          fetchColumns(boards[boards.length - 1].id);
          setBoards(boards);
      }

      async function fetchColumns(tableID : number) {
          const columns = await getColumns(tableID);
          context!.setColumns(columns);
      }

      if (!hasMounted.current) {
        fetchUser();
        if (user!=null) {
            fetchBoards(user.id);
            hasMounted.current = true;
        }
        
      }

    }, [user]);

    const toggleMode = (e : any) => {
        const newMode = context!.mode === "light" ? "dark" : "light";
        const body = document.querySelector("body");
        context!.setMode(newMode);
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
              backgroundColor: context!.mode === 'dark' ? '#177ddc' : '#1890ff',
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
          context!.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
          boxSizing: 'border-box',
        },
      }));

    const createBoard = async () => {
      const boardName = document.getElementById("boardName") as HTMLInputElement
      const name = boardName.value
      const board = await createTable(name,user!.id)
      if (board) {
        setBoards([...boards, board]);
        setSelectedTable(board);
        setShowBoardCreation(false);
      }
    }

    async function changeBoard (e : React.MouseEvent<HTMLButtonElement>) {
      const target = e.currentTarget
      const prevChosenBoard = document.querySelector(".chosen-board")
      if (!target.classList.contains("chosen-board")) {
        prevChosenBoard?.classList.remove("chosen-board");
        target.classList.add("chosen-board");
        const id = target.id
        const board = boards.find(board => board.id === Number(id))
        setSelectedTable(board!);
        context!.setColumns(await getColumns(board!.id));
      }
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

    function handleSelectChange(e : SelectChangeEvent)  {
      setStatus(e.target.value);
  }

  function handleInputChange(e : React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === "Enter" && input) {
        createColumn(input, 1, selectedTable!.id)
          .then(async () => {
            context!.setColumns(await getColumns(selectedTable!.id));
            setInput(undefined);
            const inputElement = document.getElementById("createColumn") as HTMLInputElement | null;
            if (inputElement) {
              inputElement.parentElement!.parentElement!.parentElement!.remove();
            }
          })
          .catch(() => {
            setInput(undefined);
          });
      } else if (e.key === "Escape") {
        const inputElement = document.getElementById("createColumn") as HTMLInputElement | null;
        if (inputElement) {
          inputElement.parentElement!.parentElement!.parentElement!.remove();
          setInput(undefined);
        }
      }
    };

    const createColumnInput = document.getElementById("createColumn");
    if (createColumnInput) {
      createColumnInput.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (createColumnInput) {
        createColumnInput.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [input]);


  function addColumn() {
    let inputElement = <Input type="text" className='w-[12vw]' id="createColumn" defaultValue={input} onChange={handleInputChange} autoFocus />
    let mainContent = document.querySelector(".main-content")
    let root = document.createElement("span")
    mainContent?.insertBefore(root, mainContent.lastChild)
    if (root) {
      createRoot(root).render(inputElement);
      
    }
  }
  useEffect(() => {
    const addColumnInput = document.getElementById("addColumn");
    const createColumnInput = document.getElementById("createColumn");

    const handleClick = () => {
      if (createColumnInput == null && input == undefined) {
        addColumn();
        setInput("")
      }
    };

    addColumnInput?.addEventListener("click", handleClick);

    return () => {
      addColumnInput?.removeEventListener("click", handleClick);
    };
  }, [input]);

  async function CreateTask() {
    const taskName = document.getElementById("title") as HTMLInputElement;
    const name = taskName.value;
    const taskDescription = document.getElementById("description") as HTMLInputElement;
    const description = taskDescription.value;
    const subtasks = document.querySelectorAll(".subtasksInput") as NodeListOf<HTMLInputElement>;
    let subtasksArray : Subtask[] = [];
    for (let i = 0; i < subtasks.length; i++) {
      const e = subtasks[i].firstChild?.firstChild as HTMLInputElement;

      subtasksArray.push({
        Description: e.value,
        IsDone: false,
        Id: 0,
        TaskId: 0
      })
    }
    const order = 1;
    createTask(name, description, Number(status), order, subtasksArray)
    .then(async (response) => {
      const columns = await getColumns(selectedTable!.id);
      context!.setColumns(columns);
      setShowAddNewTask(false);
    })
    
  }

    return (
        <Box className="kanban-template">
            <Drawer
             open={showDrawer} 
             anchor="left"
             onClose={hideDrawer}
             keepMounted
             >
              <Box className={`aside-content flex flex-col justify-around p-6 font-bold w-[22vw] h-screen ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h3 className={`text-3xl -ml-3 -mt-8 ${context!.mode === "dark" ? "text-white" : "text-black"}`}>{params.user} Kanban</h3>
                <Box className="flex flex-col h-1/2">
                    <h4 className="text-gray-400 text-sm">Your Boards {`(${boards.length})`}</h4>
                    <Box className="flex flex-col h-4/5 mt-2">
                      <Box className={`flex flex-col-reverse gap-2 p-3 overflow-auto scrollbar-hidden min-h-1/4 max-h-full rounded-md ${context!.mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`} id="boards">
                          {
                              boards.map((board, index) => {
                                let lastElement = boards.length -1
                                if (index === lastElement && isFirstRender) {
                                  isFirstRender = false
                                  return(
                                    <button onClick={changeBoard} id={board.id.toString()} key={index} className={`chosen-board text-sm rounded-3xl px-3 py-2 hover:opacity-90 ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>{board.name}</button>
                                  )
                                }else{
                                  return(
                                    <button onClick={changeBoard} id={board.id.toString()} key={index} className={`text-sm rounded-3xl px-3 py-2 hover:opacity-90 ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>{board.name}</button>
                                  )
                                }
                              })
                          }
                      </Box>
                      <button className="create-board text-lg py-2 pl-7 -ml-7 hover:opacity-90" onClick={() => {setShowBoardCreation(true)}}>+Create New Board</button>
                    </Box>
                </Box>
                <Box>
                    <Box className={`flex gap-3 items-center size-fit rounded-md py-2 px-16 ${context!.mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`}>
                        <Image src={SunImg} alt="sun" width={25} height={25} />
                        <AntSwitch checked={context!.mode === "dark" ? true : false} onClick={toggleMode} />
                        <Image src={MoonImg} alt="moon" width={20} height={20} />
                    </Box>
                    <button onClick={hideDrawer} >
                      <Box className={`flex items-center gap-3 font-semibold py-2 pr-20 pl-16 -m-16 mt-[0.5rem] rounded-3xl hover:opacity-80 ${context!.mode === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-300"}`}>
                        <Image src={HideImg} alt="hide" width={25} height={25} />
                        <span className="text-lg">Hide Sidebar</span>
                      </Box>
                    </button>
                </Box>
              </Box>
            </Drawer>

            <button onClick={hideDrawer} className="rounded-full flex justify-center items-center w-10 h-10 fixed bottom-[1rem] left-2 hover:bg-gray-600 z-10">
              <Image src={SeeImg} alt="see" width={25} height={25} />
            </button>

            <Box className={`cBox absolute top-0 right-0 font-bold flex items-center justify-between p-5 border-b border-l border-gray-500 w-[78vw] h-[15vh] ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h1 className={`text-xl ${context!.mode === "dark" ? "text-white" : "text-black"}`}>Platform Launch</h1>
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

            <Box className="main-content min-w-[78vw] max-w-[100vw] overflow-auto absolute top-[15vh] left-[22vw] h-[80vh] pl-4 pt-4 flex gap-6">
                {
                  context!.columns.map((column, index) => {
                    if (column.TableId == selectedTable!.id) {
                      return(
                        <Column
                          key={index}
                          name={column.Name}
                          mode={context!.mode}
                          boardId={column.TableId}
                          columnId={column.Id}
                          tasks={column.Tasks!.$values}
                        />
                      )
                    }
                  })
                }
                <button id="addColumn" className={`h-full w-[22vw] flex-shrink-0 font-bold ${context!.mode === "dark" ? "text-gray-500 bg-[#24242F]" : "text-gray-400 bg-[#E5E5E5]"} hover:opacity-90`}>+ New Column</button>
            </Box>

            <Modal
              open={showAddNewTask}
              onClose={() => setShowAddNewTask(false)}
              keepMounted
            >
              <Box className={`flex flex-col p-5 gap-4 absolute top-[5vh] left-[35vw] w-[30vw] h-[90vh] z-10 rounded-md ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h1 className={`font-semibold text-xl ${context!.mode === "dark" ? "text-white" : "text-black"}`}>New Task</h1>
                <form className="flex flex-col gap-3">
                  <Box className="flex flex-col gap-2">
                    <label htmlFor="title" className={`font-semibold text-sm ${context!.mode === "dark" ? "text-white" : "text-black"}`}>Title</label>
                    <Input placeholder="e.g: Take a coffee" type="text" id="title" name="title" />  
                  </Box>
                  
                  <Box className="flex flex-col gap-2">
                    <label htmlFor="description" className={`font-semibold text-sm ${context!.mode === "dark" ? "text-white" : "text-black"}`}>Description</label>
                    <Textarea 
                    placeholder="e.g: Always good to take a break" name="description" id="description" rows={4} 
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "gray",
                        fontWeight: "600",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        padding: "0.5rem",
                        fontSize: "0.9rem",
                      },
                      "& .MuiInput-underline:before": {
                          borderBottomColor: "gray",
                      },
                      "& .MuiInput-underline:after": {
                          borderBottomColor: "gray",
                      },
                    }} />
                  </Box>
                  
                  <Box className="flex flex-col gap-2">
                    <label className={`font-semibold text-sm ${context!.mode === "dark" ? "text-white" : "text-black"}`}>Subtasks</label>
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
                    <button type="button" className="bg-button font-bold text-base p-2 rounded-3xl w-full" onClick={() => setNumberOfSubtasks(numberOfSubtasks + 1)}>+ Add New Subtask</button>
                  </Box>
                  
                  <Box className="flex flex-col gap-2">
                    <FormControl>
                      <InputLabel id="Status" variant="standard" style={{color: "gray", fontWeight: "600", padding: "0.2rem"}}>Status</InputLabel>
                      <Select 
                      label="Status" 
                      name="status" 
                      id="statusSelect"
                      value={status}
                      onChange={handleSelectChange}
                      variant="standard"
                      sx={{
                        "& .MuiSelect-standard": {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          color: "gray",
                          fontWeight: "600",
                          padding: "0.5rem",
                        }  
                      }}
                      >
                          {
                            context!.columns.map((column) => {
                              return (
                                <MenuItem value={column.Id} style={{color: "gray", fontWeight: "600", padding: "0.3rem"}}>{column.Name}</MenuItem>
                              )
                            })
                          }
                      </Select>
                    </FormControl>
                  </Box>
                  <button type="button" className="bg-button font-bold text-base p-2 rounded-3xl w-full" onClick={CreateTask}>Create Task</button>
                </form>
              </Box>
            </Modal>

            <Modal
              open={showBoardCreation}
              onClose={() => setShowBoardCreation(false)}
              keepMounted
            >
              <Box className={`flex flex-col items-center font-semibold p-5 gap-4 absolute top-[30vh] left-[35vw] z-10 rounded-md ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <Input placeholder="Board Name" type="text" id="boardName" name="boardName" className="w-[20rem]" onKeyDown={(e) => {e.key === "Enter" ? createBoard() : null}} />
                <button onClick={createBoard} className="bg-button font-bold text-base p-2 rounded-3xl w-full">Create Board</button>
              </Box>
            </Modal>
            
        </Box>
    );
}