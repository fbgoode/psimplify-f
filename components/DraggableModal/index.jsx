import React, { useState } from "react";
import Draggable from 'react-draggable';
import { Modal } from 'antd';
import styles from './styles.module.css';

const DraggableModal = (props) => {

    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });

    const draggleRef = React.createRef();

    const onStart = (event, uiData) => {
      const { clientWidth, clientHeight } = window?.document?.documentElement;
      const targetRect = draggleRef?.current?.getBoundingClientRect();
      setBounds({
          left: -targetRect?.left + uiData?.x,
          right: clientWidth - (targetRect?.right - uiData?.x),
          top: -targetRect?.top + uiData?.y,
          bottom: clientHeight - (targetRect?.bottom - uiData?.y)
      });
    };
    
    return(
        <Modal
          title={
            <div
              style={{
                width: '100%',
                cursor: 'move',
              }}
              onMouseOver={() => {
                if (disabled) {
                  setDisabled(false);
                }
              }}
              onMouseOut={() => {
                setDisabled(true);
              }}
              onFocus={() => {}}
              onBlur={() => {}}
            >
              {props.title}
            </div>
          }
          closable={false}
          mask={false}
          visible={props.visible}
          onOk={props.onOk}
          confirmLoading={props.confirmLoading}
          onCancel={props.onCancel}
          okText= {props.okText}
          width={props.width}
          cancelText={props.cancelText}
          modalRender={modal => (
            <Draggable
              disabled={disabled}
              bounds={bounds}
              onStart={(event, uiData) => onStart(event, uiData)}
            >
              <div ref={draggleRef}>{modal}</div>
            </Draggable>
          )}
        >
          {props.children}
        </Modal>
    )
}

export default DraggableModal;