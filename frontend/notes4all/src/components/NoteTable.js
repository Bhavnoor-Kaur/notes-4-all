import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { useState } from "react";
import ExpandText from "./ExpandText";
import GenerateSummary from "./GenerateSummary";

const columns = [
    { id: 'date', label: 'Date', minWidth: "15%" },
    { id: 'id', label: 'ID', minWidth: "10%" },
    { id: 'title', label: 'Title', minWidth: "15%" , },
    { id: 'transcription', label: 'Transcription', minWidth: "35%" },
    { id: 'summary', label: 'Summary', minWidth: "25%" },
  ];

const NoteTable = ({rows}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: "1em" }}>
            <TableContainer sx={{ maxHeight: 550 }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                <TableRow>
                    {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ minWidth: column.minWidth, px: 1 }}
                    >
                        {column.label}
                    </TableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                        {columns.map((column) => {
                            const value = row[column.id];
                            return (
                            <TableCell key={column.id} align={column.align} sx={{ px: 1 }}>
                                {(column.id === "summary" && value !== undefined && value.length > 0) ?
                                    <GenerateSummary key={column.id} summary={value} /> :
                                    (value !== undefined && value.length > 0) ? 
                                    <ExpandText key={column.id} value={value} /> : null
                                }
                            </TableCell>
                            );
                        })}
                        </TableRow>
                    );
                    })}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default NoteTable;