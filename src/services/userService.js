import { api } from "./api";

export const userService = {
    getUsers: async () => {
        return api.get('/api/users/list', false);
    },

    authenticateUser: async (body) => {
        return api.post('/login', body, false);
    },
};