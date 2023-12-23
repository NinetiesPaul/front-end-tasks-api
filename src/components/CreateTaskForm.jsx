import { React, useState } from "react";
import { Alert, Button, MenuItem, Snackbar, TextField } from "@mui/material";

import ErrorMessages from "../enums/ErrorMessages";

function CreateTaskForm()
{
    const [notificationType, setNotificationType] = useState("");
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");
    const [weight, setWeight] = useState("");

    const host = process.env.REACT_APP_SERVER_HOST;
    const token = sessionStorage.getItem("token");

    const handleSubmit = async (args) => {
        await fetch(host + '/api/catalog/add?token=' + token, { method: 'POST', body: JSON.stringify(args) })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                setNotificationType('success')
                setShowNotification(true)
                setNotificationMsg("Produto cadastrado com sucesso!");
            } else {
                var message = ErrorMessages.DEFAULT_ERROR_MSG;

                Object.keys(ErrorMessages).forEach(function(k,v) {
                    if (data.content === k) {
                        message = `${ErrorMessages[k]}`
                    }
                });

                setNotificationType('error')
                setShowNotification(true)
                setNotificationMsg(message)
            }
            setButtonDisabled(false);
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    };

    return(
        <>
            <form onSubmit={
                (event) => {
                    event.preventDefault();
                    setButtonDisabled(true);
                    handleSubmit({ name: name, price: price, type: type, weight: weight });
                }
            }
            style={{width: '30%', margin: '0 auto', paddingTop: '10em'}}>
                <TextField id="name" label="Nome" margin="dense" size="small" fullWidth
                onChange={
                    (event) => {
                        setName(event.target.value);
                    }
                }/>
                
                <TextField id="type" label="Tipo" margin="dense" size="small" fullWidth
                onChange={
                    (event) => {
                        setType(event.target.value);
                    }
                } select
                >
                    <MenuItem value={"Tinto"}>Tinto</MenuItem>
                    <MenuItem value={"Branco"}>Branco</MenuItem>
                    <MenuItem value={"Rosé"}>Rosé</MenuItem>
                    <MenuItem value={"Licoroso"}>Licoroso</MenuItem>
                    <MenuItem value={"Espumante"}>Espumante</MenuItem>
                </TextField>

                <TextField id="weight" label="Peso" margin="dense" size="small" fullWidth
                onChange={
                    (event) => {
                        setWeight(event.target.value);
                    }
                }
                />
                <TextField id="price" label="Preço" margin="dense" size="small" fullWidth
                onChange={
                    (event) => {
                        setPrice(event.target.value);
                    }
                }
                />
                <Button type="submit" variant="contained" disabled={buttonDisabled}>Cadastrar</Button>
            </form>
            
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                open={showNotification}
            >
                <Alert severity={notificationType} sx={{ width: '100%' }}>
                    {notificationMsg}
                </Alert>
            </Snackbar>
        </>
    );

}

export default CreateTaskForm;
