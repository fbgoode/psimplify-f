import { useEffect, useState } from "react";
import Header from "../../components/Header/simple";
import { Steps, Input, notification, Result } from 'antd';
import Loading from "../../components/Loading";
import DateTimePicker from "../../components/DateTimePicker";
import styles from './styles.module.css';
import CTAButton from "../../components/CTAButton";
import { API } from '@aws-amplify/api';
import { useRouter } from 'next/router';

const { TextArea } = Input;
const { Step } = Steps;

const PatientAppointment = (props) => {

  const router = useRouter();
  const { pid } = router.query;
    
  const [loading, setLoading] = useState(false);
  // const [errors, setErrors] = useState({});
  const [appointment, setAppointment] = useState({
    user: "",
    date: "",
    note: ""
  });
  const [slots, setSlots] = useState([]);
  const [current, setCurrent] = useState(0);
  const [proName, setProName] = useState("");

  useEffect(()=>{
    if(pid)
      fetchSlots();
  },[pid]);

  const fetchSlots = () => {
    setLoading(true);
    API.get('protectedAPI', `/patients/${pid}/slots`)
    .then(handleSlotResponse)
    .catch(handleFail);
  }

  const handleSlotResponse = (response) => {
    setLoading(false);
    setSlots(response.slots);
    setProName(`${response.user.name} ${response.user.lastname}`);
    updateAppointment('user',response.user._id)
    // setCurrent(0);
  };

  const setDate = (value) => {
    updateAppointment('date',value);
    setCurrent(1);
  }

  const updateAppointment = (key, value) => {
    setAppointment({ ...appointment, [key]: value });
    // if (Object.keys(errors).length > 0) setErrors(validate({ ...patient, [key]: value }, "patient"));
  }

  const newAppointment = () => {

    // const errs = validate(patient, "patient");
    // setErrors(errs);

    // if (Object.keys(errs).length > 0) return;

    setLoading(true);
    API.post('protectedAPI', `/patients/${pid}/appointments`, {body:appointment})
    .then(handleSuccess)
    .catch(handleFail);
    
  }

  const handleSuccess = (response) => {
    setLoading(false);
    // notification.success({
    //   message: "Cita creada",
    //   duration:6
    // });
    setCurrent(2);
  }

  const handleFail = (error) => {
    setLoading(false);
    notification.error({
      message: "Se ha producido un error",
      duration:6,
      description: error.message || error
    });
  }

  const date = new Date(appointment.date);
  let dateString = `${date.toLocaleDateString('es-es',{weekday:'long', day:'numeric', month:'long', year:'numeric'})} a las ${date.toLocaleTimeString('es-es',{hour:'numeric', minute:'numeric'})}h`;
  dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  const steps = [
    {
      title: "Horario",
      content: 
      <>
      <div className={styles.userDetails}>
        <div>Citas disponibles para <span style={{fontWeight:500}}>{proName}</span></div>
      </div>
      <DateTimePicker handler={setDate} dates={slots}/>
      </>
    },
    {
      title: "Confirmación",
      content:
      <div className={styles.confirm}>
        <div className={styles.appointmentDetails}>
          <div>
            <div className={styles.appointmentTitle}>Día y hora de tu cita</div>
            <div className={styles.appointmentDate}>{dateString}</div>
          </div>
          <div>
            <div className={styles.back} onClick={()=>{setCurrent(0)}}>Editar</div>
          </div>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.appointmentTitle}>Notas adicionales</div>
        <TextArea placeholder='Escribe aquí para añadir una nota' onChange={(e)=>{updateAppointment('note',e.target.value)}} rows={5}/>
        <div className={styles.buttonContainer}>
          <CTAButton onClick={newAppointment} text='Confirmar cita'/>
        </div>
      </div>
    },
    {
      title: "Cita guardada",
      content:
      <Result
        status="success"
        title="Cita guardada con éxito"
        subTitle={`Cita programada para el ${dateString} con ${proName}.`}
      />
    },
  ];

  return (
    <>
      <Header/>
      <div className="pageContainer">
        <div className="content" style={{justifyContent:"center"}}>
          <div className={styles.form}>
            <Steps current={current} className={styles.steps}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            <div className={styles.stepsContent}>
              <Loading visible={loading}></Loading>
              {steps[current].content}
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientAppointment;
