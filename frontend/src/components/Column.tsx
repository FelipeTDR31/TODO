import { Input } from '@/utils/Tags/Input';
import { useState, useEffect } from 'react';
import Task from './Task';
import { Box } from '@mui/material';
import interact from "interactjs";
import { InteractEvent } from '@interactjs/types';
import { createColumn } from '@/utils/requests/Column';

export default function Column({mode, name, userID} : {mode: 'light' | 'dark', name?: string, userID: number}) {
    const [input, setInput] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        function handleKeyDown(e : KeyboardEvent) {
            if (e.key === 'Enter') {
                setTitle(input);
                setInput('');
            }
        }
        if (!name) {
            document.addEventListener('keydown', handleKeyDown);
    
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }else{
            setTitle(name);
        }
    }, [input]);

    interact(".taskDropzone").dropzone({
        ondragenter: (event : InteractEvent) => {
            event.target.classList.add('bg-blue-400');
        }
        ,ondragleave: (event : InteractEvent) => {
            event.target.classList.remove('bg-blue-400');
        },
        ondrop: (event : InteractEvent) => {
            event.preventDefault();
            const task = event.relatedTarget?.parentElement;
            if (task) {
                event.target.appendChild(task);
                event.target.classList.remove('bg-blue-400');
            }
        }
    })

    async function CreateColumn() {
        await createColumn(input, 1, tableID);
    }

    return (
        <Box className={`h-full w-[22vw]`}>
            {title ? <h1 className={`font-bold text-lg flex items-center -mt-12 ${mode === 'dark' ? 'text-gray-400' : 'text-black'}`}><span className={`text-8xl mb-6`} style={{color: `#${Math.floor(Math.random() * 16777215).toString(16)}`}}>&#8226;</span>{title} {"()"}</h1> : <Input type="text" className='w-[12vw]' value={input} onChange={(e) => setInput(e.target.value)} />}
            <Box className={`w-full min-h-[60vh] max-h-full -mt-6 flex flex-col gap-6 taskDropzone`}>
                <Task mode={mode} name='SOMETHING AAAA' />
                <Task mode={mode} name='SOMETHING BBBB' />
            </Box>  
        </Box>
    )
}