import React, { useContext } from 'react'
import userContext from '../../store/user/userContext';

const UserDetails = () => {

    const { user } = useContext(userContext);

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                {user.isLoading ? "Wait loading user details" : (
                    !user.loggedIn ? "You are not loggedin !" :
                        <>
                            {user.loginid && <div><span style={styles.head}>LoginId:</span><span>{user.loginid}</span></div>}
                            {user.name && <div><span style={styles.head}>Name:</span><span>{user.name}</span></div>}
                            {user.deptName && <div><span style={styles.head}>Department:</span><span>{user.deptName}</span></div>}
                            {user.designation && <div><span style={styles.head}>Designation:</span><span>{user.designation}</span></div>}
                            {user.phase && <div><span style={styles.head}>Phase:</span><span>{user.phase}</span></div>}
                        </>
                )}
            </div>
        </section>
    )
}

const styles = {
    section: {
        position: "fixed",
        bottom: "0",
        width: "100%",
        fontFamily: "Overpass",
    },
    container: {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
        padding: "5px 0",
        margin: "0 10px",
        borderTop: "1.5px solid rgba(0, 0, 0, 0.2)"
    },
    head: {
        fontWeight: "600",
        marginRight: "6px"
    }
}

export default UserDetails;
