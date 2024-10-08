import axios from "axios";
import { User } from "./User";

export interface Table {
    id: number;
    name: string;
    userId: number;
}

export const getTables = async (userId: number) : Promise<Table[]> => {
    return axios
        .get(`http://localhost:5002/api/Table/tables/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}


export const deleteTable = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Table/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }).then((response) => {
            return response.data;
        });
}


export const updateTable = async (id: number, name: string, userId: number) : Promise<Table> => {
    return axios
        .put(`http://localhost:5002/api/Table/${id}`, {
            name,
            userId
        },{
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            return response.data;
        });
}


export const createTable = async (name: string, userId: number) : Promise<Table> => {
    return axios
        .post("http://localhost:5002/api/Table", {
            name,
            userId
        },
        {
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    ).then((response) => {
        return response.data;
    });
}