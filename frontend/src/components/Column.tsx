import { Input } from '@/utils/Tags/Input';
import { useState, useEffect } from 'react';
import Task from './Task';

export default function Column({mode} : {mode: 'light' | 'dark'}) {
    const [input, setInput] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        function handleKeyDown(e : KeyboardEvent) {
            if (e.key === 'Enter') {
                setTitle(input);
                setInput('');
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [input]);

    return (
        <div className={`h-full w-[22vw]`}>
            {title ? <h1 className={`font-bold text-lg flex items-center -mt-12 ${mode === 'dark' ? 'text-gray-400' : 'text-black'}`}><span className={`text-8xl mb-6`} style={{color: `#${Math.floor(Math.random() * 16777215).toString(16)}`}}>&#8226;</span>{title} {"()"}</h1> : <Input type="text" className='w-[12vw]' value={input} onChange={(e) => setInput(e.target.value)} />}
            <div className={`w-full -mt-6 gap-6`}>
                <Task mode={mode} />
            </div>  
        </div>
    )
}