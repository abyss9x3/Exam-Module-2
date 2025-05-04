import React, { useContext, useEffect } from "react";
import userContext from "./store/user/userContext";
import styles from './App.module.css';
import NavBar from './components/NavBar/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';

import UserDetails from "./components/UserDetails/UserDetails";
import NavigationStack from "./components/NavigationStack/NavigationStack";

const App = () => {

    const { getLoggedIn } = useContext(userContext);

    useEffect(() => {
        getLoggedIn();
    }, [getLoggedIn]);


    return (
        <div className={styles.App}>

            <NavBar />

            <main className={styles.mainContainer}>
                <NavigationStack />
            </main>

            <UserDetails />

        </div >
    );
}

export default App;
