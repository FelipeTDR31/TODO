'use client'

export default function Task ({mode} : {mode: "light" | "dark"}) {

    return (
        <div className={`p-5 h-1/4 w-full flex flex-col gap-1 rounded-lg ${mode === "dark" ? "bg-secondary-dark" : "bg-secondary-light"}`}>
            <h1 className={`font-semibold text-base ${mode === "dark" ? "text-white" : "text-black"}`}>Build UI for onboarding flow</h1>
            <span className="text-gray-400 font-semibold text-sm"> 0 of 3 subtasks</span>
            
        </div>
    )
}