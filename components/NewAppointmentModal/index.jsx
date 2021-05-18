import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, DatePicker, Input, notification } from 'antd';
import moment from 'moment';
import validate from "../../tools/validate";
import Modal from "../Modal";
import TimeInput from "../TimeInput";
import PatientInput from "../PatientInput";
import { API } from '@aws-amplify/api';
import Loading from "../Loading";
import { RESET_MODAL } from '../../redux/types';

const AppointmentModal = (props) => {

    let initialDate = new Date();
    initialDate.setHours(16,0,0,0);

    const [data, setData] = useState({
      date: initialDate,
      note: "",
      patient: "",
      dateTime: initialDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
    });
    const [errors, setErrors] = useState({});
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      if (props.modal.date) {
        setData({
          ...data,
          date:new Date(props.modal.date),
          dateTime:props.modal.date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
        });
      }
    },[props.modal]);
    
    useEffect(()=>{
      API.get('protectedAPI', `/patients`)
      .then(res=>{setPatients(res.patients)})
      .catch(handleFail);
    },[])

    const changeDateTime = (timestring) => {
      updateData('dateTime',timestring);
    }

    useEffect(()=>{
      const err = validate({dateTime:data.dateTime},"appointment");
      if (!err.dateTime) {
        const timearr = data.dateTime.split(':');
        const HH = parseInt(timearr[0]);
        const mm = parseInt(timearr[1]);
        const date = new Date(data.date);
        date.setHours(HH,mm,0,0);
        updateData('date',date);
      }
    },[data.dateTime]);

    const changeDate = (mmt) => {
      updateData('date',mmt._d);
    }

    const updateData = (key, value) => {
      setData({ ...data, [key]: value });
      if (Object.keys(errors).length > 0) setErrors(validate({ ...data, [key]: value }, "appointment"));
    }

    const onOk = () => {
      const errs = validate(data, "appointment");
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setLoading(true);
      const body = {
        date:data.date,
        patient:data.patient,
        note:data.note
      }
      API.post('protectedAPI', `/appointments`, {body})
      .then(handleSuccess)
      .catch(handleFail);
    }

    const handleSuccess = () => {
      props.dispatch({type:RESET_MODAL});
      setLoading(false);
      props.onOk();
    }

    const handleFail = (error) => {
      setLoading(false);
      notification.error({
        message: error.message || error,
        duration:6
      });
    }
    
    return(
      <>
      <Loading visible={loading}/>
      <Modal
        title="Nueva sesión"
        visible={props.visible}
        onOk={onOk}
        onCancel={props.onCancel}
        width={"30rem"}
      >
        <Form layout="vertical" style={{marginTop:"-.6rem"}}>
          <div className="twoCols collapse">
            <Form.Item label="ID de paciente" validateStatus={errors.patient?.status} help={errors.patient?.help}>
              <PatientInput options={patients} name="patient" onChange={id=>{updateData('patient',id)}}/>
            </Form.Item>
            <Form.Item label="Tipo de sesión">
              <Input name="title" value="Sesión normal" disabled/>
            </Form.Item>
          </div>
          <div className="twoCols">
            <Form.Item label="Fecha" validateStatus={errors.date?.status} help={errors.date?.help}>
              <DatePicker allowClear={false} locale={{lang:{locale:"es",yearFormat: "YYYY"}}} name="date" value={moment(data.date)} onChange={changeDate}/>
            </Form.Item>
            <Form.Item label="Hora" validateStatus={errors.dateTime?.status} help={errors.dateTime?.help}>
              <TimeInput name="dateTime" value={data.dateTime} onChange={changeDateTime}/>
            </Form.Item>
          </div>
          <Form.Item label="Nota (opcional)">
            <Input name="note" onChange={(e)=>{updateData('note',e.target.value)}} />
          </Form.Item>
        </Form>
      </Modal>
      </>
    )
}

export default connect((state)=>({user: state.user, modal: state.modal}))(AppointmentModal);