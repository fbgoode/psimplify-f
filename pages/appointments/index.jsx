import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { notification } from 'antd';
import Loading from "../../components/Loading";
import {connect} from 'react-redux';
import styles from './styles.module.css';
import Footer from "../../components/Footer";
import Calendar from "../../components/Calendar";
import { API } from '@aws-amplify/api';

const Register = (props) => {
    
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(()=>{
    onPanelChange({_d:new Date},"month");
  },[]);

  const onSelectDate = (value) => {
    setSelectedDate(value._d);
  }

  const onPanelChange = (value, mode) => {
    const firstDay = new Date(value._d.getFullYear(), value._d.getMonth(), 1);
    const fromDate = getMonday(firstDay);
    const toDate = sumDays(fromDate,42);
    API.get('protectedAPI', `/appointments?fromDate=${fromDate}&toDate=${toDate}`)
    .then(res=>{setAppointments(res.appointment)})
    .catch(handleFail);
  }

  const getMonday = (d) => {
    const dt = new Date(d);
    const day = dt.getDay(),
        diff = dt.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(dt.setDate(diff));
  }

  const sumDays = (d,sum) => {
    const dt = new Date(d);
    const date = dt.getDate();
    return new Date(dt.setDate(date+sum));
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
      <Header title="Calendario"></Header>
      <Loading visible={loading}></Loading>
      <div className="pageContainer">
        <div className="content content-3">
            <div className="card card-1" style={{minHeight:"39rem"}}>
              <div className="card-header">Jueves, 15 de abril de 2021</div>
              <div className="card-content">
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
              </div>
            </div>
            <div className="card card-1" style={{paddingBottom:".5rem"}}>
              <Calendar appointments={appointments} onPanelChange={onPanelChange} onSelectDate={onSelectDate}/>
            </div>
            <div className="card card-1" style={{minHeight:"39rem"}}>
              <div className="card-header">Abril de 2021</div>
              <div className="card-content">
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
              </div>
            </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default connect((state)=>({user: state.user}))(Register);
