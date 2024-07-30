'use client'

import { Box, Button, Checkbox, FormControl, InputLabel, Menu, MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material";
import React, { useEffect, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import interact from "interactjs";
import { InteractEvent } from "@interactjs/types";
import { Subtask } from "@/utils/requests/Subtask";

export default function Task ({mode, name, description, subtasks} : {mode: "light" | "dark", name: string, description?: string, subtasks?: Subtask[]}) {
    const [showDetails, setShowDetails] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [checked, setChecked] = useState(subtasks?.map(subtask => subtask.IsDone) || []);
    const [status, setStatus] = useState("");
    const position = {x: 0, y: 0}

    function setSubTaskDone(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        let id = e.currentTarget.id.split("-")[1];
        let index = subtasks?.indexOf(subtasks?.find(subtask => subtask.Id == Number(id))!);
        if (index !== undefined) {
            const newChecked = [...checked];
            newChecked[index] = !newChecked[index];
            console.log(newChecked)
            console.log(checked)
            const label = document.querySelector(`#label-${id}`);
            if (label) {
                label.classList.toggle("line-through", newChecked[index]);
                label.classList.toggle("text-gray-400", newChecked[index]);
            }
        }
    }

    function handleSelectChange(e : SelectChangeEvent)  {
        setStatus(e.target.value);
    }

    interact(".draggableTask").draggable({
        onmove: (event : InteractEvent) => {
            position.x += event.dx
            position.y += event.dy
            event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
            event.target.style.transition = "none"
        }
        , onend: (event : InteractEvent) => {
            event.target.style.transform = `translate(0px, 0px)`
            position.x = 0
            position.y = 0
            
        }
    }).styleCursor(false)
    return (
        <Box>
            <Box onClick={() => showDetails ? null : setShowDetails(!showDetails)} className={`draggableTask p-5 h-fit w-full flex flex-col gap-1 rounded-lg ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"} hover:opacity-95 hover:cursor-pointer`}>
                <h1 className={`font-semibold text-base ${mode === "dark" ? "text-white" : "text-black"}`}>{name}</h1>
                <span className="text-gray-400 font-semibold text-sm"> 0 of 3 subtasks</span>
            </Box>
            <Modal
                open={showDetails}
                onClose={() => setShowDetails(false)}
            >
                <div className={`flex flex-col absolute top-[15vh] left-[35vw] w-[30vw] p-6 rounded-md z-10 gap-3 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                            <div className="flex items-center justify-between">
                                <h1 className={`font-bold text-lg ${mode === "dark" ? "text-white" : "text-black"}`}>Details</h1>
                                <Box>
                                    <Button onClick={() => setShowDropdown(!showDropdown)} className="dropdown-task">
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
                                <div id="subtasksContainer" className={`flex flex-col gap-1 text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>
                                    {
                                        checked?.map((checked, index) => {
                                            let subtask = subtasks![index];
                                            return (
                                                <div key={index} className={`flex items-center gap-2 rounded p-2 ${mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`}>
                                                    <Checkbox id={`subtask-${subtask.Id}`} checked={checked} onChange={setSubTaskDone}  />
                                                    <label id={`label-${subtask.Id}`}>{subtask.Description}</label>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
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
                                        <MenuItem value="" style={{color: "gray", fontWeight: "600", padding: "0.3rem"}}>None</MenuItem>
                                        <MenuItem value="todo" style={{color: "gray", fontWeight: "600", padding: "0.3rem"}}>To Do</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
            </Modal>
        </Box>
    )
}