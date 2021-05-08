import Avatar from '../Avatar';
import {connect} from 'react-redux';
import styles from './styles.module.css';
import Link from 'next/link';
import { Menu,  Dropdown } from 'antd';
import { Auth } from '@aws-amplify/auth';
import {LOGOUT} from '../../redux/types';
import { useRouter } from 'next/router';
import HeaderItem from '../HeaderItem';

const Header = (props)=>{
    
    const router = useRouter();

    let user = props.user;

    const logOut = async () => {
        try {
            await Auth.signOut();
            props.dispatch({type:LOGOUT});
            router.push('/');
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    const menu = (
        <Menu>
          <Menu.Item>
            <Link href="/profile">
              Mi perfil
            </Link>
          </Menu.Item>
          <Menu.Item>
            <div onClick={logOut}>
              Cerrar sesión
            </div>
          </Menu.Item>
        </Menu>
    );

    return(
        <header className={styles.header}>
            <div className={styles.headerContainer}>
            <div className={styles.title}><div>{props.title}</div></div>
                <Link href="/">
                    <div className={styles.menulogo}>
                        <div className={styles.logo}>Psimplify.</div>
                    </div>
                </Link>
                <div className={styles.right}>
                    <HeaderItem title="Calendario" goto="/appointments" src="/img/cal.svg"/>
                    <HeaderItem title="Pacientes" goto="/patients" src="/img/patients.svg"/>
                    <HeaderItem title="Bonos y pagos" goto="/payments" src="/img/cash.svg"/>
                    <Dropdown overlay={menu} placement="bottomRight">
                        <div>
                            <Avatar name={user.name}/>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </header>
    )
}

export default connect((state)=>({user:state.user}))(Header);