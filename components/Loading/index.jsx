
import React from 'react';
//import { useState } from 'react';

import { Spin } from 'antd';
import styles from './styles.module.css';

const Loading = (props) => {

    let classes = styles.loadingContainer;
    if (props.visible) classes += ' ' + styles.visible;
    
    return(
        <div className={classes}>
            <Spin size="large"></Spin>
        </div>
    )

}

export default Loading;