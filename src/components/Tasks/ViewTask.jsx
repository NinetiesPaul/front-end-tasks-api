import { Alert, Button, Grid, Snackbar, TableBody, TableCell, TableContainer, TableRow, Stack, Chip, TextField, MenuItem } from "@mui/material";
import { React, useState, useEffect } from "react";

import ErrorMessages from "../../enums/ErrorMessages";
import StatusList from "../../enums/StatusList";
import TypeList from "../../enums/TypeList";
import EnumDictionary from "../../enums/EnumDictionary"

function ViewTask()
{
    const [notificationType, setNotificationType] = useState("");
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    const [task, setTask] = useState([]);
    const [createdBy, setCreatedBy] = useState([]);
    const [closedBy, setClosedBy] = useState(null);
    const [taskHistory, setTaskHistory] = useState([]);
    const [assignees, setAssignees] = useState([]);

    const [users, setUsers] = useState([]);

    const host = process.env.REACT_APP_SERVER_HOST;
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetch(host + '/api' + window.location.pathname, { headers: { 'Authorization': 'Bearer ' + token } })
        .then((response) => response.json())
        .then((data) => {
            setTask(data.data);
            setCreatedBy(data.data.created_by);
            setAssignees(data.data.assignees)
            setTaskHistory(data.data.history);
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

    useEffect(() => {
        fetch(host + '/api/users/list', { headers: { 'Authorization': 'Bearer ' + token } })
        .then((response) => response.json())
        .then((data) => {
            let currentAssignees = assignees.map((assignee) => { return assignee.assigned_to.name; })
            let allUsers = data.data.users;
            let availableUsers = allUsers.filter((user) => { if (!currentAssignees.includes(user.name)) { return user } });

            setUsers(availableUsers);
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    }, [ assignees ]);

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

    const handleTaskAssignment = (userId) => 
    {
        fetch(host + '/api/task/assign/' + task.id,
            {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                method: 'POST', 
                body: JSON.stringify(
                    {
                        assigned_to: userId
                    }
                )
            })
        .then((response) => response.json())
        .then((data) => {
            window.location.reload(false)
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    }

    const handleTaskUnassignment = (assignedId) =>
    {
        fetch(host + '/api/task/unassign/' + assignedId,
            {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                method: 'DELETE',
            })
        .then((response) => response.json())
        .then((data) => {
            window.location.reload(false)
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
                            <Stack direction="row" spacing={1}>
                                <Chip label={ StatusList[task.status] } color="primary" size="small" style={{minWidth: '10em'}} />
                                <Chip label={ TypeList[task.type] } color="primary" size="small" style={{minWidth: '10em'}} />
                                <Chip label="High" color="error" size="small" style={{minWidth: '10em'}} />
                            </Stack>
                        </TableCell>
                        <TableCell style={{ display: 'inline-block' }}>
                            <TextField id="assignee" label="Assignee" margin="dense" size="small" fullWidth
                            onChange={
                                (event) => {
                                    handleTaskAssignment(event.target.value)
                                }
                            } select
                            >
                                {
                                    users.map((user) => 
                                        {
                                            return (
                                                <MenuItem value={user.id}>
                                                    { user.name } 
                                                </MenuItem>
                                            )
                                        }
                                    )
                                }
                            </TextField>

                            <b>Assignees:</b><br/>
                            { 
                                assignees.map((assignee) => 
                                    {
                                        return (
                                            <>
                                                <a href="#" data-id={assignee.id} onClick={(event) => { handleTaskUnassignment(event.target.dataset.id)}}>{ assignee.assigned_to.name }</a> <br/>
                                            </>
                                        )
                                    }
                                )
                            }

                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>
                            <b>Description:</b> <br/>
                            { task.description }<br/>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={2}>
                            <b>Task History:</b> <br/>
                            { 
                                taskHistory.map((historyEntry) => 
                                    { 
                                        return [ 'added_assignee', 'removed_assignee' ].includes(historyEntry.field) ?
                                        (
                                            <>
                                                { historyEntry.changed_by.name } { EnumDictionary[historyEntry.field] } { historyEntry.changed_to } as an assignee <br/>
                                            </>
                                        ) : ( 
                                            <>
                                                {  historyEntry.field.charAt(0).toUpperCase() + historyEntry.field.slice(1) } changed from <i>{ EnumDictionary[historyEntry.changed_from] }</i> to <i>{ EnumDictionary[historyEntry.changed_to] }</i> by { historyEntry.changed_by.name } on { historyEntry.changed_on }  <br/>
                                            </>
                                        )
                                    }
                                )
                            }
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
