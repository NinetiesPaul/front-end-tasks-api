import { api } from "./api";

export const taskService = {
    getTasks: async () => {
        return api.get('/api/task/list');
    },
    getTaskById: async (id) => {
        return api.get(`/api/task/view/${id}`);
    },
    createTask: async (task) => {
        return api.post('/api/task/create', task);
    },
    updateTask: async (id, task) => {
        return api.put(`/api/task/update/${id}`, task);
    },
    closeTask: async (id) => {
        return api.put(`/api/task/close/${id}`);
    },
    assignTask: async (id, assignee) => {
        console.log(id, assignee);
        return api.post(`/api/task/assign/${id}`, assignee);
    },
    unassignTask: async (id) => {
        return api.delete(`/api/task/unassign/${id}`);
    },
    addComment: async (id, comment) => {
        return api.post(`/api/task/comment/${id}`, comment);
    },
    deleteComment: async (id) => {
        return api.delete(`/api/task/comment/${id}`);
    },
};