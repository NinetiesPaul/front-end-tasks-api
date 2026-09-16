const BASE_URL = process.env.REACT_APP_SERVER_HOST;

async function Request(endpoint, method, body, authRequired) {

    const url = `${BASE_URL}${endpoint}`;
    const token = sessionStorage.getItem("token");

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (authRequired) {
        if (!token) {
            sessionStorage.removeItem("token");
            window.location.href = "/login";
        } else {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const payload = {
        method,
        headers,
    };

    if (body) {
        payload.body = JSON.stringify(body);
    }

    const response = await fetch(url, payload);

    if (response.status === 401) {
        sessionStorage.removeItem("token");
        window.location.href = "/login";
    }

    return response.json();
}

export const api = {
    get: (endpoint, authRequired = true) => Request(endpoint, 'GET', null, authRequired),
    post: (endpoint, body, authRequired = true) => Request(endpoint, 'POST', body, authRequired),
    put: (endpoint, body, authRequired = true) => Request(endpoint, 'PUT', body, authRequired),
    delete: (endpoint, authRequired = true) => Request(endpoint, 'DELETE', null, authRequired),
};