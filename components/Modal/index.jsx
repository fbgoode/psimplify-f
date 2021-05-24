import DraggableModal from '../DraggableModal';
import { Modal } from 'antd';

const FlexibleModal = (props) => {

  if(window.innerWidth>1165)
    return(
      <DraggableModal
        title ={props.title}
        visible={props.visible}
        onOk={props.onOk}
        confirmLoading={props.confirmLoading}
        onCancel={props.onCancel}
        okText= {props.okText || "Aceptar"}
        cancelText={props.cancelText || "Cancelar"}
        width={props.width}
        disabled={props.disabled}
      >
        {props.children}
      </DraggableModal>
  )
  else
    return(
      <Modal
        title ={props.title}
        visible={props.visible}
        onOk={props.onOk}
        confirmLoading={props.confirmLoading}
        onCancel={props.onCancel}
        okText= {props.okText || "Aceptar"}
        cancelText={props.cancelText || "Cancelar"}
        closable={false}
        mask={false}
        width={props.width}
        okButtonProps={props.disabled ? {disabled:true} : {}}
      >
        {props.children}
      </Modal>
    )
}

export default FlexibleModal;