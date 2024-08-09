import axios from "axios";

export interface Subtask {
    Id: number;
    Description: string;
    IsDone: boolean;
    TaskId: number;
}

export const getSubtasks = async (taskID: number) : Promise<Subtask[]> => {
    return axios
        .get(`http://localhost:5002/api/Subtask/${taskID}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const getSubtask = async (taskID : number,id: number) : Promise<Subtask> => {
    return axios
        .get(`http://localhost:5002/api/Subtask/${taskID}/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const createSubtask = async (taskID: number, description: string) : Promise<Subtask> => {
    return axios
        .post("http://localhost:5002/api/Subtask", {
            taskID,
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

export const updateSubtask = async (id: number, isDone: boolean, description?: string) : Promise<Subtask> => {
    return axios
        .put(`http://localhost:5002/api/Subtask/${id}`, {
            isDone,
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

export const deleteSubtask = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Subtask/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}
