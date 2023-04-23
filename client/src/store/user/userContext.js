import { createContext } from 'react';

/**
* @typedef {Object} UserObjectType
* @property {boolean} isLoading
* @property {boolean} loggedIn
* @property {String} error
* @property {boolean} loginid
* @property {String} name
* @property {String} designation
* @property {String} deptName
* @property {boolean} isAdminRegistering
* @property {String} registrationError
*/

/**
* @typedef {Object} ContextType
* @property {UserObjectType} user
* @property {Function} getLoggedIn
* @property {Function} register
* @property {Function} login
* @property {Function} logout
*/

const userContext = createContext();

export default userContext;
