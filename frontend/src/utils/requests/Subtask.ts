import axios from "axios";

export const getSubtasks = async () => {
    return axios
        .get("http://localhost:5002/api/Subtask")
        .then((response) => {
            return response.data;
        });
}

export const getSubtask = async (id: number) => {
    return axios
        .get(`http://localhost:5002/api/Subtask/${id}`)
        .then((response) => {
            return response.data;
        });
}

export const createSubtask = async (task_id: number, description: string) => {
    return axios
        .post("http://localhost:5002/api/Subtask", {
            task_id,
            description
        })
        .then((response) => {
            return response.data;
        });
}

export const updateSubtask = async (id: number, description: string) => {
    return axios
        .put(`http://localhost:5002/api/Subtask/${id}`, {
            description
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
