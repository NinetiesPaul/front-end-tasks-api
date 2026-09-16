import { Alert, Grid, Snackbar, TextField, Divider, Container, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import ErrorMessages from "../../enums/ErrorMessages";
import StatusList from "../../enums/StatusList";
import TypeList from "../../enums/TypeList";

import { taskService } from "../../services/taskService";
import { userService } from "../../services/userService";

function ListTasks()
{
    const [notificationType, setNotificationType] = useState("");
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [filterContext, setFilterContext] = useState("status");
    const [filterParam, setFilterParam] = useState('');
    const [filterByUser, setFilterByUser] = useState("");

    const [searchParams] = useSearchParams();
    const filterString = (searchParams.get('tipo') === null) ? '' : '?type='+searchParams.get('tipo');

    useEffect(() => {
        taskService.getTasks()
        .then((data) => {
            setTasks(data.data.tasks);
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    }, []);

    useEffect(() => {
        userService.getUsers()
        .then((data) => {
            setUsers(data.data.users);
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    }, []);

    return(
        <>
            <p style={{textAlign: 'center'}}>
                <TextField label="Filter by" size="small" style={{minWidth: "10%", marginRight: '2em'}}
                    onChange={
                        (event) => {
                            setFilterContext(event.target.value);
                            setFilterParam('');
                            setFilterByUser('');
                        }
                    } select
                >
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="type">Type</MenuItem>
                    <MenuItem value="created_by">Created by</MenuItem>
                </TextField>
                
                {(() => {
                    switch (filterContext) {
                        case "type":
                            return (
                                <TextField
                                    label={`Search ${filterContext}`}
                                    size="small"
                                    onChange={(event) => { setFilterParam(event.target.value); }}
                                    style={{minWidth: "20%"}}
                                    select
                                >
                                    <MenuItem value="">All types</MenuItem>
                                    {
                                        Object.keys(TypeList).map((type) => (
                                            <MenuItem value={type} key={type}>{TypeList[type]}</MenuItem>
                                        ))
                                    }
                                </TextField>
                            );
                        case "status":
                            return (
                                <TextField
                                    label={`Search ${filterContext}`}
                                    size="small"
                                    onChange={(event) => { setFilterParam(event.target.value); }}
                                    style={{minWidth: "20%"}}
                                    select
                                >
                                    <MenuItem value="">All statuses</MenuItem>
                                    {
                                        Object.keys(StatusList).map((status) => (
                                            <MenuItem value={status} key={status}>{StatusList[status]}</MenuItem>
                                        ))
                                    }
                                </TextField>
                            );
                        case "created_by":
                            return (
                                <TextField
                                    label="Filter by user"
                                    size="small"
                                    onChange={(event) => { setFilterByUser(event.target.value); }}
                                    style={{ minWidth: "20%" }}
                                    select
                                >
                                    <MenuItem value="">All users</MenuItem>
                                    {
                                        users.map((user) => (
                                            <MenuItem value={user.id} key={user.id}>{user.name}</MenuItem>
                                        ))
                                    }
                                </TextField>
                            );
                        default:
                            return null;
                    }
                })()}
           
            </p>
            <Container style={{gap: '2em', padding:'1em'}} >
                {
                    tasks.filter((filteredTask) => {
                        if(filterContext !== "created_by") {
                            return filteredTask[filterContext].toLowerCase().includes(filterParam);
                        }
                        if (filterByUser !== "") {
                            return filteredTask.created_by.id === filterByUser;
                        }
                        return filteredTask;
                    })
                    .map((task) => {
                        return (
                            <Grid  sx={{ borderRadius: 2}} style={{marginBottom: '0.5em', backgroundColor: 'white', padding: '1em'}} key={task.id}>
                                <span>
                                    <Link to={'/task/view/' + task.id} style={{textDecoration: 'none' }}> <b>{task.title}</b> </Link>
                                </span><br/>
                                { TypeList[task.type] }<br/>
                                { StatusList[task.status] }<br/>
                                <Divider />
                                <i>Created by <b>{task.created_by.name}</b> on {task.created_on}</i> <br/>
                            </Grid>
                        );
                    })
                }
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
                    open={showNotification}
                >
                    <Alert severity={notificationType} sx={{ width: '100%' }}>
                        {notificationMsg}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    )
}

export default ListTasks;
