import React, { useEffect, useState } from "react";
// import Header from "../../components/Header";
import validate from "../../tools/validate";
import CTAButton from "../../components/CTAButton";
import FormInput from "../../components/FormInput";
import { Form, message, notification } from 'antd';
import Loading from "../../components/Loading";
// import Message from "../../components/Message/Message";
import {connect} from 'react-redux';
import {QUEUE_MESSAGE} from '../../redux/types';
import { useRouter } from 'next/router';
import styles from './styles.module.css';
import { Auth } from '@aws-amplify/auth';

const Register = (props) => {

  const router = useRouter();
    
  if (props.user?.id) router.push('/appointments');

  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    lastname: "",
    passwordValidation: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateUser = (key, value) => {
    setUser({ ...user, [key]: value });
    if (Object.keys(errors).length > 0) setErrors(validate({ ...user, [key]: value }, "register"));
  };

  const submit = async () => {
    const errs = validate(user, "register");
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: {
          email: user.email,
          given_name: user.name,
          family_name: user.lastname
      }
    })
    .then(handleSuccess)
    .catch(handleFail);
  };
  
  const handleSuccess = () => {
    props.dispatch({type:QUEUE_MESSAGE, payload:{
      type:'success',
      message: 'Verifique su email',
      duration:0,
      description:
        'Le hemos enviado un correo con un enlace de verificación. Una vez verificado su email, vuelva a esta página e inicie sesión con su contraseña.',
    }});
    router.push("/");
  }

  const handleFail = (error) => {
    setLoading(false);
    if (error.message === 'An account with the given email already exists.')
    error.message = 'Ya existe una cuenta con el email proporcionado.';
    notification.error({
      message: 'Ha ocurrido un error',
      duration:6,
      description: error.message
    });
  }

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
  }, [user]);

  return (
    <>
      {/* <Header></Header> */}
      <Loading visible={loading}></Loading>
      <div className={styles.registerContainer}>
        <div className={styles.registerForm}>
            <h2>Regístrate gratis en Psimplify.</h2>
            <p>Crea tu cuenta ahora y empieza a disfrutar de la mejor herramienta para terapeutas.</p>

            <div className={styles.inputContainer}>
                <Form.Item validateStatus={errors.name?.status} help={errors.name?.help}>
                    <FormInput label="Nombre" name="name" onChange={updateUser} />
                </Form.Item>
            </div>
            <div className={styles.inputContainer}>
                <Form.Item validateStatus={errors.lastname?.status} help={errors.lastname?.help}>
                    <FormInput label="Apellidos" name="lastname" onChange={updateUser} />
                </Form.Item>
            </div>
            <div className={styles.inputContainer}>
                <Form.Item validateStatus={errors.email?.status} help={errors.email?.help}>
                    <FormInput label="Correo Electrónico" name="email" onChange={updateUser}/>
                </Form.Item>
            </div>
            <div className={styles.inputContainer}>
                <Form.Item validateStatus={errors.password?.status} help={errors.password?.help}>
                    <FormInput type="Password" label="Contraseña" name="password" onChange={updateUser} />
                </Form.Item>
            </div>
            <div className={styles.inputContainer}>
                <Form.Item validateStatus={errors.passwordValidation?.status} help={errors.passwordValidation?.help}>
                    <FormInput type="Password" label="Repita la Contraseña" name="passwordValidation" onChange={updateUser} />
                </Form.Item>
            </div>
            <div className={styles.buttonContainer}>
                <CTAButton text="Enviar" onClick={() => submit()}/>
            </div>
        </div>
      </div>
    </>
  );
};

export default connect((state)=>({credentials: state.credentials,queuedmessage:state.message}))(Register);
