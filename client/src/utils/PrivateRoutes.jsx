import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoutes = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.post('/api/authToken', null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                if (response.data.status === "valid") {
                    setAuthenticated(true);
                }
                setLoading(false); // Mark loading as finished
            }).catch((error) => {
                console.log('Token verification error: ', error);
                setLoading(false); // Mark loading as finished even on error
            });
        } else {
            setLoading(false); // Mark loading as finished if there's no token
        }
    }, []);

    if (loading) { //if loading still true it will not continue the reurn under this code
        return null; // You can render a loading indicator here if needed
    }

    return authenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
