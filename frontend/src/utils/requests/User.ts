import axios from "axios";
import { Table } from "./Table";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    tables?: Table[];
}

export const login = async (email: string, password: string) : Promise<boolean> => {
    return axios
        .post("http://localhost:5002/api/User/login", {
            email,
            password,
        })
        .then((response) => {
            return response.data;
        });
}


export const register = async (name: string, email: string, password: string) : Promise<string> => {
    return axios
        .post("http://localhost:5002/api/User", {
            name,
            email,
            password,
        })
        .then((response) => {
            return response.data;
        });
}

export const getUsers = async () : Promise<User[]> => {
    return axios
        .get("http://localhost:5002/api/User")
        .then((response) => {
            return response.data;
        });
}

export const getUser = async (name : string) : Promise<User> => {
    return axios
        .get(`http://localhost:5002/api/User/${name}`)
        .then((response) => {
            return response.data;
        });
}