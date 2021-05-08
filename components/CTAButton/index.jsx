import styles from './styles.module.css';
import Link from 'next/link'

const CTAButton = (props) => {

    const styling = `${styles.CTAButton} ${styles[(props.styling || 'CTA')]}`;
    
    if (props.goto) return (
        <Link href={props.goto}>
            <button className={styling}>
                {props.text}
            </button>
        </Link>
    )
    else if (props.onClick) return(
        <button onClick={props.onClick} className={styling}>
            {props.text}
        </button>
    )
}

export default CTAButton;