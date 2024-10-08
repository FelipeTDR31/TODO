'use client'

import { Box, Button, Drawer, FormControl, InputLabel, Menu, MenuItem, Modal, Select, SelectChangeEvent, styled, Switch } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import anime from 'animejs/lib/anime.es.js';
import Image from "next/image";
import SunImg from "@/utils/images/sun.png";
import MoonImg from "@/utils/images/moon.png";
import HideImg from "@/utils/images/hide.png";
import SeeImg from "@/utils/images/see.png";
import React, { useContext, useEffect, useRef, useState } from "react";
import Column from "@/components/Column";
import { Input } from "@/utils/Tags/Input";
import { useRouter } from "next/navigation";
import { deleteUser, getUser, updateUser } from "@/utils/requests/User";
import { deleteTable, getTables, updateTable } from "@/utils/requests/Table";
import { createColumn, deleteColumn, getColumns } from "@/utils/requests/Column";
import { Subtask } from "@/utils/requests/Subtask";
import { createTable } from "@/utils/requests/Table";
import { createTask } from "@/utils/requests/Task";
import { User } from "@/utils/requests/User";
import { Table } from "@/utils/requests/Table";
import { Textarea } from "@/utils/Tags/Textarea";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ModeContext } from "@/components/Context";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
    const [showUserOptions, setShowUserOptions] = useState(false);
    const [showUserAccountInfo, setShowUserAccountInfo] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [status, setStatus] = useState<string>("");
    const [input, setInput] = useState<string | undefined>();
    const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false);
    const [showUpdateBoardModal, setShowUpdateBoardModal] = useState(false);
    const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string>("");
    let isFirstRender = true;
    const router = useRouter();
    const hasMounted = useRef(false);
    
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
          router.push("/login");
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
      if (name === "") {
        toast.error("Name is required", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      if (name.length > 50) {
        toast.error("Name must be less than 50 characters", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      const board = await createTable(name,user!.id)
      if (board) {
        setBoards([...boards, board]);
        setSelectedTable(board);
        setShowBoardCreation(false);
      }
    }

    function deleteBoard() {
      if (boards.length > 1) {
        deleteTable(selectedTable!.id)
        .then(async () => {
          let boards = await getTables(user!.id);
          setSelectedTable(boards[boards.length - 1]);
          setBoards(boards);
          let columns = await getColumns(boards[boards.length - 1].id);
          context!.setColumns(columns);
          setShowDeleteBoardModal(false);
        })
      }else{
        toast.error("Unable to delete last board", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
      }
    }

    function updateBoard() {
      let updateInput = document.getElementById("updateBoard") as HTMLInputElement
      let name = updateInput.value
      if (name === "") {
        toast.error("Name is required", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      if (name.length > 50) {
        toast.error("Name must be less than 50 characters", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      updateTable(selectedTable!.id, name, user!.id)
      .then(async () => {
        let boards = await getTables(user!.id);
        setSelectedTable(boards[boards.length - 1]);
        setBoards(boards);
        let columns = await getColumns(boards[boards.length - 1].id);
        context!.setColumns(columns);
        setShowUpdateBoardModal(false);
      })
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

    function handleAddTaskModal() {
      if (context?.columns.length === 0) {
        toast.error("Add a column first", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        })
      }else{
        setShowAddNewTask(!showAddNewTask);
      }
    }

    function handleSelectChange(e : SelectChangeEvent)  {
      const value = e.target.value;
      if (value === "") {
        toast.error("Status is required", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
      } else {
        setStatus(e.target.value);
      }
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

  function DeleteColumn () {
    deleteColumn(Number(selectedColumnId))
    .then(async () => {
      context!.setColumns(await getColumns(selectedTable!.id));
      setShowDeleteColumnModal(false);
    })
  }

  async function CreateTask() {
    const taskName = document.getElementById("title") as HTMLInputElement;
    const name = taskName.value;
    const taskDescription = document.getElementById("description") as HTMLInputElement;
    const description = taskDescription.value;
    const subtasks = document.querySelectorAll(".subtasksInput") as NodeListOf<HTMLInputElement>;
    let subtasksArray : Subtask[] = [];
    let hasError = false;
    for (let i = 0; i < subtasks.length; i++) {
      const e = subtasks[i].firstChild?.firstChild as HTMLInputElement;
      if (e.value === "") {
        hasError = true;
        toast.error("Subtask is required", {
          position: "top-center",
        });
        break;
      } else {
        subtasksArray.push({
          Description: e.value,
          IsDone: false,
          Id: 0,
          TaskId: 0
        })
      }
    }
    if (name === "" || description === "") {
      hasError = true;
      toast.error("Name and description are required", {
        position: "top-center",
      });
    }
    if (hasError) {
      return;
    }
    const order = 1;
    createTask(name, description, Number(status), order, subtasksArray)
    .then(async (response) => {
      const columns = await getColumns(selectedTable!.id);
      context!.setColumns(columns);
      setShowAddNewTask(false);
    })
    
  }

  async function UpdateUser() {
    const email = document.getElementById("changeEmail");
    const password = document.getElementById("changePassword");
    if (email && password===null) {
      const newEmail = document.getElementById("newEmail") as HTMLInputElement;
      const confirmNewEmail = document.getElementById("confirmNewEmail") as HTMLInputElement;
      if (newEmail.value !== confirmNewEmail.value) {
        toast.error("Emails do not match", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(newEmail.value)) {
        toast.error("Email is not valid", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      updateUser(user!.id, newEmail.value, null , null)
      setShowEmailModal(false)
      window.location.reload();
    }else if (email===null && password) {
      const oldPassword = document.getElementById("oldPassword") as HTMLInputElement;
      const newPassword = document.getElementById("newPassword") as HTMLInputElement;
      const confirmNewPassword = document.getElementById("confirmNewPassword") as HTMLInputElement;
      if (newPassword.value !== confirmNewPassword.value) {
        toast.error("Passwords do not match", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      if (oldPassword.value.length < 8 || newPassword.value.length < 8) {
        toast.error("Password must be at least 8 characters long", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      updateUser(user!.id, null, oldPassword.value, newPassword.value)
      setShowPasswordModal(false)
      window.location.reload();
    }
  }

  async function DeleteUser() {
    deleteUser(user!.id)
    .then(() => {
      localStorage.removeItem("token")
      router.push("/login");
    })
  }

    return (
        <Box className="kanban-template">
            {/* Sidebar Drawer */}
            <Drawer
             open={showDrawer} 
             anchor="left"
             onClose={hideDrawer}
             keepMounted
             >
              <Box className={`aside-content flex flex-col justify-around p-6 font-bold w-[22vw] h-screen ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <Box>
                      <Button onClick={() => setShowUserOptions(!showUserOptions)} className="userOptions" style={{color: `${context!.mode === "dark" ? "white" : "black"}`, fontWeight: "bold", fontSize: "1.5rem"}}>{params.user} Kanban</Button>
                      <Menu
                        open={showUserOptions}
                        onClose={() => setShowUserOptions(false)}
                        anchorEl={document.querySelector(".userOptions")}
                      >
                        <MenuItem onClick={() => {setShowUserAccountInfo(true);setShowUserOptions(false)}} style={{color: "#645FC7", fontWeight: "600", padding: "0.5rem"}}>Manage Account</MenuItem>
                        <MenuItem onClick={() => {setShowUserOptions(false); localStorage.removeItem("token"); router.push("/login")}} style={{color: "#645FC7", fontWeight: "600", padding: "0.5rem"}}>LogOut</MenuItem>
                      </Menu>
                </Box>
                <Box className="flex flex-col h-1/2">
                    <h4 className="text-gray-400 text-sm">Your Boards {`(${boards.length})`}</h4>
                    <Box className="flex flex-col h-4/5 mt-2">
                      <Box className={`flex flex-col-reverse gap-2 p-3 overflow-auto min-h-1/4 max-h-full rounded-md ${context!.mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`} id="boards">
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
            
            {/* Top Bar */}
            <Box className={`cBox absolute top-0 right-0 font-bold flex items-center justify-between p-5 border-b border-l border-gray-500 w-[78vw] h-[15vh] ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h1 className={`text-xl ${context!.mode === "dark" ? "text-white" : "text-black"}`}>Platform Launch</h1>
                <Box className="flex gap-3 items-center">
                    <button className="bg-button font-bold text-base p-3 px-4 rounded-3xl" onClick={handleAddTaskModal}>+ Add New Task</button>
                    <Box>
                      <Button onClick={() => setShowDropdown(!showDropdown)} className="dropdown">
                        <MoreVertIcon />
                      </Button>
                      <Menu
                        open={showDropdown}
                        onClose={() => setShowDropdown(false)}
                        anchorEl={document.querySelector(".dropdown")}
                      >
                        <MenuItem onClick={() => {setShowDeleteBoardModal(true); setShowDropdown(false)}} style={{color: "#645FC7", fontWeight: "600", padding: "0.5rem"}}>Delete Board</MenuItem>
                        <MenuItem onClick={() => {setShowUpdateBoardModal(true); setShowDropdown(false)}} style={{color: "#645FC7", fontWeight: "600", padding: "0.5rem"}}>Update Board</MenuItem>
                        <MenuItem onClick={() => {setShowDeleteColumnModal(true); setShowDropdown(false)}} style={{color: "#645FC7", fontWeight: "600", padding: "0.5rem"}}>Delete Column</MenuItem>
                      </Menu>
                    </Box>
                </Box>
            </Box>

            <Modal
              open={showDeleteBoardModal}
              onClose={() => setShowDeleteBoardModal(false)}
            >
              <Box className={`flex flex-col rounded-xl font-semibold gap-3 p-5 absolute top-[35vh] left-[35vw] ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                  <p>Are you sure you want to delete this board?</p>
                  <button onClick={deleteBoard} className="bg-button text-sm p-3 px-2 rounded-3xl">Delete Board</button>
                  <button onClick={() => setShowDeleteBoardModal(false)} className="text-sm p-3 px-2 rounded-3xl border border-gray-500 hover:opacity-90">Cancel</button>
              </Box>
            </Modal>

            <Modal
            open={showUpdateBoardModal}
            onClose={() => setShowUpdateBoardModal(false)}
            >
              <Box className={`flex flex-col rounded-xl font-semibold gap-3 p-5 absolute top-[35vh] left-[35vw] ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                  <h3>Update Board</h3>
                  <Input type="text" id="updateBoard" placeholder="New Board Name" />
                  <button onClick={updateBoard} className="bg-button text-sm p-3 px-2 rounded-3xl">Update Board</button>
                  <button onClick={() => setShowUpdateBoardModal(false)} className="text-sm p-3 px-2 rounded-3xl border border-gray-500 hover:opacity-90">Cancel</button>
              </Box>
            </Modal>

            <Modal
            open={showDeleteColumnModal}
            onClose={() => setShowDeleteColumnModal(false)}
            >
              <Box className={`flex w-[20vw] flex-col rounded-xl font-semibold gap-3 p-5 absolute top-[35vh] left-[35vw] ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
              <FormControl>
                      <InputLabel id="deleteColumn" variant="standard" style={{color: "gray", fontWeight: "600", padding: "0.2rem"}}>Columns</InputLabel>
                      <Select 
                      label="deleteColumn" 
                      name="deleteColumn" 
                      id="deleteColumnSelect"
                      value={selectedColumnId}
                      onChange={(e) => setSelectedColumnId(e.target.value)}
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
                            context!.columns.map((column, index) => {
                              return (
                                <MenuItem key={index} value={column.Id} style={{color: "gray", fontWeight: "600", padding: "0.3rem"}}>{column.Name}</MenuItem>
                              )
                            })
                          }
                      </Select>
                    </FormControl>
                  <button onClick={DeleteColumn} className="bg-button text-sm p-3 px-2 rounded-3xl">Delete Column</button>
                  <button onClick={() => setShowDeleteColumnModal(false)} className="text-sm p-3 px-2 rounded-3xl border border-gray-500 hover:opacity-90">Cancel</button>
              </Box>
            </Modal>

            <ToastContainer />

            {/* Main Content */}
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
              <Box className={`flex flex-col p-5 gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-fit max-h-fit z-10 rounded-md ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
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
                    <Box className="flex flex-col items-center p-1 gap-2 overflow-y-auto max-h-[5.2rem] rounded-lg bg-[rgba(0,0,0,0.2)]">
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
                            context!.columns.map((column, key) => {
                              return (
                                <MenuItem key={key} value={column.Id} style={{color: "gray", fontWeight: "600", padding: "0.3rem"}}>{column.Name}</MenuItem>
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
              <Box className={`flex flex-col items-center font-semibold p-5 gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <Input placeholder="Board Name" type="text" id="boardName" name="boardName" className="w-[20rem]" onKeyDown={(e) => {e.key === "Enter" ? createBoard() : null}} />
                <button onClick={createBoard} className="bg-button font-bold text-base p-2 rounded-3xl w-full">Create Board</button>
              </Box>
            </Modal>
            
            {
              user != null ?
                <Modal
                open={showUserAccountInfo}
                onClose={() => setShowUserAccountInfo(false)}
                keepMounted
                >
                  <Box className={`flex flex-col items-center font-semibold p-5 gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md ${context!.mode === "dark" ? "bg-secondary-dark text-white" : "bg-secondary-light text-black"}`}>
                    <h1 className="text-2xl">User Account Info</h1>
                    <p>Name: {user!.name}</p>
                    <p>Email: {user!.email}</p>
                    <button className="bg-button font-bold text-base p-2 rounded-3xl w-full" onClick={() => {setShowPasswordModal(true); setShowUserAccountInfo(false)}}>Change Password</button>
                    <button className="bg-button font-bold text-base p-2 rounded-3xl w-full" onClick={() => {setShowEmailModal(true); setShowUserAccountInfo(false)}}>Change Email</button>
                    <button className="text-[rgba(255,0,0,0.8)] border border-[rgba(255,0,0,0.8)] hover:opacity-70 font-bold text-base p-2 rounded-3xl w-full" onClick={() => {setShowDeleteAccountModal(true); setShowUserAccountInfo(false)}}>Delete Account</button>
                  </Box>
                </Modal>
              : null
            }

            <Modal
              open={showPasswordModal}
              onClose={() => setShowPasswordModal(false)}
            >
              <Box className={`flex flex-col items-center font-semibold p-5 gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <Input placeholder="Old Password" type="password" id="oldPassword" name="oldPassword" />
                <Input placeholder="New Password" type="password" id="newPassword" name="newPassword" />
                <Input placeholder="Confirm New Password" type="password" id="confirmNewPassword" name="confirmNewPassword" />
                <button className="bg-button font-bold text-base p-2 rounded-3xl w-full" id="changePassword" onClick={() => UpdateUser()}>Change Password</button>
              </Box>
            </Modal>

            <Modal
              open={showEmailModal}
              onClose={() => setShowEmailModal(false)}
            >
              <Box className={`flex flex-col items-center font-semibold p-5 gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <Input placeholder="New Email" type="email" id="newEmail" name="newEmail" />
                <Input placeholder="Confirm New Email" type="email" id="confirmNewEmail" name="confirmNewEmail" />
                <button className="bg-button font-bold text-base p-2 rounded-3xl w-full" id="changeEmail" onClick={() => UpdateUser()}>Change Email</button>
              </Box>
            </Modal>

            <Modal
              open={showDeleteAccountModal}
              onClose={() => setShowDeleteAccountModal(false)}
            >
              <Box className={`flex flex-col items-center font-semibold p-5 gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-md ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                <h1>Are you sure you want to delete your account?</h1>
                <button className="bg-button font-bold text-base p-2 rounded-3xl w-full" id="deleteAccount" onClick={() => DeleteUser()}>Yes</button>
                <button className="text-[rgba(255,0,0,0.8)] border border-[rgba(255,0,0,0.8)] hover:opacity-70 font-bold text-base p-2 rounded-3xl w-full" onClick={() => setShowDeleteAccountModal(false)}>No</button>
              </Box>
            </Modal>
        </Box>
    );
}