import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { notification } from 'antd';
import Loading from "../../components/Loading";
import {connect} from 'react-redux';
import styles from './styles.module.css';
import Footer from "../../components/Footer";

const Register = (props) => {
    
  const [loading, setLoading] = useState(false);


  return (
    <>
      <Header title="Calendario"></Header>
      <Loading visible={loading}></Loading>
      <div className="pageContainer">
        <div className="content content-3">
            <div className="card card-1" style={{minHeight:"39rem"}}>
              <div className="card-header">Jueves, 15 de abril de 2021</div>
              <div className="card-content">
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
              </div>
            </div>
            <div className="card card-1" style={{minHeight:"22.5rem"}}>
              <div className="card-header">Abril de 2021</div>
              <div className="card-content">
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
              </div>
            </div>
            <div className="card card-1" style={{minHeight:"22.5rem"}}>
              <div className="card-header">Abril de 2021</div>
              <div className="card-content">
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
                <div>Sample</div>
              </div>
            </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default connect((state)=>({user: state.user}))(Register);
