import React from 'react';
import TextField from '@mui/material/TextField';

const TextInput = (props) => {
    const onChange = (e) => {
        props.setValue(e.target.value);

        if (props.hasSubmitted && props.validateEmails(props.name, e.target.value)) {
            props.setError(null);
        }
    }

    return (
        <TextField
            variant={props.variant}
            margin='normal'
            required={props.required}
            fullWidth
            id={props.id}
            label={props.label}
            name={props.name}
            type={props.type}
            error={props.error}
            helperText={props.helperText ? props.helperText : ' '}
            placeholder={props.placeholder}
            autoFocus={props.autoFocus}
            value={props.value}
            onChange={onChange}
            sx={{ ...props.sx, mt: 0 }}
        />
    );
};

export default TextInput;
