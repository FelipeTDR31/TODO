import axios from "axios";

export const getTasks = async () => {
    return axios
        .get("http://localhost:5002/api/Task")
        .then((response) => {
            return response.data;
        });
}

export const getTask = async (id: number) => {
    return axios
        .get(`http://localhost:5002/api/Task/${id}`)
        .then((response) => {
            return response.data;
        });
}

export const createTask = async (name : string, description : string) => {
    return axios
        .post("http://localhost:5002/api/Task", {
            name,
            description
        })
        .then((response) => {
            return response.data;
        });
}

export const updateTask = async (id: number, name : string, description : string) => {
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
