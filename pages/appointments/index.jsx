import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { notification } from 'antd';
import Loading from "../../components/Loading";
import {connect} from 'react-redux';
import styles from './styles.module.css';

const Register = (props) => {
    
  const [loading, setLoading] = useState(false);


  return (
    <>
      <Header title="Calendario"></Header>
      <Loading visible={loading}></Loading>
      <div className="pageContainer">
        <div className="content">
            
        </div>
      </div>
    </>
  );
};

export default connect((state)=>({user: state.user}))(Register);
