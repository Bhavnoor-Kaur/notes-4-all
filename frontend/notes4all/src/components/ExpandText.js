import { useState } from 'react';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const VisibilityButton = ({value, handleClicked, key}) => {
    return (
        <>
        {value.length > 15 ?
            <>
                {`${value.substring(0, 15)}...`}
                <IconButton key={key} aria-label='show-more' color="secondary" onClick={handleClicked}>
                    <VisibilityIcon />
                </IconButton>
            </> :
            <span key={key}>{value}</span>
            }
        </>
    );
}


const ExpandText = ({value, key}) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClicked = (e) => {
        setIsClicked(true);
    };

    return (
        <>
        {!isClicked ?
            <VisibilityButton value={value} handleClicked={handleClicked} key={key} /> :
            <span key={key}>{value}</span>
        }  
        </>
    );
};

export default ExpandText;