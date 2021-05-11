import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Form, notification } from 'antd';
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import {connect} from 'react-redux';
import styles from './styles.module.css';
import Footer from "../../components/Footer";
import CTAButton from "../../components/CTAButton";
import validate from "../../tools/validate";
import { API } from '@aws-amplify/api';

const Register = (props) => {

  const emptyPatient = {
    email: "",
    name: "",
    lastname: "",
    phone: "",
    address: "",
    nationalid: "",
    company: ""
  };
    
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [patient, setPatient] = useState(emptyPatient);

  const updatePatient = (key, value) => {
    setPatient({ ...patient, [key]: value });
    if (Object.keys(errors).length > 0) setErrors(validate({ ...patient, [key]: value }, "patient"));
  };

  const newPatient = () => {

    const errs = validate(patient, "patient");
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    API.post('protectedAPI', '/patients/', {body:patient})
    .then(handleSuccess)
    .catch(handleFail);
    
  }

  const handleSuccess = (response) => {
    setLoading(false);
    notification.success({
      message: "Paciente guardado",
      duration:6
    });
    setPatient(emptyPatient);
  }

  const handleFail = (error) => {
    setLoading(false);
    notification.error({
      message: "Se ha producido un error",
      duration:6,
      description: error.message || error
    });
  }

  return (
    <>
      <Header title="Pacientes"></Header>
      <Loading visible={loading}></Loading>
      <div className="pageContainer">
        {/* Quitar style del div inferior */}
        <div className="content content-3" style={{justifyContent:"center"}}>
            <div className="card card-1">
              <div className="card-header">Nuevo paciente</div>
              <div className="card-content">
                <div className={styles.inputContainer}>
                  <Form.Item validateStatus={errors.name?.status} help={errors.name?.help}>
                      <FormInput label="Nombre*" name="name" onChange={updatePatient} value={patient.name} />
                  </Form.Item>
                </div>
                <div className={styles.inputContainer}>
                    <Form.Item validateStatus={errors.lastname?.status} help={errors.lastname?.help}>
                        <FormInput label="Apellidos*" name="lastname" onChange={updatePatient} value={patient.lastname} />
                    </Form.Item>
                </div>
                <div className={styles.inputContainer}>
                    <Form.Item validateStatus={errors.email?.status} help={errors.email?.help}>
                        <FormInput label="Correo Electrónico" name="email" onChange={updatePatient} value={patient.email} />
                    </Form.Item>
                </div>
                <div className={styles.inputContainer}>
                    <Form.Item validateStatus={errors.email?.status} help={errors.email?.help}>
                        <FormInput label="Número de teléfono" name="phone" onChange={updatePatient} value={patient.phone} />
                    </Form.Item>
                </div>
                <div className={styles.inputContainer}>
                    <Form.Item validateStatus={errors.email?.status} help={errors.email?.help}>
                        <FormInput label="Dirección" name="address" onChange={updatePatient} value={patient.address} />
                    </Form.Item>
                </div>
                <div className={styles.inputContainer}>
                    <Form.Item validateStatus={errors.email?.status} help={errors.email?.help}>
                        <FormInput label="NIF/CIF/NIE" name="nationalid" onChange={updatePatient} value={patient.nationalid} />
                    </Form.Item>
                </div>
                <div className={styles.inputContainer}>
                    <Form.Item validateStatus={errors.email?.status} help={errors.email?.help}>
                        <FormInput label="Empresa" name="company" onChange={updatePatient} value={patient.company} />
                    </Form.Item>
                </div>
                <div className={styles.buttonContainer}>
                    <CTAButton text="Guardar" onClick={() => newPatient()}/>
                </div>
              </div>
            </div>
            {/* <div className="card card-2" style={{minHeight:"39rem"}}>
              <div className="card-header">Pacientes</div>
              <div className="card-content">
                <div>Sample</div>
                <div>Sample</div>
              </div>
            </div> */}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default connect((state)=>({user: state.user}))(Register);
