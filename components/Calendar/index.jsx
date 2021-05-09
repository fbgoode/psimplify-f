import { Calendar } from 'antd';
import styles from './styles.module.css';
import moment from 'moment';
// import 'moment/locale/es';
// moment.locale('es');
moment.updateLocale('en', {
    weekdaysMin : ["D", "L", "M", "X", "J", "V", "S"]
  });

const customCalendar = (props)=>{

    const headerRender = ({ value, onChange }) => {

        const monthString = value._d.toLocaleDateString('es-ES',{month:"long",year:"numeric"});
        const monthStringProper = monthString.charAt(0).toUpperCase() + monthString.slice(1);

        const changeMonth = (increment) => {
            const newSelected = value.clone().month(value._d.getMonth()+increment);
            onChange(newSelected);
        }

        return(
            <div className="card-header" style={{marginBottom:0}}>
                <div>{monthStringProper}</div>
                <div className={styles.icons}>
                    <img src="/img/left.svg" className={styles.icon} alt="Mes anterior" onClick={()=>{changeMonth(-1)}}/>
                    <img src="/img/right.svg" className={styles.icon} alt="Mes siguiente" onClick={()=>{changeMonth(1)}}/>
                </div>
            </div>
        )
    }

    const appendSessions = (value) => {
        let from = new Date(value._d);
        from.setHours(0,0,0,0);
        value._d.setHours(23,59,59,999);
        let append = [];
        let count = 0;
        for (let appointment of props.appointments) {
            const date = new Date(appointment.date);
            if (date > from && date < value._d) {
                count++;
                if (count>8) {
                    append.splice(-1,1);
                    append.push(<div className={styles.plus}>+</div>);
                    break;
                }
                let backgroundColor = appointment.paid?"#6AE8AC":appointment.status==="ok"?"#43AFDE":appointment.status==="cancelled"?"#D8D8D8":"#999";
                append.push(<div className={styles.dot} style={{backgroundColor}}></div>);
            }
        }
        return append;
    }

    return(
        <>
            <div className="card-content" style={{paddingLeft:0,paddingRight:0,paddingTop:".5em"}}>
                <Calendar dateCellRender={appendSessions} locale={{lang:{locale:"es"}}} fullscreen={false} onSelect={props.onSelectDate} onPanelChange={props.onPanelChange} headerRender={headerRender}/>
            </div>
        </>
    )

}

export default customCalendar;