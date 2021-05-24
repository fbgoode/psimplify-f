import {useState, useEffect} from "react";
import CTAButton from "../CTAButton";
import styles from './styles.module.css';

const lefticon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
  </svg>
);

const righticon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
  </svg>
);

const DateTimePicker = (props) => {

    const [page, setPage] = useState(0);
    const [nitems, setNitems] = useState(5);
    // console.log(props.dates)

    const loc = props.locale || 'es';
    const npages = (~~(props.dates.length / nitems));
    const dates = [];
    const times = [];
    for (let i=page*nitems; i<(page+1)*nitems ; i++) {
        if (!props.dates[i]) break;
        dates.push(
            <div key={`date${i}`} className={styles.date}>
                <div className={styles.datemonth}>
                    {new Date(props.dates[i][0]).toLocaleDateString(loc, {month: 'numeric', day: 'numeric'})}
                </div>
                <div className={styles.dateweek}>
                    {new Date(props.dates[i][0]).toLocaleDateString(loc, {weekday: 'long'})}
                </div>
            </div>
        );
        times.push(
            <div key={`times${i}`} className={styles.times}>
                {props.dates[i].map((time,j)=>{
                    if (j===0) return;
                    return(
                        <CTAButton key={`times${i}${j}`} text={new Date(time).toLocaleTimeString(loc, {hour:'numeric', minute:'numeric'})} styling='time' onClick={()=>{props.handler(time)}}></CTAButton>
                    );
                })}
            </div>
        )
    }

    const handleResize = () => {
        if (window.innerWidth < 400) {
            setNitems(2);
        } else if (window.innerWidth < 575) {
            setNitems(3);
        } else if (window.innerWidth < 767) {
            setNitems(5);
        } else {
            setNitems(7);
        } 
    }

    useEffect(()=>{
        setPage(0);
    },[nitems])

    useEffect(()=>{
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize)
        };
    },[])

  return (
    <div id="dateTimePicker" className={styles.dateTimePicker}>
        <div className={styles.dateContainer}>
            <div className={page>0?styles.icon:`${styles.icon} ${styles.disabled}`} onClick={()=>setPage(page-1>=0?page-1:page)}>{lefticon}</div>
            {dates}
            <div className={page+1<npages?styles.icon:`${styles.icon} ${styles.disabled}`} onClick={()=>setPage(page+1<npages?page+1:page)}>{righticon}</div>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.timeContainer}>
            <div className={styles.icon}></div>
            {times}
            <div className={styles.icon}></div>
        </div>
    </div>
  );
};

export default DateTimePicker;
