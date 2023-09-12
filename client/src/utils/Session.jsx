import axios from 'axios';

export const getSessionData = async () => {
    try {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            const response = await axios.get(`/api/users/session`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching session data:', error);
        throw error;
    }
};

export const Logout = async (navigateTo) => {
    try {
        sessionStorage.removeItem('authToken');
        navigateTo('/');
    } catch (error) {
        console.error('Error during logout:', error);
    }
};
