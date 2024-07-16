import axios from "axios";
import { Subtask } from "./Subtask";

export interface Task{
    id: number;
    name: string;
    description: string;
    Order: number;
    ColumnId: number;
    subtasks?: Subtask[];
}

export const getTasks = async (ColumnId: number) : Promise<Task[]> => {
    return axios
        .get("http://localhost:5002/api/Task")
        .then((response) => {
            return response.data;
        });
}

export const getTask = async (id: number) : Promise<Task> => {
    return axios
        .get(`http://localhost:5002/api/Task/${id}`)
        .then((response) => {
            return response.data;
        });
}

export const createTask = async (name : string, description : string, ColumnId : number) : Promise<Task> => {
    return axios
        .post("http://localhost:5002/api/Task", {
            name,
            description,
            ColumnId
        })
        .then((response) => {
            return response.data;
        });
}

export const updateTask = async (id: number, name : string, description : string, ColumnId : number) : Promise<Task> => {
    return axios
        .put(`http://localhost:5002/api/Task/${id}`, {
            name,
            description
        })
        .then((response) => {
            return response.data;
        });
}

export const deleteTask = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Task/${id}`)
        .then((response) => {
            return response.data;
        });
}
