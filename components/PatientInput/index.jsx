import {AutoComplete, Input} from 'antd';

const PatientInput = (props) => {

    const options = [{options:props.options.map(patient=>({value:patient._id,label:`${patient.name} ${patient.lastname}`}))}];
    
    return(
      <AutoComplete
        dropdownClassName="time-dropdown"
        // dropdownMatchSelectWidth={500}
        // style={{ width: 250 }}
        options={options}
        value={props.value}
        onChange={props.onChange}
      >
        <Input name={props.name} type="input"/>
      </AutoComplete>
    )
}

export default PatientInput;