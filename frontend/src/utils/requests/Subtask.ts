import axios from "axios";

export interface Subtask {
    id: number;
    description: string;
    isDone: boolean;
    taskID: number;
}

export const getSubtasks = async (taskID: number) : Promise<Subtask[]> => {
    return axios
        .get("http://localhost:5002/api/Subtask")
        .then((response) => {
            return response.data;
        });
}

export const getSubtask = async (id: number) : Promise<Subtask> => {
    return axios
        .get(`http://localhost:5002/api/Subtask/${id}`)
        .then((response) => {
            return response.data;
        });
}

export const createSubtask = async (taskID: number, description: string) : Promise<Subtask> => {
    return axios
        .post("http://localhost:5002/api/Subtask", {
            taskID,
            description
        })
        .then((response) => {
            return response.data;
        });
}

export const updateSubtask = async (id: number, isDone: boolean) : Promise<Subtask> => {
    return axios
        .put(`http://localhost:5002/api/Subtask/${id}`, {
            isDone
        })
        .then((response) => {
            return response.data;
        });
}

export const deleteSubtask = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Subtask/${id}`)
        .then((response) => {
            return response.data;
        });
}
