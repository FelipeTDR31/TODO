import axios from "axios";
import { Task } from "./Task";

export interface Column {
    id: number;
    name: string;
    position: number;
    TableID : number;
    tasks?: Task[];
}

export const createColumn = async (name: string, position : number, TableID : number) : Promise<Column> => {
    return axios
        .post("http://localhost:5002/api/Column", {
            name,
            position,
            TableID
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const getColumns = async (TableID : number) : Promise<Column[]> => {
    return axios
        .get("http://localhost:5002/api/Column", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const getColumn = async (id: number) : Promise<Column> => {
    return axios
        .get(`http://localhost:5002/api/Column/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const updateColumn = async (id: number, name: string, position : number) : Promise<Column> => {
    return axios
        .put(`http://localhost:5002/api/Column/${id}`, {
            name,
            position
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const deleteColumn = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Column/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}