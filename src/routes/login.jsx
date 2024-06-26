import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./login.css" 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform login logic here
    };

    return (
        <div className='login-container'>
            <h1 className='login-header'>Bank Findings and Measures Library</h1>
            <form onSubmit={handleSubmit} className='login-form'>
                <h2>Sign In</h2>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder='Username'
                    className="login-input"
                />
                <input
                    className="login-input"
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder='Password'
                />
                <Link className="link-button" to="/">Login</Link>
            </form>
        </div>
    );
};

export default Login;
