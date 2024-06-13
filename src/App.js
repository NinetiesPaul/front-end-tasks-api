import { Component, useState } from 'react';
import { Button, Container, Link, Menu, MenuItem, Typography } from '@mui/material';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './App.css';

import ListTasks from './components/Tasks/ListTasks';
import ViewTask from './components/Tasks/ViewTask';
import EditTask from './components/Tasks/EditTask';
import CreateTask from './components/Tasks/CreateTask';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';

class App extends Component
{

	constructor()
	{
		super();
		this.state = { loggedIn: false }
	}

	setLogged(isLoggedIn)
	{
		this.setState({ loggedIn: isLoggedIn });
	}

	render(){
		return (
			<Container  style={{marginTop: '2em'}} >
				<Container style={{display: 'flex'}}>
					<Typography variant="h3"  >
						<Link href={'/'} style={{color: 'lightskyblue', textDecoration: 'none' }} >TaskPlanner</Link>
					</Typography>
				</Container>
				<Container style={{backgroundColor: 'lightskyblue', padding: '0.2em', textAlign: 'center', minHeight: '2.7em'}}>
					<MainButton />
					<TaskTypeQuickFilter />
					
				</Container>
				<Container style={{backgroundColor: 'aliceblue', padding: '1em', minHeight: '30em'}}>
					<BrowserRouter>
						<Routes>
							<Route path="/login" element={<LoginForm setLogged={this.setLogged.bind(this) } />} />
						</Routes>
						<Routes>
							<Route path="/logout" element={<Logout setLogged={this.setLogged.bind(this)} />} />
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
				
			</Container>
		);
	}
}

function MainButton()
{
	const [showMenu, setShowMenu] = useState(false);
	const [anchorEl, setAnchorEl] = useState([]);

	if (sessionStorage.getItem("token") != null) {
		const isAdmin = (sessionStorage.getItem("role") === 'CLIENT') ? false : true;

		return(
			<>
				<Button
					className={'navBarButton'}
					style={{float: 'left'}}
					id="basic-button"
					onClick={(event) => { setAnchorEl(event.currentTarget); setShowMenu(true); }}
				>
					<span className={'linkFormatting'}>
						Menu
					</span>
				</Button>
				<Menu
					id="basic-menu"
					open={showMenu}
					anchorEl={anchorEl}
					onClose={
						() => { setShowMenu(false); }
					}
					MenuListProps={{
						'aria-labelledby': 'basic-button',
					}}
				>
					{ isAdmin ? (
						<MenuItem>
							<Link href={'/task'} style={{textDecoration: 'none'}}><span className={'linkFormatting'}>Create Task</span></Link>
						</MenuItem>
					) : (
						<>
							<MenuItem>
								<Link href={'/task'} style={{textDecoration: 'none'}}><span className={'linkFormatting'}>Create Task</span></Link>
							</MenuItem>
						</>
					)}
					<MenuItem>
						<Link href={'/logout'} style={{textDecoration: 'none'}} ><span className={'linkFormatting'}>Logout</span></Link>
					</MenuItem>
				</Menu>
			</>
		);
	} else {
		return(
			<Button className={'navBarButton'} style={{float: 'left'}} >
				<Link href={'/login'} style={{color: '#6f3857', fontWeight: 'bold', textDecoration: 'none'}}>Login</Link>
			</Button>
		);
	}
}

function TaskTypeQuickFilter()
{
	if (sessionStorage.getItem("token") != null)
	{
		return(
			['hotfix', 'feature', 'bugfix',].map((type, idx) => {
				const url = "/?tipo=" + type;
				return(
					<Button key={idx} className={'navBarButton'} >
						<Link href={url} style={{color: 'darkblue', fontWeight: 'bold', textDecoration: 'none'}}>{type}</Link>
					</Button>
				)
			})
		);
	}
}

export default App;
