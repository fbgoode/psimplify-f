import styles from './styles.module.css';
import HeaderItem from '../HeaderItem';

const Footer = (props)=>{
    return(
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <HeaderItem title="Calendario" goto="/appointments" src="/img/cal.svg"/>
                <HeaderItem title="Pacientes" goto="/patients" src="/img/patients.svg"/>
                <HeaderItem title="Bonos y pagos" goto="/payments" src="/img/cash.svg"/>
            </div>
        </footer>
    )
}

export default Footer;