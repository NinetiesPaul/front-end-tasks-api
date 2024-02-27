import { React, useState } from "react";
import { Alert, Button, MenuItem, Snackbar, TextField } from "@mui/material";
import { useNavigate } from "react-router";

import ErrorMessages from "../enums/ErrorMessages";

function CreateTaskForm()
{
    const navigate = useNavigate();

    const [notificationType, setNotificationType] = useState("");
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [type, setType] = useState(null);

    const host = process.env.REACT_APP_SERVER_HOST;
    const token = sessionStorage.getItem("token");

    const handleSubmit = async () => {
        await fetch(host + '/api/task/create',
        {
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }, 
            method: 'POST', 
            body: buildRequestObject()
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {                
                navigate("/task/view/" + data.data.id);
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

    const buildRequestObject = () =>
    {
        var requestObj = {};

        if (title !== null) {
            requestObj.title = title;
        }

        if (description !== null) {
            requestObj.description = description;
        }

        if (type !== null) {
            requestObj.type = type;
        }

        return JSON.stringify(requestObj);
    }

    return(
        <>
            <form onSubmit={
                (event) => {
                    event.preventDefault();
                    setButtonDisabled(true);
                    handleSubmit({ title: title, description: description, type: type });
                }
            }
            style={{width: '30%', margin: '0 auto', paddingTop: '10em'}}>
                <TextField id="title" label="Title" margin="dense" size="small" fullWidth
                onChange={
                    (event) => {
                        setTitle(event.target.value);
                    }
                }/>
                
                <TextField id="type" label="Type" margin="dense" size="small" fullWidth
                onChange={
                    (event) => {
                        setType(event.target.value);
                    }
                } select
                >
                    <MenuItem value={"feature"} selected={true}>Feature</MenuItem>
                    <MenuItem value={"bugfix"}>Bugfix</MenuItem>
                    <MenuItem value={"hotfix"}>Hotfix</MenuItem>
                </TextField>

                <TextField id="description" label="Description" multiline rows={10} fullWidth
                onChange={
                    (event) => {
                        setDescription(event.target.value);
                    }
                }
                />
                
                <Button type="submit" variant="contained" disabled={buttonDisabled}>Create</Button>
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
