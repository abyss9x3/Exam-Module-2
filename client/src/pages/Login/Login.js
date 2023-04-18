import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import userContext from '../../store/user/userContext';
import styles from "./styles.module.css";

const Login = () => {

    const { user, login } = useContext(userContext);

    const navigator = useNavigate();

    useEffect(() => {
        if (user.loggedIn) {
            navigator("/home");
        }
    }, [navigator, user.loggedIn]);

    const [data, setData] = useState({ loginid: "", password: "" });

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        if (user.isLoading) return;
        login({ loginid: data.loginid, password: data.loginid });
    };

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Login to Your Account</h1>
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
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {user.error && <div className={styles.error_msg}>{user.error}</div>}

                        <div className={styles.mbuttons}>
                            <div className={styles.normalsignup}>
                                <button disabled={user.isLoading} type="submit" className={styles.green_btn}>
                                    {user.isLoading ? 'Signing In...' : 'SignIn'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
