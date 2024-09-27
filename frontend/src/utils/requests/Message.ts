import axios from "axios";

export interface Message {
    id: number;
    content: string;
    receiverId: number;
    senderId: number;
    teamId: number;
}

export const createMessage = async (content: string, receiverName: string, senderName: string, teamName: string) => {
    return axios
        .post(`http://localhost:5002/api/Message`, {
            content,
            receiverName,
            senderName,
            teamName
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const getUserMessages = async (userId: number) => {
    return axios
        .get(`http://localhost:5002/api/Message/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}

export const deleteMessage = async (id: number) => {
    return axios
        .delete(`http://localhost:5002/api/Message/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        })
        .then((response) => {
            return response.data;
        });
}