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

    const signup = useCallback(async ({ name, loginid, password, designation, deptName }) => {
        try {
            setUser(prev => prev.isLoading = true);
            await fetch(
                `${SERVER_LINK}/api/user/register`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ name, loginid, password, designation, deptName })
                }
            ).then(data => data.json());

            await getLoggedIn();

        } catch (error) {
            console.error('Registering Failed !', error);
            setUser(prev => prev.error = JSON.stringify(error));
        } finally {
            setUser(prev => prev.isLoading = false);
        }
    }, [getLoggedIn])

    const login = useCallback(async ({ loginid, password }) => {
        try {
            setUser(prev => prev.isLoading = true);

            await fetch(
                `${SERVER_LINK}/api/user/login`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify({ loginid, password })
                }
            ).then(data => data.json());

            await getLoggedIn();

        } catch (error) {
            console.error('LogIn Failed !', error);
            setUser(prev => prev.error = JSON.stringify(error));
        } finally {
            setUser(prev => prev.isLoading = false);
        }
    }, [getLoggedIn]);

    const logout = useCallback(async () => {
        try {
            setUser(prev => prev.isLoading = true);

            await fetch(
                `${SERVER_LINK}/api/user/logout`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'GET',
                    credentials: 'include'
                }
            ).then(data => data.json());

            await getLoggedIn();

        } catch (error) {
            console.error('LogOut Failed !', error);
            setUser(prev => prev.error = JSON.stringify(error));
        } finally {
            setUser(prev => prev.isLoading = false);
        }
    }, [getLoggedIn])

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