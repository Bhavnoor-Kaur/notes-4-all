import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigateRoute = (props) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate(props.to);
    }, []);

    return (
        <></>
    );
};

export default NavigateRoute;