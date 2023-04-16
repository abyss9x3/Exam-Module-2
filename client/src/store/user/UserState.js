import React, { useCallback, useReducer } from 'react';
import UserContext from './userContext';
import UserReducer from './userReducer';
import { SET_USER, REMOVE_USER, CLEAR_USER } from './userTypes';

const initialState = [];

const UserState = props => {

    const [user, dispatch] = useReducer(UserReducer, initialState);

    const write = useCallback((msg) => {
        dispatch({
            type: SET_USER,
            payload: msg
        });
    }, [])

    const pop = useCallback((afterms = 0, msg) => {
        setTimeout(() => {
            dispatch({
                type: REMOVE_USER,
                payload: { msg }
            });
        }, afterms);
    }, [])

    const clear = useCallback(() => {
        dispatch({
            type: CLEAR_USER
        });
    }, [])

    return (
        <UserContext.Provider
            value={{
                user,
                write,
                pop,
                clear
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;