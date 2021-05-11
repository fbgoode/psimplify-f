import styles from './styles.module.css';
import HeaderItem from '../HeaderItem';
import { Tooltip } from 'antd';

const Footer = (props)=>{
    return(
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <HeaderItem title="Calendario" goto="/appointments" src="/img/cal.svg"/>
                <HeaderItem title="Pacientes" goto="/patients" src="/img/patients.svg"/>
                {/* <HeaderItem title="Bonos y pagos" goto="/payments" src="/img/cash.svg"/> */}
                <Tooltip placement="bottom" title="Bonos y pagos (coming soon)" mouseEnterDelay="0.5">
                    <div className={styles.col}>
                        <img src="/img/cash.svg" alt="Bonos y pagos" style={{width:"1.75rem",height:"1.75rem",opacity:".4"}}/>
                    </div>
                </Tooltip>
            </div>
        </footer>
    )
}

export default Footer;