import axios from "axios";

export const createColumn = async (name: string, position : number) => {
    return axios
        .post("http://localhost:5002/Column", {
            name,
            position
        })
        .then((response) => {
            return response.data;
        });
}

export const getColumns = async () => {
    return axios
        .get("http://localhost:5002/api/Column")
        .then((response) => {
            return response.data;
        });
}

export const getColumn = async (id: number) => {
    return axios
        .get(`http://localhost:5002/api/Column/${id}`)
        .then((response) => {
            return response.data;
        });
}

export const putColumn = async (id: number, name: string, position : number) => {
    return axios
        .put(`http://localhost:5002/api/Column/${id}`, {
            name,
            position
        })
        .then((response) => {
            return response.data;
        });
}

export const deleteColumn = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Column/${id}`)
        .then((response) => {
            return response.data;
        });
}