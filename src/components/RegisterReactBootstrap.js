import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.init';
import { Link } from 'react-router-dom';

const auth = getAuth(app)

const RegisterReactBootstrap = () => {
    const [passwordError, setPasswordsError] = useState('')
    const [success, setSuccess] = useState(false);

    const handelRegister = event => {
        event.preventDefault();
        setSuccess(false);
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        console.log(name, email, password);
        if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
            setPasswordsError('Please provide at list two upper case letters');
            return;
        }
        if (password.length < 6) {
            setPasswordsError('Please provide at list 6 characters');
            return;
        }
        if (!/(?=.*[!@#$%&*?])/.test(password)) {
            setPasswordsError('Please add at least one special character');
            return;
        }
        setPasswordsError('')

        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                console.log(user);
                setSuccess(true);
                form.reset();
                verifyEmail()
                updateUserName(name)
            })
            .catch((error) => {
                console.error(error);
                setPasswordsError(error.message)
            })
    }


    const verifyEmail = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                alert('please verify your email address')
            })
    }

    const updateUserName = (name) => {
        updateProfile(auth.currentUser, {
            displayName: name
        })
            .then(() => {
                console.log('display name updated')
            })
            .catch((error) => {
                console.error(error)
            })
    }

    return (
        <div className='w-50 mx-auto mt-4'>
            <h3 className='text-primary mb-5'>Please register !!</h3>

            <Form onSubmit={handelRegister}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name='name' placeholder="Enter your name" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name='email' placeholder="Enter email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name='password' placeholder="Enter password" required />
                </Form.Group>

                <p className="text-danger">{passwordError}</p>
                {success && <p className="text-primary">Wow, successfully created!</p>}
                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
            <p className='mt-3'><small>Already have an account? Please <Link to='/login'>Login</Link> </small></p>
        </div>
    );
};

export default RegisterReactBootstrap;