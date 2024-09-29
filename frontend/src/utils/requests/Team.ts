import axios from "axios";

export interface Team {
    name: string;
    description: string;
    ownerId: number;
    uniqueName: string;
}

export const createTeam = async (name: string, description: string, ownerId: number) : Promise<Team> => {
    return axios
        .post(`http://localhost:5002/api/Team/${ownerId}`, {
            name,
            description
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}


export const getTeams = async (ownerId: number) : Promise<{name : string, isOwner : boolean}[]> => {
    return axios
        .get(`http://localhost:5002/api/Team/${ownerId}/teams`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return null;
        });
}

export const getTeam = async (uniqueName: string) : Promise<Team> => {
    return axios
        .get(`http://localhost:5002/api/Team/${uniqueName}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return null;
        });
}

export const updateTeam = async (id: number, name: string, description: string) : Promise<Team> => {
    return axios
        .put(`http://localhost:5002/api/Team/${id}`, {
            name,
            description
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}


export const deleteTeam = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Team/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }).then((response) => {
            return response.data;
        });
}