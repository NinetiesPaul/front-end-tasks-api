import { Container } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginForm from "./LoginForm";
import Logout from "./Logout";
import ListTasks from "./Tasks/ListTasks";
import CreateTask from "./Tasks/CreateTask";
import ViewTask from "./Tasks/ViewTask";
import EditTask from "./Tasks/EditTask";

function RoutesHandler({setLogged})
{
    return (
        <Container style={{backgroundColor: 'aliceblue', padding: '1em', minHeight: '30em'}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginForm setLogged={setLogged } />} />
                </Routes>
                <Routes>
                    <Route path="/logout" element={<Logout setLogged={setLogged} />} />
                </Routes>
                <Routes>
                    <Route path="/" element={<ListTasks />} />
                </Routes>
                <Routes>
                    <Route path="/task" element={<CreateTask />} />
                </Routes>
                <Routes>
                    <Route path="/task/view/:id" element={<ViewTask />} />
                </Routes>
                <Routes>
                    <Route path="/task/edit/:id" element={<EditTask />} />
                </Routes>
            </BrowserRouter>
        </Container>
    )
}

export default RoutesHandler;