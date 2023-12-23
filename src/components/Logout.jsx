import { useNavigate } from "react-router-dom";

function Logout({setLogged}){
    const navigate = useNavigate();

    sessionStorage.removeItem('token');
    setLogged(false);
    navigate("/");
}

export default Logout;