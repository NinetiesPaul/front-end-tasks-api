import { Alert, Button, Grid, Snackbar, TableBody, TableCell, TableContainer, TableRow, Stack, Chip } from "@mui/material";
import { React, useState, useEffect } from "react";

import ErrorMessages from "../../enums/ErrorMessages";
import StatusList from "../../enums/StatusList";
import TypeList from "../../enums/TypeList";

function ViewTask()
{
    const [notificationType, setNotificationType] = useState("");
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    const [task, setTask] = useState([]);
    const [createdBy, setCreatedBy] = useState([]);
    const [closedBy, setClosedBy] = useState(null);

    const host = process.env.REACT_APP_SERVER_HOST;
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetch(host + '/api' + window.location.pathname, { headers: { 'Authorization': 'Bearer ' + token } })
        .then((response) => response.json())
        .then((data) => {
            setTask(data.data);
            setCreatedBy(data.data.created_by);
            if (data.data.closed_by) {
                setClosedBy(data.data.closed_by);
            }
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    }, []);

    const handleCloseTask = (taskId) => 
    {
        fetch(host + '/api/task/close/' + taskId, { headers: { 'Authorization': 'Bearer ' + token }, method: 'PUT' })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                window.location.reload(false)
            }
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    }

    return (
        <Grid key={task.id} >
            <TableContainer >
                <TableBody>
                    <TableRow>
                        <TableCell spacing={1}>
                            <h2 style={{ display: 'inline-block' }}>{task.title}</h2>&nbsp;&nbsp;&nbsp;
                            {
                                (task.status !== "closed") ? 
                                    (
                                        <>
                                            <Button style={{ height:'3.5em', marginTop: '-0.6em', backgroundColor: 'lightskyblue', color: 'black', fontSize: 'x-small' }} href={"/task/edit/" + task.id}>
                                                Edit
                                            </Button>&nbsp;
                                            <Button style={{ height:'3.5em', marginTop: '-0.6em', backgroundColor: 'lightcoral', color: 'black', fontSize: 'x-small' }} onClick={() => { handleCloseTask(task.id) }}>
                                                Close
                                            </Button>
                                        </>
                                    ) : ('')
                            }
                            <br/><b>Created On:</b> {task.created_on} <b>By</b> {createdBy.name}
                            {
                                (closedBy !== null) ?
                                    (
                                        <>
                                            <br/><b>Closed On:</b> {task.closed_on} <b>By</b> {closedBy.name}
                                        </>
                                    ) : ('')
                            }
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        <Stack direction="row" spacing={1}>
                            <Chip label={ StatusList[task.status] } color="primary" size="small" style={{minWidth: '10em'}} />
                            <Chip label={ TypeList[task.type] } color="primary" size="small" style={{minWidth: '10em'}} />
                            <Chip label="High" color="error" size="small" style={{minWidth: '10em'}} />
                        </Stack>
                            <b>Description:</b> <br/>
                            { task.description }<br/>
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

export default ViewTask;
