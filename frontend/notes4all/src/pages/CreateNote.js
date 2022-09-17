import React, { useState } from 'react';

import Box from '@mui/system/Box';
import Button from '@mui/material/Button';

import TextInput from '../components/TextInput';


const CreateNote = () => {
    const [creater, setCreater] = useState('');
    const [createrErr, setCreaterErr] = useState(null);
    const [collab, setCollab] = useState('');
    const [collabErr, setCollabErr] = useState(null);
    
    const [hasSubmitted, setHasSubmitted] = useState(false);


    const isEmail = (email) => {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    };

    const validateEmails = (name, input) => {
        let isValid = true;
        switch (name) {
            case "creater-email":
                if (!isEmail(input)) {
                    setCreaterErr("Invalid email address");
                    isValid = false;
                }
                break
            case "collab-email":
                if (!input) break;

                const collabs = input.split(',');
                collabs.forEach((collab) => {
                    if (!isEmail(collab.trim())) {
                        setCollabErr("Invalid email address");
                        isValid = false;
                    }
                });
                break;
            default:
                break;
        }
        return isValid;

    }

    const handleSubmit = (e) => {
        let isValid = true;

        if (!validateEmails("creater-email", creater)) {
            isValid = false;
        }
        else {
            setCreaterErr(null);
        }
        
        if (!validateEmails("collab-email", collab)) {
            console.log("invalid collab");
            isValid = false;
        }
        else {
            setCollabErr(null);
        }


        // TODO
        if (isValid) {
            // create the note
            console.log("valid");
        }
        else {
            if (!hasSubmitted) {
                setHasSubmitted(true);
            }
        }

        e.preventDefault();
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            component="form" 
            onSubmit={handleSubmit} 
        >
            <TextInput
                variant="standard"
                required
                fullWidth
                id="creator-email"
                label="Creater Email"
                name="creater-email"
                type="email"
                error={hasSubmitted && createrErr !== null}
                helperText={hasSubmitted ? createrErr : " "}
                placeholder="bob@bob.com"
                autoFocus
                value={creater}
                setValue={setCreater}
                setError={setCreaterErr}
                validateEmails={validateEmails}
                hasSubmitted={hasSubmitted}
            />
            <TextInput
                variant="standard"
                fullWidth
                id="collab-email"
                label="Collaborator Email(s)"
                name="collab-email"
                type="text"
                error={hasSubmitted && collabErr !== null}
                helperText={hasSubmitted ? collabErr : " "}
                placeholder="john@john.com, jane@jane.com"
                autoFocus
                value={collab}
                setValue={setCollab}
                setError={setCollabErr}
                validateEmails={validateEmails}
                hasSubmitted={hasSubmitted}
            />
            <Button
                type='submit'
                fullWidth
                disabled={createrErr !== null || collabErr !== null}
                color="success"
                variant="contained"
            >
                Create Note!
            </Button>
        </Box>
    );
};

export default CreateNote;