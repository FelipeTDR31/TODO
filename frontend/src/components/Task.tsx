'use client'

import { Box, Button, Checkbox, FormControl, InputLabel, Menu, MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material";
import { useContext, useEffect, useState, useRef } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import interact from "interactjs";
import { InteractEvent } from "@interactjs/types";
import { Subtask, updateSubtask } from "@/utils/requests/Subtask";
import { ModeContext } from "./Context";
import { updateTask, deleteTask } from "@/utils/requests/Task";
import { getColumns } from "@/utils/requests/Column";
import { Input } from "@/utils/Tags/Input";
import { Textarea } from "@/utils/Tags/Textarea";

export default function Task ({mode, id, columnId, name, description, subtasks} : {mode: "light" | "dark", name: string, description: string, subtasks: Subtask[], id: number, columnId: number}) {
    const [showDetails, setShowDetails] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
    const [checked, setChecked] = useState(subtasks?.map(subtask => subtask.IsDone) || []);
    const [taskName, setTaskName] = useState(name);
    const taskNameRef = useRef<string>(taskName);
    const [taskDescription, setTaskDescription] = useState(description);
    const taskDescriptionRef = useRef<string>(taskDescription);
    const [subtaskDescriptions, setSubtaskDescriptions] = useState(subtasks?.map(subtask => subtask.Description) || []);
    const subtaskDescriptionsRef = useRef<string[]>(subtaskDescriptions);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isEditingSubtasks, setIsEditingSubtasks] = useState<boolean[]>(subtasks?.map(() => false) || []);
    const context = useContext(ModeContext);
    const position = {x: 0, y: 0}

    function handleSubtaskClick(e: React.MouseEvent) {
        const target = e.target as HTMLElement;
        const checkbox = target.closest('input[type="checkbox"]');
        if (checkbox) {
          const id = checkbox.id.split("-")[1];
          const index = subtasks?.indexOf(subtasks?.find(subtask => subtask.Id == Number(id))!);
          if (index !== undefined) {
            const newChecked = [...checked];
            newChecked[index] = !newChecked[index];
            updateSubtask(subtasks![index].Id, newChecked[index])
            setChecked(newChecked);
            const label = document.querySelector(`#label-${id}`);
            if (label) {
              label.classList.toggle("line-through", newChecked[index]);
              label.classList.toggle("text-gray-400", newChecked[index]);
            }
          }
        }
      }

      function DeleteTask() {
        deleteTask(id)
        .then(async () => context?.setColumns(await getColumns(context?.selectedTable?.id || 0)))
        setShowDeleteTaskModal(false);
    }

      function handleSetShowDetails() {
        setShowDetails(!showDetails);
      }

    function handleSelectChange(e : SelectChangeEvent)  {
        e.preventDefault();
        e.stopPropagation();
        if (columnId !== Number(e.target.value)) {
            updateTask(id, name, description, Number(e.target.value))
            .then(async () => context?.setColumns(await getColumns(context?.selectedTable?.id || 0)))
        }
    }

    useEffect(() => {
        interact(".draggableTask").draggable({
            onmove: (event : InteractEvent) => {
                position.x += event.dx * 0.5
                position.y += event.dy * 0.5
                event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
                event.target.style.transition = "none"
            }
            , onend: (event : InteractEvent) => {
                event.target.style.transform = `translate(0px, 0px)`
                let idTaskElement = event.target.id.split("-")[1]
                const column = event.relatedTarget?.parentElement
                if (column !=undefined && column.id != `column-${columnId}` && id == Number(idTaskElement)) {
                    try {
                        event.target.removeEventListener("click", handleSetShowDetails)
                        updateTask(id, name, description, Number(column.id.split("-")[1]))
                        .then(async () => context?.setColumns(await getColumns(context?.selectedTable?.id || 0)))
                    } catch (error) {
                        console.log(error)
                    }
                }
                position.x = 0
                position.y = 0
            }
        }).styleCursor(false)

        if(document.getElementById(`task-${id}`)) {
            document.getElementById(`task-${id}`)?.addEventListener("click", handleSetShowDetails)
        }
    }, [])

    useEffect(() => {
        function handleChangeTaskName(e: KeyboardEvent) {
            if (e.key === "Enter") {
                e.stopPropagation()
                console.log(taskName)
                taskNameRef.current = taskName
                setIsEditingName(false);
                updateTask(id, taskName, description, columnId)
            }
        }

        const changeTaskNameInput = document.getElementById(`task-name-${id}`) as HTMLInputElement;
        if (changeTaskNameInput) {
            changeTaskNameInput.addEventListener("keydown", handleChangeTaskName);
        }

        return () => {
            if (changeTaskNameInput) {
                changeTaskNameInput.removeEventListener("keydown", handleChangeTaskName);
            }
        };
    }, [taskName])

    useEffect(() => {
        function handleChangeTaskDescription(e: KeyboardEvent) {
            if (e.key === "Enter") {
                e.stopPropagation()
                taskDescriptionRef.current = taskDescription
                setIsEditingDescription(false);
                updateTask(id, name, taskDescription, columnId)
            }
        }

        const changeTaskDescriptionInput = document.getElementById(`task-description-${id}`) as HTMLInputElement;
        if (changeTaskDescriptionInput) {
            changeTaskDescriptionInput.addEventListener("keydown", handleChangeTaskDescription);
        }

        return () => {
            if (changeTaskDescriptionInput) {
                changeTaskDescriptionInput.removeEventListener("keydown", handleChangeTaskDescription);
            }
        };
    }, [taskDescription])

    function handleSubtaskDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        const index = subtasks?.indexOf(subtasks?.find(subtask => subtask.Id == Number(e.target.id.split("-")[1]))!);
        if (index !== undefined) {
            const newSubtaskDescriptions = [...subtaskDescriptions];
            newSubtaskDescriptions[index] = e.target.value;
            setSubtaskDescriptions(newSubtaskDescriptions);
        }
    }

    function handleSubtaskOnBlur(e: React.FocusEvent<HTMLInputElement>) {
        const index = subtasks?.indexOf(subtasks?.find(subtask => subtask.Id == Number(e.target.id.split("-")[1]))!);
        if (index !== undefined) {
            const newIsEditingSubtasks = [...isEditingSubtasks];
            newIsEditingSubtasks[index] = false;
            setIsEditingSubtasks(newIsEditingSubtasks);
        }
    }

    function handleSubtaskDoubleClick(e: React.MouseEvent) {
        const target = e.target as HTMLLabelElement;
        const index = subtasks?.indexOf(subtasks?.find(subtask => subtask.Id == Number(target.id.split("-")[1]))!);
        if (index !== undefined) {
            const newIsEditingSubtasks = [...isEditingSubtasks];
            newIsEditingSubtasks[index] = true;
            setIsEditingSubtasks(newIsEditingSubtasks);
        }
    }

    useEffect(() => {
        function handleChangeSubtaskDescription(e: KeyboardEvent) {
            const target = e.target as HTMLInputElement;
            if (e.key === "Enter") {
                e.stopPropagation()
                const index = subtasks?.indexOf(subtasks?.find(subtask => subtask.Id == Number(target.id.split("-")[1]))!);
                if (index !== undefined) {
                    subtaskDescriptionsRef.current = subtaskDescriptions;
                    const newIsEditingSubtasks = [...isEditingSubtasks];
                    newIsEditingSubtasks[index] = false;
                    setIsEditingSubtasks(newIsEditingSubtasks);
                    updateSubtask(Number(target.id.split("-")[1]), checked[index], subtaskDescriptions[index]);
                }
            }
        }


        subtasks?.forEach((subtask, index) => {
            const changeSubtaskDescriptionInput = document.getElementById(`description-${subtask.Id}`) as HTMLInputElement;
            if (changeSubtaskDescriptionInput) {
                changeSubtaskDescriptionInput.addEventListener("keydown", handleChangeSubtaskDescription);
            }
        })

        return () => {
            subtasks?.forEach((subtask, index) => {
                const changeSubtaskDescriptionInput = document.getElementById(`description-${subtask.Id}`) as HTMLInputElement;
                if (changeSubtaskDescriptionInput) {
                    changeSubtaskDescriptionInput.removeEventListener("keydown", handleChangeSubtaskDescription);
                }
            })
        };
    }, [subtaskDescriptions])

    return (
        <Box>
            <Box
            id={`task-${id}`}
            className={`draggableTask p-5 h-fit w-full flex flex-col gap-1 rounded-lg ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"} hover:opacity-95 hover:cursor-pointer`}>
                <h1 className={`font-semibold text-base ${mode === "dark" ? "text-white" : "text-black"}`}>{taskNameRef.current}</h1>
                <span className="text-gray-400 font-semibold text-sm">{`${checked?.filter(checked => checked).length} of ${checked?.length} subtasks`}</span>
            </Box>
            <Modal
                open={showDetails}
                onClose={() => setShowDetails(false) }
                keepMounted
                
            >
                <div id="task-details" className={`flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-fit p-6 rounded-md z-10 gap-3 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                            <div className="flex items-center justify-between">
                                {
                                    isEditingName ? (
                                        <Input
                                            autoFocus
                                            id={`task-name-${id}`}
                                            className="w-full"
                                            defaultValue={taskNameRef.current}
                                            onChange={(e) => setTaskName(e.target.value)}
                                            onBlur={() => setIsEditingName(false)}
                                        />
                                    ) : (
                                        <h1 onDoubleClick={() => setIsEditingName(true)} className={`font-bold text-lg ${mode === "dark" ? "text-white" : "text-black"}`}>{taskNameRef.current}</h1>
                                    )
                                }
                                <Box>
                                    <Button onClick={(e : React.MouseEvent) => {
                                        e.stopPropagation()
                                        setShowDropdown(!showDropdown)
                                    }} className="dropdown-task">
                                        <MoreVertIcon />
                                    </Button>
                                    <Menu
                                        open={showDropdown}
                                        onClose={() => setShowDropdown(false)}
                                        anchorEl={document.querySelector(".dropdown-task")}
                                    >
                                        <MenuItem onClick={() => {setShowDeleteTaskModal(true); setShowDropdown(false)}} style={{color: "#645FC7", fontWeight: "600", padding: "0.5rem"}}>Delete Task</MenuItem>
                                    </Menu>
                                </Box>
                            </div>

                            {
                                isEditingDescription ? (
                                    <Textarea
                                        autoFocus
                                        id={`task-description-${id}`}
                                        className="w-full"
                                        defaultValue={taskDescriptionRef.current}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                        onBlur={() => setIsEditingDescription(false)}
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
                                          }}
                                    />
                                ) : 
                                (
                                    <p onDoubleClick={() => setIsEditingDescription(true)} className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-black"} text-clip`}>{taskDescriptionRef.current}</p>
                                )
                            }
                            
                            <div className="flex flex-col gap-2">
                                <h3 className={`text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>Subtasks {"()"}</h3>
                                <div id="subtasksContainer" onClick={handleSubtaskClick} className={`flex flex-col gap-1 text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>
                                    {
                                        checked?.map((checked, index) => {
                                            let subtask = subtasks![index];
                                            return (
                                                <div key={index} className={`flex items-center gap-2 rounded p-2 ${mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`}>
                                                    <Checkbox id={`subtask-${subtask.Id}`} checked={checked}  />
                                                    {
                                                        isEditingSubtasks[index] ? (
                                                            <Input
                                                                autoFocus
                                                                id={`description-${subtask.Id}`}
                                                                className="w-full"
                                                                defaultValue={subtaskDescriptionsRef.current[index]}
                                                                onChange={handleSubtaskDescriptionChange}
                                                                onBlur={handleSubtaskOnBlur}
                                                            />
                                                        ) :
                                                        (
                                                            <label onDoubleClick={handleSubtaskDoubleClick} id={`label-${subtask.Id}`} className={`${checked ? "line-through text-gray-400" : ""}`}>{subtaskDescriptionsRef.current[index]}</label>
                                                        )
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <Modal
                            open={showDeleteTaskModal}
                            onClose={() => setShowDeleteTaskModal(false)}
                            >
                                <Box className={`flex flex-col rounded-xl font-semibold gap-3 p-5 absolute top-[35vh] left-[35vw] ${context!.mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                                    <p>Are you sure you want to delete this task?</p>
                                    <button onClick={DeleteTask} className="bg-button text-sm p-3 px-2 rounded-3xl">Delete Task</button>
                                    <button onClick={() => setShowDeleteTaskModal(false)} className="text-sm p-3 px-2 rounded-3xl border border-gray-500 hover:opacity-90">Cancel</button>
                                </Box>
                            </Modal>

                            <Box className="flex flex-col gap-2">
                                <FormControl>
                                <InputLabel id="Status" variant="standard" style={{color: "gray", fontWeight: "600", padding: "0.2rem"}}>Status</InputLabel>
                                <Select 
                                label="Status" 
                                name="status" 
                                id="columnSelect"
                                value={status!.toString()}
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
                        </div>
            </Modal>
        </Box>
    )
}