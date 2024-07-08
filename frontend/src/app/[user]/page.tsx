export default function UserPage({ params }: { params: { user: string } }) {
    return (
        <main className="kanban-template">
            <aside className="aside-content bg-secondary p-6 font-bold w-[22vw] h-screen">
                <h3 className="text-2xl text-white">{params.user} Kanban</h3>
                <div className="mt-10">
                    <h4 className="text-gray-400 text-sm">ALL BOARDS {"()"}</h4>
                    <div>
                        <button className="create-board py-4 pl-7 pr-5 -ml-7">+Create New Board</button>
                    </div>
                </div>
            </aside>

            <div className="cDiv bg-secondary font-bold flex items-center justify-between p-5 border-b border-l border-gray-500 w-[78vw] h-[15vh]">
                <h1 className="text-white text-xl">Platform Launch</h1>
                <div className="flex gap-3 items-center">
                    <button className="bg-button font-bold text-base p-3 px-4 rounded-3xl">+ Add New Task</button>
                    <div className="dropdown">
                        <button className="text-gray-400 text-2xl">&#8942;</button>
                        <div className="dropdown-content">
                            <a href="#">Option 1</a>
                            <a href="#">Option 2</a>
                            <a href="#">Option 3</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content h-[80vh] pl-5 pt-5">
                <button className="bg-[#24242F] h-full w-[20vw] text-gray-500 font-bold">+ New Column</button>
            </div>
        </main>
    );
}