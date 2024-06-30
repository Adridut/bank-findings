import React, { useState } from 'react';
import { Link, Form, redirect } from "react-router-dom";
import "./login.css" 
import ecb_logo from '../images/ecb.jpg';
import { login} from '../contacts';



export async function action({ request, params }) {
    // await createUser("John", "123")
    // await createUser("Alice", "123")
    // await createUser("Bob", "123")
    const formData = await request.formData();
    const credentials = Object.fromEntries(formData);
    const success = await login(credentials.username, credentials.password);
    if (success) {
        localStorage.setItem("token", true);
        return redirect("/portal");
    } else {
        return false;
    }
}


const Login = () => {

    return (
        <div className='login-container'>
            <img src={ecb_logo} className='ecb-logo'/>
            <h1 className='login-header'>ECB Findings Library</h1>
            <Form method="post" className='login-form'>
                <h2>Sign In</h2>
                <input
                    type="text"
                    id="username"
                    placeholder='Username'
                    className="login-input"
                    required={true}
                    name='username'
                />
                <input
                    className="login-input"
                    type="password"
                    id="password"
                    placeholder='Password'
                    required={true}
                    name='password'
                />
                <button type="submit" className="link-button">Login</button>
            </Form>
        </div>
    );
};

export default Login;
