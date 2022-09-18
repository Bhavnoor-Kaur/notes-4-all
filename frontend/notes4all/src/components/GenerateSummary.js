import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ExpandText from './ExpandText';

const GenerateSummary = ({summary, key}) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClicked = (e) => {
        setIsClicked(true);
    };

    return (
        <>
        {!isClicked ?
            <Button key={key} variant="contained" color="secondary" onClick={handleClicked}>
                Generate Summary!                                    
            </Button>
            :
            <ExpandText value={summary} key={key}/>
        }
        </>
    );
};

export default GenerateSummary;