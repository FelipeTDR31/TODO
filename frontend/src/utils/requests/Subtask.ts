import axios from "axios";

export interface Subtask {
    Id: number;
    Description: string;
    IsDone: boolean;
    TaskId: number;
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