'use client'

import { Box, Button, Checkbox, FormControl, InputLabel, Menu, MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import interact from "interactjs";
import { InteractEvent } from "@interactjs/types";
import { Subtask, updateSubtask } from "@/utils/requests/Subtask";
import { ModeContext } from "./Context";
import { updateTask } from "@/utils/requests/Task";
import { getColumns } from "@/utils/requests/Column";

export default function Task ({mode, id, columnId, name, description, subtasks} : {mode: "light" | "dark", name: string, description: string, subtasks: Subtask[], id: number, columnId: number}) {
    const [showDetails, setShowDetails] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [checked, setChecked] = useState(subtasks?.map(subtask => subtask.IsDone) || []);
    const [status, setStatus] = useState<number>(columnId);
    const [taskId, setTaskId] = useState<number>();
    let number = 0;
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

    function handleSelectChange(e : SelectChangeEvent)  {
        e.preventDefault();
        e.stopPropagation();
        if (status !== Number(e.target.value)) {
            setStatus(Number(e.target.value));
            setTaskId(id);
        }
    }

    useEffect(() => {
        const updateStatus = async () => {
            if (status !== columnId) {
                console.log("runned")
                console.log(id)
                console.log(status+" "+ columnId)
                await updateTask(id, name, description, status)
                .then(async () => context?.setColumns(await getColumns(context?.selectedTable?.id || 0)));
            }
        }

        updateStatus();
    }, [status]);

    interact(".draggableTask").draggable({
        onmove: (event : InteractEvent) => {
            position.x += event.dx/2
            position.y += event.dy/2
            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
            event.target.style.transition = "none"
        }
        , onend: (event : InteractEvent) => {
            event.target.style.transform = `translate(0px, 0px)`
            const column = event.relatedTarget?.parentElement
            if (column !=undefined && column.id != `column-${status}` && number != Number(column.id.split("-")[1])) {
                try {
                    event.target.remove()
                    setStatus(Number(column.id.split("-")[1]))
                    number = Number(column.id.split("-")[1])
                } catch (error) {
                    console.log(error)
                }
            }
            position.x = 0
            position.y = 0
            
        }
    }).styleCursor(false)

    return (
        <Box>
            <Box 
            onClick={(e : React.MouseEvent) => {
                e.stopPropagation()
                showDetails ? null : setShowDetails(!showDetails)
            }} 
            className={`draggableTask p-5 h-fit w-full flex flex-col gap-1 rounded-lg ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"} hover:opacity-95 hover:cursor-pointer`}>
                <h1 className={`font-semibold text-base ${mode === "dark" ? "text-white" : "text-black"}`}>{name}</h1>
                <span className="text-gray-400 font-semibold text-sm">{`${checked?.filter(checked => checked).length} of ${checked?.length} subtasks`}</span>
            </Box>
            <Modal
                open={showDetails}
                onClose={() => setShowDetails(false) }
                keepMounted
            >
                <div id="task-details" className={`flex flex-col absolute top-[15vh] left-[35vw] w-[30vw] p-6 rounded-md z-10 gap-3 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                            <div className="flex items-center justify-between">
                                <h1 className={`font-bold text-lg ${mode === "dark" ? "text-white" : "text-black"}`}>Details</h1>
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
                                        <MenuItem>Delete Task</MenuItem>
                                        <MenuItem>Update Task</MenuItem>
                                    </Menu>
                                </Box>
                            </div>

                            <p className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-black"}`}>{description}</p>

                            <div className="flex flex-col gap-2">
                                <h3 className={`text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>Subtasks {"()"}</h3>
                                <div id="subtasksContainer" onClick={handleSubtaskClick} className={`flex flex-col gap-1 text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>
                                    {
                                        checked?.map((checked, index) => {
                                            let subtask = subtasks![index];
                                            return (
                                                <div key={index} className={`flex items-center gap-2 rounded p-2 ${mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`}>
                                                    <Checkbox id={`subtask-${subtask.Id}`} checked={checked}  />
                                                    <label id={`label-${subtask.Id}`}>{subtask.Description}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

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