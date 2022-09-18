import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar } from "@mui/material";
import Logo from "../logo.svg";

const Navbar = () => {

    return (
        <AppBar component="nav" position="relative">
            <Toolbar sx={{ justifyContent: "center" }}>
                <Link to={"/dashboard"}>
                    <img src={Logo} alt="Logo" style={{ height: "5em" }}/>
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;