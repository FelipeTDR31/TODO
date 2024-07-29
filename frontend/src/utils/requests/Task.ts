import axios from "axios";
import { createSubtask, Subtask } from "./Subtask";

export interface Task{
    id: number;
    name: string;
    description: string;
    order: number;
    columnId: number;
    subtasks?: Subtask[];
}

export const getTasks = async (ColumnId: number) : Promise<Task[]> => {
    return axios
        .get("http://localhost:5002/api/Task", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const getTask = async (id: number) : Promise<Task> => {
    return axios
        .get(`http://localhost:5002/api/Task/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const createTask = async (name : string, description : string, columnId : number, order: number, subtasksArray: Subtask[]) : Promise<{task: Task, subtasks: Subtask[]}> => {
    return axios
        .post("http://localhost:5002/api/Task", {
            name,
            description,
            columnId,
            order
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then(async (response) => {
            const subtasks : Subtask[] = [];
            subtasksArray.forEach(async (subtask) => {
                subtasks.push(await createSubtask(response.data.id, subtask.description));
            })
            return {
                task: response.data,
                subtasks
            };
        });
}

export const updateTask = async (id: number, name : string, description : string, ColumnId : number) : Promise<Task> => {
    return axios
        .put(`http://localhost:5002/api/Task/${id}`, {
            name,
            description
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const deleteTask = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Task/${id}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}
