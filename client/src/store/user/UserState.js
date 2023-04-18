import React, { useCallback, useState } from 'react';
import UserContext from './userContext';
import { SERVER_LINK } from './../../dev-server-link';

const initialState = {
    isLoading: false,
    loggedIn: undefined,
    error: undefined,
    loginid: undefined,
    name: undefined,
    designation: undefined,
    deptName: undefined
};

const UserState = props => {

    const [user, setUser] = useState(initialState);

    const getLoggedIn = useCallback(async () => {

        try {
            setUser(prev => prev.isLoading = true);

            const response = await fetch(
                `${SERVER_LINK}/api/user/loggedIn`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    credentials: 'include'
                }
            ).then(data => data.json());

            setUser(prev => {
                prev.loggedIn = response.status || false;

                prev.loginid = response.loginid || undefined;
                prev.name = response.name || undefined;
                prev.designation = response.designation || undefined;
                prev.deptName = response.deptName || undefined;

                return prev;
            });

        } catch (error) {
            console.error(error);
            setUser(prev => prev.error = JSON.stringify(error));
        } finally {
            setUser(prev => prev.isLoading = false);
        }

    }, [])

    const signup = useCallback(async () => {

    }, [])

    const login = useCallback(async () => {

    }, [])

    const logout = useCallback(async () => {

    }, [])


    return (
        <UserContext.Provider
            value={{
                user, login, signup, getLoggedIn, logout
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;