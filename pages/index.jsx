import React, { useState, useEffect } from 'react';
import CTAButton from '../components/CTAButton';
import FormInput from '../components/FormInput';
// import Header from '../components/Header';
import Loading from '../components/Loading';
import validate from '../tools/validate';
import { Form } from 'antd';
// import Message from '../../components/Message/Message';
import {connect} from 'react-redux';
import {LOGIN,DELETE_MESSAGE} from '../redux/types';
import styles from './styles.module.css';
import { Auth } from '@aws-amplify/auth';
import { API } from '@aws-amplify/api';
// import config from '../config';
import { useRouter } from 'next/router';

const Login = (props) => {

    const router = useRouter();

    if (props.user?.id) router.push('/appointments');

    const [credentials, setCredentials] = useState({email:'',password:''});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    // const [message, setMessage] = useState([]);

    const updateCredentials = (key,value) => {
        setCredentials({...credentials, [key]: value});
        if (Object.keys(errors).length > 0) setErrors(validate({...credentials, [key]: value},'login'));
    }

    const handleSuccess = (response) => {
        console.log(response);
        API.get('protectedAPI', '/users/' + response.username)
        .then(console.log)
        .catch(console.log);
            // {headers:{Authorization:`Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`}});
        // props.dispatch({type:LOGIN,payload:res.data});
        // if (response.data.user.admin) history.push('/admin');
        // else history.push('/profile');
    }

    // useEffect(()=>{
    //     API.get('protectedAPI', '/users/' + userId)
    //     .then(console.log)
    //     .catch(console.log);
    // })

    const handleFail = (error) => {
        console.log(error);
        setLoading(false);
    }

    // const newMessage = (msg, style = 'error') => {
    //     const key = (~(Math.random()*99999));
    //     setMessage([...message,<Message key={key} text={msg} style={style}></Message>]);
    // }

    const submit = async () => {
        
        const errs = validate(credentials,'login');
        setErrors(errs);

        if (Object.keys(errs).length === 0) {
            setLoading(true);
            Auth.signIn(credentials.email,credentials.password)
            .then(handleSuccess)
            .catch(handleFail);
        }
    }

    useEffect(()=>{
    if (props.queuedmessage.text) {
        // newMessage(props.queuedmessage.text,props.queuedmessage.type);
        props.dispatch({type:DELETE_MESSAGE});
    }
    },[]);

    useEffect(() => {
        const listener = event => {
          if (event.code === "Enter" || event.code === "NumpadEnter") {
            submit();
          }
        };
        document.addEventListener("keydown", listener);
        return () => {
          document.removeEventListener("keydown", listener);
        };
    }, [credentials]);

    return (
        <>
        {/* <Header></Header> */}
        <Loading visible={loading}></Loading>
        <section className={styles.loginContainer}>
            {/* {message} */}
            <div className={styles.login}>
                <h2>¡Hola otra vez!</h2>
                <p>Introduce tu email y tu contraseña para acceder.</p>
                <div className={styles.inputContainer}>
                    <Form.Item validateStatus={errors.email?.status} help={errors.email?.help}>
                        <FormInput label="Correo Electrónico" name="email" onChange={updateCredentials} maxLength="50"></FormInput>
                    </Form.Item>
                </div>
                <div className={styles.inputContainer}>
                    <Form.Item validateStatus={errors.password?.status} help={errors.password?.help}>
                        <FormInput type="Password" label="Contraseña" name="password" onChange={updateCredentials} maxLength="99"></FormInput>
                    </Form.Item>
                </div>
                <div className={styles.buttonContainer}>
                    <CTAButton goto="login" text="Acceder" styling="CTA" onClick={()=>submit()}/>
                </div>
            </div>
            <div className={styles.separator}>
                
            </div>
            <div className={styles.register}>
                <h3>¿Aún no tienes cuenta?</h3>
                <p>Psimplify te aporta más organización y productividad como terapeuta para que puedas dedicar más tiempo a lo que importa, las personas.</p>
                <div className={styles.buttonContainer}>
                    <CTAButton goto="register" text="Regístrate" styling="alt"/>
                </div>
            </div>
        </section>
        <footer>
            
        </footer>
        </>
    )
}

export default connect((state)=>({user: state.user,queuedmessage:state.message}))(Login);