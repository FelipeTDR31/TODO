import axios from "axios";

export const login = async (email: string, password: string) => {
    return axios
        .post("http://localhost:5002/api/User/login", {
            email,
            password,
        })
        .then((response) => {
            return response.data;
        });
}


export const register = async (name: string, email: string, password: string) => {
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

export const getUsers = async () => {
    return axios
        .get("http://localhost:5002/api/User")
        .then((response) => {
            return response.data;
        });
}

export const getUser = async (name : string) => {
    return axios
        .get(`http://localhost:5002/api/User/${name}`)
        .then((response) => {
            return response.data;
        });
}