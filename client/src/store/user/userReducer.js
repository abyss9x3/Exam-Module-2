import { SET_USER, REMOVE_USER, CLEAR_USER } from './types';
import { v4 } from 'uuid'

const userReducer = (state, action) => {
    switch (action.type) {
        case SET_USER: {
            return [...state, { id: v4(), msg: action.payload }];
        }
        case REMOVE_USER: {
            if (!action.payload.id && !action.payload.msg) {
                const arr = [...state];
                arr.pop();
                return arr;
            }
            return state.filter(st => {
                let res = true;
                if (action.payload.id) {
                    res = res && st.id !== action.payload.id
                }
                if (action.payload.msg) {
                    res = res && st.msg !== action.payload.msg
                }
                return res;
            });
        }
        case CLEAR_USER:
            return [];
        default:
            return state;
    }
};

export default userReducer;