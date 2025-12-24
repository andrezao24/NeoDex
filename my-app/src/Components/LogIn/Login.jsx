import React, { useState } from 'react';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import { auth, provider } from "../../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link} from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import './Login.css';

export default function Login() {
    // estados para email, senha e mensagens de erro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErro] = useState('');

    const redirecionar = useNavigate();

    // regex para validação de email
    const checkEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // login via Google
    const handleLoginGoogle = async () => {
        setErro('');

        try {
            const result = await signInWithPopup(auth, provider);
            const loggedUser = result.user; // utilizador autenticado
            redirecionar('/');

        } catch (err) {
            console.log("Erro", err);
            setErro(err.message);
        }
    };

    // login via email e senha
    const handleLoginEmail = async (e) => {
        e.preventDefault();
        setErro('');

        // validação do email
        if (!checkEmail.test(email)) {
            setErro('Please enter a valid email address.');
            return;
        }

        //o mesmo de cima
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedUser = userCredential.user;
            redirecionar('/');
        } catch (err) {
            console.log("Erro", err);
            setErro(err.message);
        }
    };

    //reset password
    const handleEsqueceuPasse = async () => {
        setErro('');

        // valida se o email foi preenchido
        if (!email) {
            setErro('Please enter an email address to reset your password.');
            return;
        }

        // valida o formato do email
        if (!checkEmail.test(email)) {
            setErro('Please enter a valid email address.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email); //envia email de reset - para o spam....
            setErro('Email sent successfully! Check your Spam in the E-mail!');

        } catch (err) {
            console.log("Erro", err);
            setErro('Please confirm if the email address is correct.');
        }
    };

    return (
        <div className="login-container">
            <h2 className='login-name'>Login</h2>

            {/* exibe mensagens de erro */}
            {err && <p className="erro">{err}</p>}

            {/* login com email */}
            <form onSubmit={handleLoginEmail} className="login-form">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="input-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                />

                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="input-email"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />
                <Button type="submit" className='botao-submit'> Login with E-mail </Button>
            </form>

            {/* login via Google */}
            <Button className="google-login-button" onClick={handleLoginGoogle}>
                Login with Google
            </Button>

            {/* criar conta */}
            <p>
                Create an Account,{' '}
                <Link to="/criar" className="link-registrar">
                    here!
                </Link>
            </p>

            {/* reset de senha */}
            <p className="esquecer-senha" onClick={handleEsqueceuPasse}>
                Forgot your password?
            </p>
        </div>
    );
};
