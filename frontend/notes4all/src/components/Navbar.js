import React from 'react';
import { AppBar } from "@mui/material";
import Logo from "../logo.svg";

const Navbar = () => {
    return (
        <AppBar position="static">
            <img src={Logo} alt="Logo" style={{ height: "5em" }}/>
        </AppBar>
    );
};

export default Navbar;