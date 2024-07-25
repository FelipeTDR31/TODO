'use client'

import { Box, Button, Checkbox, FormControl, InputLabel, Menu, MenuItem, Modal, Select, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import interact from "interactjs";
import { InteractEvent } from "@interactjs/types";
import { Subtask } from "@/utils/requests/Subtask";

export default function Task ({mode, name, description, subtasks} : {mode: "light" | "dark", name: string, description?: string, subtasks?: Subtask[]}) {
    const [showDetails, setShowDetails] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false)
    const [checked, setChecked] = useState(false);
    const [status, setStatus] = useState("");
    const position = {x: 0, y: 0}

    function setSubTaskDone(e: React.ChangeEvent<HTMLInputElement>) {
        setChecked(e.currentTarget.checked);
        let label = document.querySelector('#label')
        if (!checked) {
            label?.classList.add("line-through")
            label?.classList.add("text-gray-400")
        }else{
            label?.classList.remove("line-through")
            label?.classList.remove("text-gray-400")
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

                            <p className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-black"}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, vitae ipsa error dolores ab ducimus quis dicta sequi possimus non alias sapiente velit fugiat soluta, enim illo tempore quo? Quam.</p>

                            <div className="flex flex-col gap-2">
                                <h3 className={`text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>Subtasks {"()"}</h3>
                                <div className={`flex flex-col gap-1 text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>
                                    <div className={`flex items-center gap-2 rounded p-2 ${mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`}>
                                        <Checkbox checked={checked} onChange={setSubTaskDone}  />
                                        <label id="label">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo, nostrum pariatur saepe omnis voluptates porro cum quas non magnam</label>
                                    </div>
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