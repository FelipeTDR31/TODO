import Task from './Task';
import { Box } from '@mui/material';
import interact from "interactjs";
import { InteractEvent } from '@interactjs/types';
import {Task as TaskType} from '@/utils/requests/Task';

export default function Column({mode, name, boardId, columnId, tasks} : {mode: 'light' | 'dark', name?: string, boardId: number, columnId?: number, tasks?: TaskType[]}) {

    interact(".taskDropzone").dropzone({
        ondragenter: (event : InteractEvent) => {
            event.target.classList.add('bg-blue-400');
        }
        ,ondragleave: (event : InteractEvent) => {
            event.target.classList.remove('bg-blue-400');
        },
        ondrop: (event : InteractEvent) => {
            event.preventDefault();
            event.target.classList.remove('bg-blue-400');
        }
    })

    return (
        <Box className={`h-full w-[22vw] flex-shrink-0`} id={`column-${columnId}`}>
            <h1 className={`font-bold text-lg flex items-center -mt-12 ${mode === 'dark' ? 'text-gray-400' : 'text-black'}`}><span className={`text-8xl mb-6`} style={{color: `#${Math.floor(Math.random() * 16777215).toString(16)}`}}>&#8226;</span>{name} {`(${tasks?.length})`}</h1>
            <Box className={`w-full min-h-[60vh] -mt-6 flex flex-col gap-6 taskDropzone`}>
                {
                    tasks != undefined ? 
                    tasks.map((task) => {
                        if(task.ColumnId == columnId) {
                        return <Task mode={mode} columnId={columnId} id={task.Id} name={task.Name} description={task.Description} subtasks={task.Subtasks!.$values} />
                        }
                    }) 
                    : <></>
                }
            </Box>  
        </Box>
    )
}