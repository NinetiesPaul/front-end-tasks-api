import { Alert, Grid, Snackbar, TextField, Divider, Container } from "@mui/material";
import { React, useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import ErrorMessages from "../enums/ErrorMessages";

function ListTasks()
{
    const [notificationType, setNotificationType] = useState("");
    const [notificationMsg, setNotificationMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [tasks, setTasks] = useState([]);
    const [nameSearch, setNameSearch] = useState('');

    const statusFormattedText = {
        closed: "Closed",
        open: "Open",
        in_qa: "In QA",
        in_dev: "In Dev",
        blocked: "Blocked",
    }

    const filterByType = (searchParams.get('tipo') === null) ? '' : '?type='+searchParams.get('tipo');
    const host = process.env.REACT_APP_SERVER_HOST;
    const token = sessionStorage.getItem("token");

    if (!token) {
        navigate("/login");
    }

    const handleRequest = () => {
        fetch( host + '/api/task/list' + filterByType, { headers: { 'Authorization': 'Bearer ' + token } } )
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setTasks(data.data.tasks);
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
            <p style={{width: '100%', textAlign: 'center'}}>
                <TextField id="outlined-basic" label="Busca" variant="outlined"  onChange={(event) => { setNameSearch(event.target.value); }} />
            </p>
            <Container style={{gap: '2em', padding:'1em'}} >
                {
                    tasks.filter(product => product.title.toLowerCase().includes(nameSearch)).map((filteredProduct) => {
                        return (
                            <Grid  sx={{ borderRadius: 2}} style={{marginBottom: '0.5em', backgroundColor: 'white', padding: '1em'}} key={filteredProduct.id}>
                                <span>
                                    <Link to={'/task/view/' + filteredProduct.id} style={{textDecoration: 'none' }}> <b>{filteredProduct.title}</b> </Link>
                                </span><br/>
                                { filteredProduct.type.charAt(0).toUpperCase() + filteredProduct.type.slice(1) }<br/>
                                { statusFormattedText[filteredProduct.status] }<br/>
                                <Divider />
                                <i>Created by <b>{filteredProduct.created_by.name}</b> on {filteredProduct.created_on}</i> <br/>
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
