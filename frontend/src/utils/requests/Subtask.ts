import axios from "axios";

export interface Subtask {
    id: number;
    description: string;
    isDone: boolean;
    taskId: number;
}

export const getSubtasks = async (taskID: number) : Promise<Subtask[]> => {
    return axios
        .get("http://localhost:5002/api/Subtask", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const getSubtask = async (id: number) : Promise<Subtask> => {
    return axios
        .get(`http://localhost:5002/api/Subtask/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const createSubtasks = async (taskID: number, subtasks: Subtask[]) : Promise<Subtask[]> => {
    subtasks.forEach((subtask) => subtask.taskId = taskID);
    const descriptions = subtasks.map((subtask) => subtask.description);
    let a;
    subtasks.forEach((subtask) => a.push({
        taskId: subtask.taskId,
        description: subtask.description,
        isDone: subtask.isDone
    }));
    
    return axios
    
        .post("http://localhost:5002/api/Subtask/many", {
            a
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const updateSubtask = async (id: number, isDone: boolean) : Promise<Subtask> => {
    return axios
        .put(`http://localhost:5002/api/Subtask/${id}`, {
            isDone
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
