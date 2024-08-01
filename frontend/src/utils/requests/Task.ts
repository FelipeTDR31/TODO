import axios from "axios";
import { createSubtask, Subtask } from "./Subtask";

export interface Task{
    Id: number;
    Name: string;
    Description: string;
    Order: number;
    ColumnId: number;
    Subtasks?: Subtask[];
}

export const getTasks = async (ColumnId: number) : Promise<Task[]> => {
    return axios
        .get(`http://localhost:5002/api/Task/${ColumnId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data.$values;
        });
}

export const getTask = async (columnId : number ,id: number) : Promise<Task> => {
    return axios
        .get(`http://localhost:5002/api/Task/${columnId}/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const createTask = async (name : string, description : string, columnId : number, order: number, subtasksArray: Subtask[]) : Promise<Task> => {
    return axios
        .post("http://localhost:5002/api/Task", {
            name,
            description,
            columnId,
            order,
            subtasks: subtasksArray
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data.Value;
        })
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
