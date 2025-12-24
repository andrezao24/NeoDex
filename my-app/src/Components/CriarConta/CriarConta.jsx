import React, { useState } from 'react';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';
import './CriarConta.css';

export default function CriarConta() {
    // estados locais para email, password e erro
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErro] = useState('');

    const redirecionar = useNavigate();

    // regex para validar email
    const checkEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // cria documento do usuário no Firestore com favoritos vazio
    const criarUtilizador = async (user) => {
        const userDoc = doc(db, "users", user.uid);
        await setDoc(userDoc, {
            favoritos: [], // pokémons favoritos
            cartasFavoritas: [], // cartas favoritas
            equipasGuardadas: [] // cartas favoritas
        }, { merge: true });
    }

    const handleRegisto = async (e) => {
        e.preventDefault(); //evita que recarregue a página ao submeter
        setErro('');

        //valida o email
        if (!checkEmail.test(email)) {
            setErro('Please enter a valid email address.');
            return;
        }

        try {
            //cria o utilizador com email e password
            const credenciaisUtilizador = await createUserWithEmailAndPassword(auth, email, password);
            const novoUtilizador = credenciaisUtilizador.user;

            //cria o documento do utilizador
            await criarUtilizador(novoUtilizador);
            redirecionar('/');

        } catch (err) {
            console.log("Erro", err);
            setErro(err.message);
        }
    };

    return (
        <div className="registo-container">
            <h2 className='registo-name'>Create an Account</h2>

            {err && <p className="erro">{err}</p>}

            <form onSubmit={handleRegisto} className="registo-form">
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

                <Button type="submit" className='botao-submit'> Register Account </Button>
            </form>

            <p className="registo-texto">
                Already have an account? <Link className="link-login" to="/login">Login</Link>
            </p>
        </div>
    );
};
