import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import { redirect, Form, Link } from "react-router-dom";
import "./login.css" 


export default function Login () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const { login } = useAuth();
    const handleLogin = async (e) => {
        e.preventDefault();
        // Here you would usually send a request to your backend to authenticate the user
        // For the sake of this example, we're using a mock authentication
        if (username === "user" && password === "password") {
        // Replace with actual authentication logic
        await login({ username });
        } else {
        alert("Invalid username or password");
        }
    };

    return (
        <div className='login-container'>
            <h1 className='login-header'>Bank Findings and Measures Library</h1>
            <form onSubmit={handleLogin} className='login-form'>
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
                <button className="link-button" type="submit">Login</button>
            </form>
        </div>
    );
};

