import axios from "axios";
import { Task } from "./Task";

export interface Column {
    Id: number;
    Name: string;
    Position: number;
    TableId : number;
    Tasks?: Task[];
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
        .get(`http://localhost:5002/api/Column/${TableID}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            if (response.status === 200) {
                return response.data.$values;
            }else{
                let a : Column[] = [];
                return a;
            }
        });
}

export const getColumn = async (tableID : number,id: number) : Promise<Column> => {
    return axios
        .get(`http://localhost:5002/api/Column/${tableID}/${id}`, {
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