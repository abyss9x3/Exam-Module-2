import { useContext, useState } from "react";
import styles from "./styles.module.css";
import userContext from "../../store/user/userContext";

const Signup = () => {

    const { user, register } = useContext(userContext);

    const [data, setData] = useState({
        name: "",
        loginid: "",
        password: "",
        designation: "",
        deptName: ""
    });

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (user.isAdminRegistering) return;
        const isRegistered = await register({ name: data.name, loginid: data.loginid, password: data.password, designation: data.designation, deptName: data.deptName });
        if (isRegistered) {
            alert(`Registerd loginid:${data.loginid} successfully !!!`);
        }
    };

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Add new account.</h1>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="loginid"
                            name="loginid"
                            onChange={handleChange}
                            value={data.loginid}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            onChange={handleChange}
                            value={data.name}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Designation"
                            name="designation"
                            onChange={handleChange}
                            value={data.designation}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Department Name"
                            name="deptName"
                            onChange={handleChange}
                            value={data.deptName}
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />

                        {user.registrationError && <div className={styles.error_msg}>{user.registrationError}</div>}

                        <button disabled={user.isAdminRegistering} type="submit" className={styles.green_btn}>
                            {user.isAdminRegistering ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
