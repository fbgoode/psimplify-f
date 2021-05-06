import styles from './styles.module.css';
import { useRouter } from 'next/router';

const CTAButton = (props) => {

    const router = useRouter();

    const styling = `${styles.CTAButton} ${styles[(props.styling || 'CTA')]}`;

    const route = () => {
        router.push(`/${props.goto}`);
    }

    let onClick = () => route();
    if (props.onClick) onClick = props.onClick;

    return(
        <button onClick={onClick} className={styling}>
            {props.text}
        </button>
    )
}

export default CTAButton;