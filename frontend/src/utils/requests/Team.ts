import axios from "axios";

export interface Team {
    id: number;
    name: string;
    description: string;
    ownerId: number;
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

export const getOwnedTeams = async (ownerId: number) : Promise<Team[]> => {
    return axios
        .get(`http://localhost:5002/api/Team/${ownerId}/ownedteams`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}


export const getJoinedTeams = async (userId: number) : Promise<Team[]> => {
    return axios
        .get(`http://localhost:5002/api/Team/${userId}/teams`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const getTeam = async (id: number) : Promise<Team> => {
    return axios
        .get(`http://localhost:5002/api/Team/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
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