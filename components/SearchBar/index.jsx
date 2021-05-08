import styles from './styles.module.css';

const SearchBar = (props) => {

    
    return(
        <div className={styles.bar}>
            <img className={styles.icon} src="/img/search.svg"/>
            <input className={styles.input} placeholder={props.placeholder}/>
        </div>
    )
}

export default SearchBar;