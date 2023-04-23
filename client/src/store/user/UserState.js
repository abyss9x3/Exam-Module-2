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
    deptName: undefined,
    isAdminRegistering: false,
    registrationError: undefined
};

// designation can be : member, hod, examofficer, examcontroller, admin

const UserState = props => {

    const [user, setUser] = useState(initialState);

    const getLoggedIn = useCallback(async () => {
        try {
            setUser(prev => {
                prev.isLoading = true;
                return { ...prev };
            });

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

                return { ...prev };
            });

            if (response.status) {
                setUser(prev => {
                    prev.error = undefined;
                    return { ...prev };
                });
            }

        } catch (error) {
            console.error(error);
            setUser(prev => {
                prev.error = JSON.stringify(error)
                return { ...prev };
            });
        } finally {
            setUser(prev => {
                prev.isLoading = false;
                return { ...prev };
            });
        }
    }, []);

    const register = useCallback(async ({ name, loginid, password, designation, deptName }) => {
        let isRegistered = false;
        try {
            setUser(prev => {
                prev.isAdminRegistering = true;
                return { ...prev };
            });

            const response = await fetch(
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

            if (response.error) {
                setUser(prev => {
                    prev.registrationError = response.error;
                    return { ...prev };
                });
                isRegistered = false;
            } else {
                isRegistered = true;
            }

        } catch (error) {
            console.error('Registration Failed !', error);
            setUser(prev => {
                prev.registrationError = JSON.stringify(error)
                return { ...prev };
            });

            isRegistered = false;
        } finally {
            setUser(prev => {
                prev.isAdminRegistering = false;
                return { ...prev };
            });
        }

        return isRegistered;
    }, []);

    const login = useCallback(async ({ loginid, password }) => {
        try {
            setUser(prev => {
                prev.isLoading = true;
                return { ...prev };
            });

            const response = await fetch(
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

            if (response.error) {
                setUser(prev => {
                    prev.error = response.error;
                    return { ...prev };
                });
            }

        } catch (error) {
            console.error('LogIn Failed !', error);
            setUser(prev => {
                prev.error = JSON.stringify(error)
                return { ...prev };
            });
        } finally {
            setUser(prev => {
                prev.isLoading = false;
                return { ...prev };
            });
        }
    }, [getLoggedIn]);

    const logout = useCallback(async () => {
        try {
            setUser(prev => {
                prev.isLoading = true;
                return { ...prev };
            });

            const response = await fetch(
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

            if (response.error) {
                setUser(prev => {
                    prev.error = response.error;
                    return { ...prev };
                });
            }

        } catch (error) {
            console.error('LogOut Failed !', error);
            setUser(prev => {
                prev.error = JSON.stringify(error)
                return { ...prev };
            });
        } finally {
            setUser(prev => {
                prev.isLoading = false;
                return { ...prev };
            });
        }
    }, [getLoggedIn]);

    return (
        <UserContext.Provider
            value={{
                user, login, register, getLoggedIn, logout
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;
