import { useEffect, useState } from "react";
import {connect} from "react-redux";
import {Form, DatePicker, Input, notification} from 'antd';
import moment from 'moment';
import validate from "../../tools/validate";
import Modal from "../Modal";
import TimeInput from "../TimeInput";
import { API } from '@aws-amplify/api';
import Loading from "../Loading";
import {LOGIN, RESET_MODAL} from '../../redux/types';

const ExclusionModal = (props) => {

    
    let initialFrom = new Date();
    initialFrom.setHours(0,0,0,0);
    let initialTo = new Date();
    initialTo.setHours(23,59,0,0);

    const [data, setData] = useState({
      from: initialFrom,
      to: initialTo,
      title: "",
      fromTime: initialFrom.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
      toTime: initialTo.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
      if (props.modal.from && props.modal.to) {
        setData({
          ...data,
          from:new Date(props.modal.from),
          to:new Date(props.modal.to),
          fromTime:props.modal.from.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
          toTime: props.modal.to.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
        });
      }
    },[props.modal]);

    const changeFromTime = (timestring) => {
      updateData('fromTime',timestring);
    }

    useEffect(()=>{
      const err = validate({fromTime:data.fromTime},"exclusion");
      if (!err.fromTime) {
        const timearr = data.fromTime.split(':');
        const HH = parseInt(timearr[0]);
        const mm = parseInt(timearr[1]);
        const date = new Date(data.from);
        date.setHours(HH,mm,0,0);
        updateData('from',date);
      }
    },[data.fromTime]);

    const changeToTime = (timestring) => {
      updateData('toTime',timestring);
    }

    useEffect(()=>{
      const err = validate({toTime:data.toTime},"exclusion");
      if (!err.toTime) {
        const timearr = data.toTime.split(':');
        const HH = parseInt(timearr[0]);
        const mm = parseInt(timearr[1]);
        const date = new Date(data.to);
        date.setHours(HH,mm,0,0);
        updateData('to',date);
      }
    },[data.toTime]);

    const changeFromDate = (mmt) => {
      updateData('from',mmt._d);
    }

    const changeToDate = (mmt) => {
      updateData('to',mmt._d);
    }

    const updateTitle = (e) => {
      updateData(e.target.name,e.target.value);
    }

    const updateData = (key, value) => {
      setData({ ...data, [key]: value });
      if (Object.keys(errors).length > 0) setErrors(validate({ ...data, [key]: value }, "exclusion"));
    }

    const onOk = () => {
      const errs = validate(data, "exclusion");
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setLoading(true);
      const newExclusion = {
        from:data.from,
        to:data.to,
        title:data.title
      }
      const newExclusions = [...props.user.config.appointments.exclude,newExclusion];
      const body = {
        ...props.user.config,
        appointments: {
          ...props.user.config.appointments,
          exclude: newExclusions
        }
      }
      API.put('protectedAPI', `/users/${props.user._id}/config/`, {body})
      .then(handleSuccess)
      .catch(handleFail);
    }

    const handleSuccess = (response) => {
      props.dispatch({type:LOGIN,payload:response.user});
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
        title="Marcar horario no disponible"
        visible={props.visible}
        onOk={onOk}
        onCancel={props.onCancel}
        width={"26rem"}
      >
        <Form layout="vertical" style={{marginTop:"-.6rem"}}>
          <div className="twoCols">
            <Form.Item label="Fecha de inicio" validateStatus={errors.from?.status} help={errors.from?.help}>
              <DatePicker allowClear={false} locale={{lang:{locale:"es",yearFormat: "YYYY"}}} name="fromDate" value={moment(data.from)} onChange={changeFromDate}/>
            </Form.Item>
            <Form.Item label="Fecha final" validateStatus={errors.to?.status} help={errors.to?.help}>
              <DatePicker allowClear={false} locale={{lang:{locale:"es",yearFormat: "YYYY"}}} name="toDate" value={moment(data.to)} onChange={changeToDate}/>
            </Form.Item>
          </div>
          <div className="twoCols">
            <Form.Item label="Hora de inicio" validateStatus={errors.fromTime?.status} help={errors.fromTime?.help}>
              <TimeInput name="fromTime" value={data.fromTime} onChange={changeFromTime}/>
            </Form.Item>
            <Form.Item label="Hora final" validateStatus={errors.toTime?.status} help={errors.toTime?.help}>
              <TimeInput name="toTime" value={data.toTime} onChange={changeToTime}/>
            </Form.Item>
          </div>
          <Form.Item label="Motivo (opcional)">
            <Input name="title" onChange={updateTitle} />
          </Form.Item>
        </Form>
      </Modal>
      </>
    )
}

export default connect((state)=>({user: state.user, modal: state.modal}))(ExclusionModal);