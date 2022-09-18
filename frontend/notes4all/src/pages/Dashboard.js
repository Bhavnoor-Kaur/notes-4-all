import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { Typography, Grid, Button } from "@mui/material";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Container } from "@mui/system";
import NoteTable from "../components/NoteTable";

const Dashboard = () => {
    const [rows, setRows] = useState([]);
    const [redirect, setRedirect] = useState(null);

    const handleClick = () => {
        setRedirect(true);
    };

    useEffect(() => {
        fetch("http://localhost:8000/notes/")
        .then(response => response.json())
        .then(_data => {
            let data = [];
            _data.forEach((row) => data = [...data, createData(row)]);
            console.log(data);
            setRows(data);
        })
        .catch(e => console.error(e));
        setRedirect(false);
    }, []);

    const createData = ({id, title, notes_data, summary_data}) => {
        return { date: "18/09/2022", id: id, title, transcription: notes_data, summary: summary_data };
    };

    return (
        <Container>
            {redirect && <Navigate to="/record" replace/>}
            <Grid container spacing={2} sx={{ mt: "2em", justifyContent: "flex-start"}}>
                <Typography component="h6" variant="h6" sx={{ borderBottom: "1px solid #00BFB2"}}>
                    MY DASHBOARD
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleClick}
                    sx={{ pl: 1, marginLeft: "auto" }}>
                    <AddRoundedIcon />
                    ADD A NOTE
                </Button>
            </Grid>
            <NoteTable rows={rows} />
        </Container>
    );
};

export default Dashboard;