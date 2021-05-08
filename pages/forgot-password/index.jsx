import React, { useEffect, useState } from "react";
import Header from '../../components/Header/simple';
import validate from "../../tools/validate";
import CTAButton from "../../components/CTAButton";
import FormInput from "../../components/FormInput";
import { Form, notification } from 'antd';
import Loading from "../../components/Loading";
import {connect} from 'react-redux';
import {LOGIN, QUEUE_MESSAGE} from '../../redux/types';
import { useRouter } from 'next/router';
import styles from './styles.module.css';
import { Auth } from '@aws-amplify/auth';

const forgotPassword = (props) => {

  const router = useRouter();

  const [user, setUser] = useState({
    email: ""
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
    Auth.forgotPassword(user.email)
    .then(handleSuccess)
    .catch(handleFail);
  };
  
  const handleSuccess = () => {
    props.dispatch({type:LOGIN, payload:user});
    props.dispatch({type:QUEUE_MESSAGE, payload:{
      type:'success',
      message: 'Código enviado',
      duration:6,
    }});
    router.push("/forgot-password/new-password");
  }

  const handleFail = (error) => {
    setLoading(false);
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
      <Header></Header>
      <Loading visible={loading}></Loading>
      <div className={styles.registerContainer}>
        <div className={styles.registerForm}>
            <h2>Introduce tu email.</h2>
            <p>Te enviaremos un código para que puedas restablecer la contraseña.</p>
            <div className={styles.inputContainer}>
                <Form.Item validateStatus={errors.email?.status} help={errors.email?.help}>
                    <FormInput label="Correo Electrónico" name="email" onChange={updateUser}/>
                </Form.Item>
            </div>
            <div className={styles.buttonContainer}>
                <CTAButton text="Enviar código" onClick={() => submit()}/>
            </div>
        </div>
      </div>
    </>
  );
};

export default connect()(forgotPassword);
