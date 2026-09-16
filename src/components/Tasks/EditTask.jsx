import { Alert, Button, Grid, Snackbar, TextField, TableBody, TableCell, TableContainer, TableRow, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import ErrorMessages from "../../enums/ErrorMessages";

import { taskService } from "../../services/taskService";

function EditTask()
{
    const navigate = useNavigate();

    const [notificationType, setNotificationType] = useState("");
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    const [task, setTask] = useState([]);
    const [createdBy, setCreatedBy] = useState([]);

    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [status, setStatus] = useState(null);
    const [type, setType] = useState(null);

    useEffect(() => {
        taskService.getTaskById(window.location.pathname.split("/")[3])
        .then((data) => {
            setTask(data.data);
            setCreatedBy(data.data.created_by);
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    }, []);

    const handleUpdate = (taskId) => 
    {
        taskService.updateTask(taskId, buildRequestObject())
        .then(() => {
            navigate("/task/view/" + taskId);
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    }

    const buildRequestObject = () =>
    {
        var requestObj = {};

        if (title !== null) {
            requestObj.title = title;
        }

        if (description !== null) {
            requestObj.description = description;
        }

        if (status !== null) {
            requestObj.status = status;
        }

        if (type !== null) {
            requestObj.type = type;
        }

        return requestObj;
    }

    return (
        <Grid key={task.id} >
            <TableContainer >
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <h2 style={{ display: 'inline-block' }}>{task.title}</h2>&nbsp;&nbsp;&nbsp;
                            <Button style={{ height: '2.2em', marginTop: '-0.6em', backgroundColor: 'lightskyblue', color: 'black' }}>
                                <a href="#" style={{textDecoration: 'none', fontSize:'x-small', color: 'black'}} onClick={() => { handleUpdate(task.id) }} >Update</a>
                            </Button>
                            <br/><b>Created On:</b> {task.created_on} <b>By</b> {createdBy.name}<br/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <TextField id="title" label="Title" margin="dense" size="small" defaultValue={task.title}  fullWidth
                                onChange={
                                    (event) => {
                                        setTitle(event.target.value);
                                    }
                                }/>
                            <TextField id="status" label="Status" margin="dense" size="small" defaultValue={task.status} fullWidth select 
                                onChange={
                                    (event) => {
                                        setStatus(event.target.value);
                                    }
                                }>
                                <MenuItem value={"open"}>Open</MenuItem>
                                <MenuItem value={"in_dev"}>In Dev</MenuItem>
                                <MenuItem value={"blocked"} selected={true} >Blocked</MenuItem>
                                <MenuItem value={"in_qa"}>In QA</MenuItem>
                            </TextField>
                            <TextField id="type" label="Type" margin="dense" size="small" defaultValue={task.type} fullWidth
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
                            <TextField id="description" defaultValue={task.description} label="Description" multiline rows={10} fullWidth 
                                onChange={
                                    (event) => {
                                        setDescription(event.target.value);
                                    }
                                }/>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </TableContainer>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                open={showNotification}
            >
                <Alert severity={notificationType} sx={{ width: '100%' }}>
                    {notificationMsg}
                </Alert>
            </Snackbar>
        </Grid>
    );
    
}

export default EditTask;
