import axios from "axios";

export const getTables = async () => {
    return axios
        .get("http://localhost:5002/api/Table")
        .then((response) => {
            return response.data;
        });
}

export const getTable = async (id: number) => {
    return axios
        .get(`http://localhost:5002/api/Table/${id}`)
        .then((response) => {
            return response.data;
        });
}


export const deleteTable = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Table/${id}`)
}


export const updateTable = async (id: number, name: string) => {
    return axios
        .put(`http://localhost:5002/api/Table/${id}`, {
            name
        })
}


export const createTable = async (name: string) => {
    return axios
        .post("http://localhost:5002/api/Table", {
            name
        })
}