import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { notification, Tooltip } from 'antd';
import Loading from "../../components/Loading";
import {connect} from 'react-redux';
import styles from './styles.module.css';
import Footer from "../../components/Footer";
import Calendar from "../../components/Calendar";
import DayCard from "../../components/DayCard";
import { API } from '@aws-amplify/api';
import InfiniteScroll from 'react-infinite-scroll-component';
import NewExclusionModal from "../../components/NewExclusionModal";
import NewAppointmentModal from "../../components/NewAppointmentModal";
import {SET_MODAL} from '../../redux/types';
import AppointmentModal from "../../components/AppointmentModal";

const Appointments = (props) => {
    
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayCards, setDayCards] = useState([]);
  const [lastCards, setLastCards] = useState({cards:[],lastDate:new Date(),last:false});
  const [modals, setModals] = useState({exclusion:{visible:false,new:false},newappointment:{visible:false,new:false},appointment:{visible:false,edited:false}});

  const dateString = selectedDate.toLocaleDateString('es-ES',{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const dateStringProper = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  const onExclusionOk = () => {
    notification.success({
      message: "Horario marcado con éxito",
      duration:6
    });
    setModals({...modals,exclusion:{visible:false,new:true}});
  }

  const onNewAppointmentOk = () => {
    notification.success({
      message: "Sesión creada con éxito",
      duration:6
    });
    setModals({...modals,newappointment:{visible:false,new:true}});
  }

  const onAppointmentOk = () => {
    notification.success({
      message: "Cambios realizados",
      duration:6
    });
    setModals({...modals,appointment:{visible:false,edited:true}});
  }

  const openNewAppointmentModal = () => {
    let initialDate = new Date(selectedDate);
    initialDate.setHours(16,0,0,0);
    props.dispatch({type:SET_MODAL,payload:{date:initialDate}});
    setModals({...modals,newappointment:{visible:true,new:false}});
  }

  const openDayExclusionModal = () => {
    let fromDate = new Date(selectedDate);
    fromDate.setHours(0,0,0,0);
    let toDate = new Date(selectedDate);
    toDate.setHours(23,59,0,0);
    props.dispatch({type:SET_MODAL,payload:{from:fromDate,to:toDate,title:''}});
    setModals({...modals,exclusion:{visible:true,new:false}});
  }

  useEffect(()=>{
    if (modals.exclusion.new)
      getDaysSchedule();
  },[modals.exclusion.new]);

  useEffect(()=>{
    if (modals.newappointment.new)
      onPanelChange({_d:selectedDate},"month");
  },[modals.newappointment.new]);

  useEffect(()=>{
    if (modals.appointment.edited)
      setLastCards({cards:[],lastDate:new Date(),last:false});
  },[modals.appointment.edited]);

  const onExclusionCancel = () => {
    setModals({...modals,exclusion:{visible:false,new:false}});
  }

  const onNewAppointmentCancel = () => {
    setModals({...modals,newappointment:{visible:false,new:false}});
  }

  const onAppointmentCancel = () => {
    setModals({...modals,appointment:{visible:false,edited:false}});
  }

  useEffect(()=>{
    onPanelChange({_d:new Date},"month");
    fetchLastCards();
  },[]);

  useEffect(()=>{
    if (lastCards.cards.length>0 || lastCards.last || !(lastCards.lastDate)) return;
    onPanelChange({_d:new Date},"month");
    fetchLastCards();
  },[lastCards]);

  const fetchLastCards = () => {
    API.get('protectedAPI', `/appointments/last?untilDate=${lastCards.lastDate}`)
    .then(res=>{setLastCards({cards:[...lastCards.cards,...res.appointments],last:res.last || true,lastDate:res.appointments[res.appointments.length-1]?.date})})
    .catch(handleFail);
  }

  useEffect(()=>{
    getDaysSchedule();
  },[selectedDate,appointments]);

  const getDaysSchedule = () => {
    // Logic to structure day's card data depending on set availability, appointments and exclusions
    let daysAppointments = getDaysAppointments(selectedDate);
    let daysExclusions = getDaysExclusions(selectedDate);
    let daysEvents = [...daysAppointments,...daysExclusions];
    let morningsAvailability = [];
    let afternoonsAvailability = [];
    if (new Date().setHours(0) < new Date(selectedDate)) {
      daysEvents.sort((a,b)=>{
        if (a.from<b.from) return -1;
        if (a.from>b.from) return 1;
        return 0;
      });
      let schedule = getUserSchedule(selectedDate);
      if (schedule?.morning?.active) morningsAvailability = getAvailability(selectedDate,schedule.morning,daysEvents);
      if (schedule?.afternoon?.active) afternoonsAvailability = getAvailability(selectedDate,schedule.afternoon,daysEvents);
    }
    let cards = [...daysEvents,...morningsAvailability,...afternoonsAvailability];
    cards.sort((a,b)=>{
      if (a.from<b.from) return -1;
      if (a.from>b.from) return 1;
      return 0;
    });
    setDayCards(cards);
  }

  const getAvailability = (date,schedule,events) => {
    let from = new Date(date).setHours(schedule.from.hour,schedule.from.minute,0,0);
    let to = new Date(date).setHours(schedule.to.hour,schedule.to.minute,0,0);
    let availability = [];
    for (let event of events) {
      if (event.status == "cancelled") continue;
      if (event.from > to) break;
      if (event.from > from) {
        availability.push({from:new Date(from),to: new Date(event.from),type:"availability"});
        if (event.to > to) return availability;
        from = event.to;
      } else if (event.to > from) {
        if (event.to > to) return availability;
        from = event.to;
      }
    }
    if(to>from) availability.push({from:new Date(from),to: new Date(to),type:"availability"});
    return availability;
  }

  const getUserSchedule = (date) => {
    const weekday = date.toLocaleDateString('en-EN',{weekday:"long"}).toLowerCase();
    let schedule = [];
    if (props.user.config.appointments?.specialDays[weekday]?.override)
      schedule = props.user.config.appointments.specialDays[weekday].schedule;
    else schedule = props.user.config.appointments.schedule;
    return schedule;
  }

  const getDaysExclusions = (date) => {
    let from = new Date(date);
    from.setHours(0,0,0,0);
    let to = new Date(date);
    to.setHours(23,59,59,0);
    let daysExclusions = [];
    for (let exclusion of props.user.config.appointments?.exclude) {
      const excFrom = new Date(exclusion.from);
      const excTo = new Date(exclusion.to);
      if (excFrom >= from && excTo <= to)
        daysExclusions.push({title:exclusion.title,from:excFrom,to:excTo,type:"exclusion"});
      else if (excFrom <= from && excTo >= to)
        daysExclusions.push({title:exclusion.title,from,to,type:"exclusion"});
      else if (excFrom <= from && excTo >= from)
        daysExclusions.push({title:exclusion.title,from,to:excTo,type:"exclusion"});
      else if (excFrom <= to && excTo >= to)
        daysExclusions.push({title:exclusion.title,from:excFrom,to,type:"exclusion"});
    }
    return daysExclusions;
  }

  const getDaysAppointments = (date) => {
    let from = new Date(date).setHours(0,0,0,0);
    let to = new Date(date).setHours(23,59,59,999);
    let daysAppointments = [];
    for (let appointment of appointments) {
      const date = new Date(appointment.date);
      if (date >= from && date <= to) {
        const to = new Date(appointment.date);
        to.setHours(date.getHours(),date.getMinutes()+appointment.duration+appointment.extra);
        daysAppointments.push({...appointment,from:date,to,type:"appointment"});
      }
    }
    return daysAppointments;
  }

  const onSelectDate = (value) => {
    setSelectedDate(value._d);
  }

  const onPanelChange = (value, mode) => {
    const firstDay = new Date(value._d.getFullYear(), value._d.getMonth(), 1);
    const fromDate = getMonday(firstDay);
    const toDate = sumDays(fromDate,42);
    API.get('protectedAPI', `/appointments?fromDate=${fromDate}&toDate=${toDate}`)
    .then(res=>{setAppointments(res.appointments)})
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
      <NewExclusionModal onOk={onExclusionOk} onCancel={onExclusionCancel} visible={modals.exclusion.visible}/>
      <NewAppointmentModal onOk={onNewAppointmentOk} onCancel={onNewAppointmentCancel} visible={modals.newappointment.visible}/>
      <AppointmentModal onOk={onAppointmentOk} onCancel={onAppointmentCancel} visible={modals.appointment.visible}/>
      <div className="pageContainer">
        <div className="content content-3 reverse">
            <div className="card card-1" style={{minHeight:"39rem"}}>
              <div className="card-header">
                <div>{dateStringProper}</div>
                <div className={styles.cardActions}>
                  <Tooltip placement="bottom" title="Nueva sesión" mouseEnterDelay="0.5">
                    <img style={{marginRight:".7rem"}} className="icon" src="/img/cal-add.svg" alt="Nueva sesión" onClick={openNewAppointmentModal}/>
                  </Tooltip>
                  <Tooltip placement="bottom" title="Marcar no disponible" mouseEnterDelay="0.5">
                    <img className="icon" src="/img/cal-x.svg" alt="Marcar no disponible" onClick={openDayExclusionModal}/>
                  </Tooltip>
                </div>
              </div>
              <div className="card-content">
                {dayCards.map(card=><DayCard event={card} type={card.type} key={Math.random()*999999} context="day"
                  onNewExclusion={card.type==="availability"?(()=>{setModals({...modals,exclusion:{visible:true,new:false}})}):(()=>{})}
                  onClick={card.type==="appointment"?(()=>{setModals({...modals,appointment:{visible:true,edited:false}})}):(()=>{})}
                  />)}
              </div>
            </div>
            <div className="card card-1" style={{paddingBottom:".5rem"}}>
              <Calendar appointments={appointments} onPanelChange={onPanelChange} onSelectDate={onSelectDate}/>
            </div>
            <div className="card card-1 dissapear" style={{minHeight:"39rem"}}>
              <div className="card-header">Últimas sesiones</div>
              <div id="lastCardsDiv" className="card-content">
              <InfiniteScroll
                scrollableTarget="lastCardsDiv"
                dataLength={lastCards.cards.length}
                next={fetchLastCards}
                hasMore={!lastCards.last}
                loader={<div className={styles.loadingContainer}><Loading visible={true}/></div>}>
                  {lastCards.cards.map(card=>
                  <DayCard event={card} type="appointment" key={Math.random()*999999} context="last"
                  onClick={()=>{setModals({...modals,appointment:{visible:true,edited:false}})}}
                  />)}
                </InfiniteScroll>
              </div>
            </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default connect((state)=>({user: state.user}))(Appointments);
