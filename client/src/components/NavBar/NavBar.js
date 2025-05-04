import React, { useContext, useEffect, useState } from "react"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import { HashLink } from 'react-router-hash-link';
import "./NavBar.css"
import userContext from './../../store/user/userContext';

const NavBar = () => {

    const { user, logout } = useContext(userContext);

    const [expand, setExpand] = useState(false);

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => (window.scrollY > 50) ? setScrolled(true) : setScrolled(false);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <Navbar
            expanded={expand}
            fixed="top"
            expand="md"
            className={`navbar navfontfamily ${scrolled ? 'scrolled' : ''}`}
        >
            <Container>
                <Navbar.Brand href="/" className="d-flex">
                    <span className='nav_ac navbar-brand' to="/">
                        ExamModule2
                    </span>
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="responsive-navbar-nav"
                    onClick={() => {
                        setExpand(prev => prev ? false : "expanded");
                    }}
                />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ms-auto" defaultActiveKey="#home">

                        {!user.loggedIn &&
                            <Nav.Item>
                                <Nav.Link
                                    key='login'
                                    as={HashLink}
                                    to='/login'
                                    onClick={() => setExpand(false)}
                                    className='myNavLink'
                                >
                                    Login
                                </Nav.Link>
                            </Nav.Item>
                        }

                        {user.loggedIn &&
                            <Nav.Item>
                                <Nav.Link
                                    key='logout'
                                    as={HashLink}
                                    onClick={() => { setExpand(false); logout(); }}
                                    className='myNavLink'
                                >
                                    Logout
                                </Nav.Link>
                            </Nav.Item>
                        }

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar >
    );
}

export default NavBar;
