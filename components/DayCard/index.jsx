import styles from './styles.module.css';

const DateCard = (props) => {

    let onClick;
    let content;
    let left;
    let right;
    let styling = styles.card + " ";
    switch (props.type) {
        case "appointment":
            if (props.event.status==="cancelled") styling += styles.cancelled;
            else if (props.event.paid) styling += styles.paid;
            else if (props.event.status==="nok") styling += styles.nok;
            else styling += styles.ok;
            if (props.context==="day") left = new Date(props.event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            else left = new Date(props.event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' });
            content = props.event.patient.name + " " + props.event.patient.lastname;
            break;
        case "availability":
            styling += styles.availability;
            left = <><div>{props.event.from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div>{props.event.to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></>;
            content = "Disponible";
            break;
        case "exclusion":
            styling += styles.exclusion;
            left = <><div>{props.event.from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div>{props.event.to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div></>;
            content = props.event.title || "No disponible";
            break;
    }
    
    return(
        <div onClick={onClick} className={styling}>
            <div className={styles.left}>{left}</div>
            <div className={styles.content}>{content}</div>
            <div className={styles.right}>{right}</div>
        </div>
    )
}

export default DateCard;