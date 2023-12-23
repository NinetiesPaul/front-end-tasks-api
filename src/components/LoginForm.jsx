import { React, useState } from "react";
import { Alert, Button, Snackbar, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ErrorMessages from "../enums/ErrorMessages";

function LoginForm({setLogged})
{
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const host = process.env.REACT_APP_SERVER_HOST;

    const handleSubmit = async (args) => {
        console.log(args)
        await fetch(host + '/login', {
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(args)
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                sessionStorage.setItem("token", data.token);
                //sessionStorage.setItem("role", data.content.role);
                setLogged(true);
                navigate("/");
            } else {
                setNotificationType('error')
                setError(data.content)
                setShowNotification(true)
            }
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setError(message)
        });
    };

    return(
        <>
            <form onSubmit={
                    (event) => {
                        event.preventDefault();
                        handleSubmit({username: email, password: password});
                    }
                }
                style={{width: '30%', margin: '0 auto', paddingTop: '10em'}}>
                    <TextField id="nome" label="E-mail" margin="dense" fullWidth
                    onChange={
                        (event) => {
                            setError("");
                            setEmail(event.target.value);
                        }
                }/>
                <TextField id="sobrenome" label="Password" margin="dense" type="password" fullWidth
                onChange={
                    (event) => {
                        setError("");
                        setPassword(event.target.value);
                    }
                }
                />
                <Button type="submit" variant="contained">Login</Button>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                    open={showNotification}
                >
                    <Alert severity={notificationType} sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </form>
        </>
    );

}

export default LoginForm;
