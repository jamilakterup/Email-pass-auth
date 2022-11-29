import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from '../firebase/firebase.init';


const auth = getAuth(app);

const Login = () => {
    const [passwordError, setPasswordsError] = useState('');
    const [success, setSuccess] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const handelSubmit = event => {
        event.preventDefault();
        setSuccess(false);
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password);
        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                const user = result.user;
                console.log(user)
                setSuccess(true);
            })
            .catch(error => {
                console.error(error)
                setPasswordsError(error.message);
            })
    }

    const handelForgetPassword = () => {
        if (!userEmail) {
            alert('Please enter your email')
            return;
        }
        sendPasswordResetEmail(auth, userEmail)
            .then(() => {
                alert('Password reset email sent successfully')
            })
            .catch(error => {
                console.error(error)
            })
    }

    const handelEmailBlur = event => {
        const email = event.target.value;
        setUserEmail(email);
        console.log(email)
    }


    return (
        <div className="w-50 mx-auto mt-4">
            <h3 className=" mb-5 text-primary">Please Login !!</h3>
            <form onSubmit={handelSubmit}>
                <div className="mb-3" >
                    <label for="exampleInputEmail1" className="form-label">Email address</label>
                    <input onBlur={handelEmailBlur} type="email" name='email' className="form-control" id="exampleInputEmail1" />
                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" name='password' className="form-control" id="exampleInputPassword1" />
                </div>
                <button type="submit" className="btn btn-primary mb-3">Submit</button>
            </form>
            <p className="text-danger">{passwordError}</p>
            {success && <p className="text-primary">Log-in successful !!</p>}
            <p><small>New to website? Please <Link to='/register'>Register</Link></small></p>
            <p><small>Forget password? <button type="button" onClick={handelForgetPassword} className="btn btn-link">Reset password</button></small></p>
        </div>
    );
};

export default Login;