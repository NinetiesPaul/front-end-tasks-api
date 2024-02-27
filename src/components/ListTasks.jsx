import { Alert, Grid, Snackbar, TextField, Divider, Container, MenuItem } from "@mui/material";
import { React, useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import ErrorMessages from "../enums/ErrorMessages";
//import StatusList from "../enums/StatusList";
//import TypeList from "../enums/TypeList";

function ListTasks()
{
    const [notificationType, setNotificationType] = useState("");
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    const [filterContext, setFilterContext] = useState("status");
    const [filterParam, setFilterParam] = useState('');
    const [filterByUser, setFilterByUser] = useState("");

    const statusFormattedText = {
        closed: "Closed",
        open: "Open",
        in_qa: "In QA",
        in_dev: "In Dev",
        blocked: "Blocked",
    }

    const filterString = (searchParams.get('tipo') === null) ? '' : '?type='+searchParams.get('tipo');
    const host = process.env.REACT_APP_SERVER_HOST;
    const token = sessionStorage.getItem("token");

    if (!token) {
        navigate("/login");
    }

    const handleRequest = () => {
        fetch( host + '/api/task/list' + filterString, { headers: { 'Authorization': 'Bearer ' + token } } )
        .then((response) => response.json())
        .then((data) => {
            setTasks(data.data.tasks);
            
            var ids = [];
            var filteredUsers = [];
            data.data.tasks.filter((task) => {
                if (!ids.includes(task.created_by.id)){
                    ids.push(task.created_by.id)
                    filteredUsers.push({ id: task.created_by.id, name: task.created_by.name })
                }
            })
            setUsers(filteredUsers);
        })
        .catch((err) => {
            var message = (err.message !== '') ? err.message : ErrorMessages.DEFAULT_ERROR_MSG;
            setNotificationType('error')
            setShowNotification(true)
            setNotificationMsg(message)
        });
    }

    useEffect(() => {
        handleRequest();
    }, []);

    return(
        <>
            <p style={{textAlign: 'center'}}>
                <TextField label="Filter by" size="small" style={{minWidth: "10%", marginRight: '2em'}}
                    onChange={
                        (event) => {
                            setFilterContext(event.target.value);
                        }
                    } select
                >
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="type">Type</MenuItem>
                    <MenuItem value="created_by">Created by</MenuItem>
                </TextField>
                
                { filterContext !== "created_by" ? (
                    <TextField label={`Search ${filterContext}`} size="small" onChange={(event) => { setFilterParam(event.target.value); }} />
                ) : (
                    <TextField label="Filter by user" size="small" style={{minWidth: "10%", marginRight: '2em'}}
                        onChange={
                            (event) => {
                                setFilterByUser(event.target.value);
                            }
                        } select
                    >
                        <MenuItem value="">&nbsp;</MenuItem>
                        {
                            users.map((user) => {
                                return <MenuItem value={user.id}>{user.name}</MenuItem>
                            })
                        }
                    </TextField>
                )}
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
                                { task.type.charAt(0).toUpperCase() + task.type.slice(1) }<br/>
                                { statusFormattedText[task.status] }<br/>
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
