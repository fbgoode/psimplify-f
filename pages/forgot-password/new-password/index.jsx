import React, { useEffect, useState } from "react";
import Header from '../../../components/Header/simple';
import validate from "../../../tools/validate";
import CTAButton from "../../../components/CTAButton";
import FormInput from "../../../components/FormInput";
import { Form, notification } from 'antd';
import Loading from "../../../components/Loading";
import {connect} from 'react-redux';
import {QUEUE_MESSAGE, DELETE_MESSAGE} from '../../../redux/types';
import { useRouter } from 'next/router';
import styles from '../styles.module.css';
import { Auth } from '@aws-amplify/auth';

const newPassword = (props) => {

  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    code: "",
    password: "",
    passwordValidation: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateUser = (key, value) => {
    setUser({ ...user, [key]: value });
    if (Object.keys(errors).length > 0) setErrors(validate({ ...user, [key]: value }, "register"));
  };

  const submit = async () => {
    console.log('aqui');
    const errs = validate(user, "register");
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    Auth.forgotPasswordSubmit(user.email, user.code, user.password)
    .then(handleSuccess)
    .catch(handleFail);
  };
  
  const handleSuccess = (response) => {
    props.dispatch({type:QUEUE_MESSAGE, payload:{
      type:'success',
      message: 'Contraseña restablecida',
      duration:6,
      description: 'Ya puede iniciar sesión con sus credenciales'
    }});
    router.push("/");
  }

  const handleFail = (error) => {
    setLoading(false);
    if (error.message === 'Invalid verification code provided, please try again.')
        error.message = 'Código de verificación inválido.';
    notification.error({
      message: 'Ha ocurrido un error',
      duration:6,
      description: error.message
    });
  }

  useEffect(()=>{
    if (props.user.email) setUser({ ...user, email:props.user.email });
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
  }, [user]);

  return (
    <>
      <Header></Header>
      <Loading visible={loading}></Loading>
      <div className={styles.registerContainer}>
        <div className={styles.registerForm}>
            <h2>Cambia tu contraseña.</h2>
            <div className={styles.inputContainer}>
                <Form.Item validateStatus={errors.code?.status} help={errors.code?.help}>
                    <FormInput label="Código de verificación" name="code" onChange={updateUser}/>
                </Form.Item>
            </div>
            <div className={styles.inputContainer}>
                <Form.Item validateStatus={errors.password?.status} help={errors.password?.help}>
                    <FormInput type="Password" label="Nueva contraseña" name="password" onChange={updateUser} />
                </Form.Item>
            </div>
            <div className={styles.inputContainer}>
                <Form.Item validateStatus={errors.passwordValidation?.status} help={errors.passwordValidation?.help}>
                    <FormInput type="Password" label="Repita la Contraseña" name="passwordValidation" onChange={updateUser} />
                </Form.Item>
            </div>
            <div className={styles.buttonContainer}>
                <CTAButton text="Restablecer contraseña" onClick={() => submit()}/>
            </div>
        </div>
      </div>
    </>
  );
};

export default connect((state)=>({user: state.user,queuedmessage:state.message}))(newPassword);
