import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Form, DatePicker, Input, notification, Select } from 'antd';
import moment from 'moment';
import validate from "../../tools/validate";
import Modal from "../Modal";
import TimeInput from "../TimeInput";
import { API } from '@aws-amplify/api';
import Loading from "../Loading";
import { RESET_MODAL } from '../../redux/types';

const AppointmentModal = (props) => {

    let initialDate = new Date();
    initialDate.setHours(16,0,0,0);

    const [data, setData] = useState({
      date: initialDate,
      note: "",
      status: "ok",
      dateTime: initialDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
    });
    const [errors, setErrors] = useState({});
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState("?");

    useEffect(()=>{
      if (props.modal.date) {
        const date = new Date(props.modal.date);
        setData({
          ...data,
          date:date,
          dateTime:date.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
          note:props.modal.note,
          status:props.modal.status
        });
        setPatient(`${props.modal.patient?.name} ${props.modal.patient?.lastname}`);
      }
    },[props.modal]);

    const changeDateTime = (timestring) => {
      updateData('dateTime',timestring);
    }

    useEffect(()=>{
      if (Object.keys(errors).length === 0 &&
        data.date.getTime() !== (new Date(props.modal.date)).getTime()
        || data.note !== props.modal.note
        || data.status !== props.modal.status) {
          if(disabled) setDisabled(false);
      } else if(!disabled) setDisabled(true);
    },[data]);

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

    // useEffect(()=>{
    //   console.log(errors);
    // },[errors])

    const onOk = () => {
      setDisabled(true);
      const errs = validate(data, "appointment");
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setLoading(true);
      const body = {
        date:data.date,
        status:data.status,
        note:data.note
      }
      API.put('protectedAPI', `/appointments/${props.modal._id}`, {body})
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
        title={`Sesión con ${patient}`}
        visible={props.visible}
        onOk={onOk}
        onCancel={()=>{
          setDisabled(true);
          props.onCancel();
        }}
        okText="Aceptar cambios"
        width={"30rem"}
        disabled={disabled}
      >
        <Form layout="vertical" style={{marginTop:"-.6rem"}}>
          <div className="twoCols collapse">
            <Form.Item label="Estado">
              <Select value={data.status} name="status" onChange={id=>{updateData('status',id)}}>
                <Option value="ok">{data.date > new Date() ? "Programada" : "Realizada"}</Option>
                <Option value="nok">{"Ausencia"}</Option>
                <Option value="cancelled">{"Cancelada"}</Option>
              </Select>
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
            <Input.TextArea value={data.note} autoSize={{ minRows: 2, maxRows: 6 }} name="note" onChange={(e)=>{updateData('note',e.target.value)}} />
          </Form.Item>
        </Form>
      </Modal>
      </>
    )
}

export default connect((state)=>({user: state.user, modal: state.modal}))(AppointmentModal);