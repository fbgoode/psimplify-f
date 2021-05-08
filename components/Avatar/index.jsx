import Link from 'next/link'
import styles from './styles.module.css';

const Avatar = (props) => {

    const styling = `${styles.Avatar} ${styles[props.styling] || 'small'}`;

    let letter = 'Ñ';
    if (props.name) {
        letter = props.name.slice(0,1).toUpperCase();
    }
    let style;
    if (props.color) {
        style = {backgroundColor: props.color};
    }

    if (props.goto) return (
        <Link href={props.goto}>
            <div className={styling}>
                <div className={styles.avatarPic} style={style}>
                    <div className={styles.letter}>{letter}</div>
                </div>
            </div>
        </Link>
    )

    let onClick = () => {};
    if (props.onClick) onClick = props.onClick;
    
    return(
        <div onClick={props.onClick} className={styling}>
            <div className={styles.avatarPic} style={style}>
                <div className={styles.letter}>{letter}</div>
            </div>
            <div className={styles.name}>{name}</div>
        </div>
    )
}

export default Avatar;