import Link from 'next/link';
import styles from './styles.module.css';
import { useRouter } from 'next/router'
import { Tooltip } from 'antd';

const Avatar = (props) => {

    const router = useRouter();
    let selected = false;
    if (router.pathname === props.goto) selected = true;

    return(
        <Link href={props.goto}>
            <Tooltip placement="bottom" title={props.title} mouseEnterDelay="0.5">
                <div className={styles.col}>
                    <img className={styles.icon} src={props.src} alt={props.title} style={{opacity:selected?"1":".6"}}/>
                    <div className={styles.line} style={{backgroundColor:selected?"#000":""}}></div>
                </div>
            </Tooltip>
        </Link>
    )
}

export default Avatar;