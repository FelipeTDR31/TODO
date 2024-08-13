import axios from "axios";
import { Table } from "./Table";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    tables?: Table[];
}

export const login = async (email: string, password: string) : Promise<{ token: string, foundUser: User }> => {
    return axios
        .post("http://localhost:5002/api/User/login", {
            email,
            password,
        })
        .then((response) => {
            return { token: response.data.token, foundUser: response.data.foundUser };
        });
}


export const register = async (name: string, email: string, password: string) : Promise<{token: string, user: User}> => {
    return axios
        .post("http://localhost:5002/api/User/register", {
            name,
            email,
            password,
        })
        .then((response) => {
            return { token: response.data.token, user: response.data.newUser };
        });
}

export const getUser = async (name : string ) : Promise<User> => {
    return axios
        .get(`http://localhost:5002/api/User/${name}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}