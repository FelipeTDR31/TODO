'use client'

import React, { useState } from "react";

export default function Task ({mode} : {mode: "light" | "dark"}) {
    const [showDetails, setShowDetails] = useState(false);

    function setSubTaskDone(e : React.MouseEvent<HTMLInputElement, MouseEvent>) {
        let label = e.currentTarget.parentNode?.children[1]
        if (e.currentTarget.checked) {
            label?.classList.add("line-through")
            label?.classList.add("text-gray-400")
        }else{
            label?.classList.remove("line-through")
            label?.classList.remove("text-gray-400")
        }
    }
    return (
        <div onClick={() => showDetails ? null : setShowDetails(!showDetails)} className={`p-5 h-1/4 w-full flex flex-col gap-1 rounded-lg ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"} ${showDetails ? null : "hover:opacity-95 hover:cursor-pointer"}`}>
            <h1 className={`font-semibold text-base ${mode === "dark" ? "text-white" : "text-black"}`}>Build UI for onboarding flow</h1>
            <span className="text-gray-400 font-semibold text-sm"> 0 of 3 subtasks</span>
            {
                showDetails ? 
                <div className={`flex flex-col absolute top-[15vh] left-[35vw] w-[30vw] p-6 rounded-md z-10 gap-3 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
                    <div className="flex items-center justify-between">
                        <h1 className={`font-bold text-lg ${mode === "dark" ? "text-white" : "text-black"}`}>Details</h1>
                        <div className="dropdown">
                            <button className="text-gray-600 text-2xl font-semibold">&#8942;</button>
                            <div className="dropdown-content">
                                <a href="#">Option 1</a>
                                <a href="#">Option 2</a>
                                <a href="#">Option 3</a>
                            </div>
                        </div>
                    </div>

                    <p className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-black"}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, vitae ipsa error dolores ab ducimus quis dicta sequi possimus non alias sapiente velit fugiat soluta, enim illo tempore quo? Quam.</p>

                    <div className="flex flex-col gap-2">
                        <h3 className={`text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>Subtasks {"()"}</h3>
                        <div className={`flex flex-col gap-1 text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>
                            <div className={`flex items-center gap-2 rounded p-2 ${mode === "dark" ? "bg-primary-dark" : "bg-primary-light"}`}>
                                <input type="checkbox" onClick={setSubTaskDone} className={`appearance-none w-10 h-4 border border-gray-600 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"} checked:bg-blue-800 checked:border-transparent checked:text-white`} />
                                <label htmlFor="">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo, nostrum pariatur saepe omnis voluptates porro cum quas non magnam</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className={`text-sm font-semibold ${mode === "dark" ? "text-white" : "text-black"}`}>Status</h3>
                        <select name="status" id="status" className="w-full font-semibold input-border rounded p-1 text-gray-400">
                            <option value="todo" className={`text-gray-400 font-semibold p-1 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>To Do</option>
                            <option value="inprogress" className={`text-gray-400 font-semibold p-1 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>In Progress</option>
                            <option value="done" className={`text-gray-400 font-semibold p-1 ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>Done</option>
                        </select>
                    </div>
                </div>
                :
                null
            }

            {
                showDetails ?  <span className="absolute top-0 left-0 w-screen h-screen bg-black opacity-50 z-0" onClick={() => setShowDetails(false)}></span> : null
            }
        </div>
    )
}