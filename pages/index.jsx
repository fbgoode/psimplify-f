import React, { useState, useEffect } from 'react';
import CTAButton from '../components/CTAButton';
import FormInput from '../components/FormInput';
// import Header from '../components/Header';
import Loading from '../components/Loading';
import validate from '../tools/validate';
import { Form, notification } from 'antd';
import {connect} from 'react-redux';
import {LOGIN,DELETE_MESSAGE} from '../redux/types';
import styles from './styles.module.css';
import { Auth } from '@aws-amplify/auth';
import { API } from '@aws-amplify/api';
import { useRouter } from 'next/router';

const Login = (props) => {

    const router = useRouter();

    // if (props.user?.userId) router.push('/appointments');

    const [credentials, setCredentials] = useState({email:'',password:''});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const updateCredentials = (key,value) => {
        setCredentials({...credentials, [key]: value});
        if (Object.keys(errors).length > 0) setErrors(validate({...credentials, [key]: value},'login'));
    }

    const handleSuccess = (response) => {
        console.log(response);
        API.get('protectedAPI', '/users/' + response.username)
        .then(handleLogin)
        .catch(handleFail);
    }

    const handleLogin = (response) => {
        props.dispatch({type:LOGIN,payload:response.user});
        // router.push('/appointments');
    }

    const handleFail = (error) => {
        setLoading(false);
        let description;
        if (error.message === 'Incorrect username or password.')
            error.message = 'Email o contraseña incorrectos.';
        else if (error.message === 'User is not confirmed.'){
            error.message = 'Email no confirmado.';
            description = <>Por favor verifique su email a través del enlace que le hemos enviado antes de iniciar sesión.
                <br/>¿No ha recibido el email? <span style={{color:'#687CE5',cursor:'pointer'}} onClick={(resendVerification)}>Reintentar</span></>;
        }
        notification.error({
          message: error.message || error,
          duration:6,
          description
        });
    }

    const resendVerification = async() => {
        try {
            await Auth.resendSignUp(credentials.email);
            notification.success({
                message: 'Email de verificación reenviado',
                duration:6,
            });
        } catch (err) {
            notification.error({
                message: err.message || err,
                duration:6,
            });
        }
    }

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
        if (props.queuedmessage.type) {
            notification[props.queuedmessage.type](props.queuedmessage);
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
                    <div className={styles.forgotPassword} onClick={()=>{router.push('/forgot-password')}}>¿Has olvidado tu contraseña?</div>
                </div>
            </div>
            <div className={styles.separator}>
                
            </div>
            <div className={styles.register}>
                <h3>¿Aún no tienes cuenta?</h3>
                <p>Psimplify te aporta más organización y productividad como terapeuta para que puedas dedicar más tiempo a lo que importa, las personas.</p>
                <div>
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