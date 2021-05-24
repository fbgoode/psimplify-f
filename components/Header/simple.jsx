import styles from './styles.module.css';

const Header = (props)=>{

    return(
        <header className={styles.header}>
            <div className={styles.title}>{props.title}</div>
              <div className={styles.headerContainer}>
                <div className={styles.menulogo}>
                    <div className={styles.logoSmall}>P.</div>
                    <div className={styles.logo} style={{cursor:"default"}}>Psimplify.</div>
                </div>
            </div>
        </header>
    )
}

export default Header;