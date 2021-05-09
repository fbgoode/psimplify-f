import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { notification } from 'antd';
import Loading from "../../components/Loading";
import {connect} from 'react-redux';
import styles from './styles.module.css';
import Footer from "../../components/Footer";
import Calendar from "../../components/Calendar";
import DayCard from "../../components/DayCard";
import { API } from '@aws-amplify/api';
import InfiniteScroll from 'react-infinite-scroll-component';

const Register = (props) => {

  const user = props.user;
    
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayCards, setDayCards] = useState([]);
  const [lastCards, setLastCards] = useState({cards:[],lastDate:new Date(),last:false});

  const dateString = selectedDate.toLocaleDateString('es-ES',{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const dateStringProper = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  useEffect(()=>{
    onPanelChange({_d:new Date},"month");
    fetchLastCards();
  },[]);

  const fetchLastCards = () => {
    API.get('protectedAPI', `/appointments/last?untilDate=${lastCards.lastDate}`)
    .then(res=>{setLastCards({cards:[...lastCards.cards,...res.appointments],last:res.last,lastDate:res.appointments[res.appointments.length-1]?.date})})
    .catch(handleFail);
  }

  useEffect(()=>{
    // Logic to structure day's card data depending on set availability, appointments and exclusions
    let daysAppointments = getDaysAppointments(selectedDate);
    let daysExclusions = getDaysExclusions(selectedDate);
    let daysEvents = [...daysAppointments,...daysExclusions];
    let morningsAvailability = [];
    let afternoonsAvailability = [];
    if (new Date().setHours(0) < new Date(selectedDate).setHours(0)) {
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
  },[selectedDate,appointments]);

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
    availability.push({from:new Date(from),to: new Date(to),type:"availability"});
    return availability;
  }

  const getUserSchedule = (date) => {
    const weekday = date.toLocaleDateString('en-EN',{weekday:"long"}).toLowerCase();
    let schedule = [];
    if (user.config.appointments?.specialDays[weekday]?.override)
      schedule = user.config.appointments.specialDays[weekday].schedule;
    else schedule = user.config.appointments.schedule;
    return schedule;
  }

  const getDaysExclusions = (date) => {
    let from = new Date(date).setHours(0,0,0,0);
    let to = new Date(date).setHours(23,59,59,0);
    let daysExclusions = [];
    for (let exclusion of user.config.appointments?.exclude) {;
      if (exclusion.from > from && exclusion.to < to)
        daysExclusions.push({...exclusion,type:"exclusion"});
      else if (exclusion.from < from && exclusion.to > to)
        daysExclusions.push({title:exclusion.title,from,to,type:"exclusion"});
      else if (exclusion.from < from && exclusion.to > from)
        daysExclusions.push({title:exclusion.title,from,to:exclusion.to,type:"exclusion"});
      else if (exclusion.from < to && exclusion.to > to)
        daysExclusions.push({title:exclusion.title,from:exclusion.from,to,type:"exclusion"});
    }
    return daysExclusions;
  }

  const getDaysAppointments = (date) => {
    let from = new Date(date).setHours(0,0,0,0);
    let to = new Date(date).setHours(23,59,59,999);
    let daysAppointments = [];
    for (let appointment of appointments) {
      const date = new Date(appointment.date);
      if (date > from && date < to) {
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
      <div className="pageContainer">
        <div className="content content-3">
            <div className="card card-1" style={{minHeight:"39rem"}}>
              <div className="card-header">{dateStringProper}</div>
              <div className="card-content">
                {dayCards.map(card=><DayCard event={card} type={card.type} key={Math.random()*999999} context="day"/>)}
              </div>
            </div>
            <div className="card card-1" style={{paddingBottom:".5rem"}}>
              <Calendar appointments={appointments} onPanelChange={onPanelChange} onSelectDate={onSelectDate}/>
            </div>
            <div className="card card-1" style={{minHeight:"39rem"}}>
              <div className="card-header">Últimas sesiones</div>
              <div id="lastCardsDiv" className="card-content">
              <InfiniteScroll
                scrollableTarget="lastCardsDiv"
                dataLength={lastCards.cards.length}
                next={fetchLastCards}
                hasMore={!lastCards.last}
                loader={<div className={styles.loadingContainer}><Loading visible={true}/></div>}>
                  {lastCards.cards.map(card=><DayCard event={card} type="appointment" key={Math.random()*999999} context="last"/>)}
                </InfiniteScroll>
              </div>
            </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default connect((state)=>({user: state.user}))(Register);
