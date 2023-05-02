import styles from './InputForm.module.css';

const Input = ({type,text, name, placeholder, handleOnChange, value, multiple}) => {
  return (
    <div className={styles.form_control}>
        <label htmlFor={name}>{text}</label>
        <input 
            type={type} 
            placeholder={placeholder} 
            id={name} 
            onChange={handleOnChange} 
            name={name}
            value={value} 
            {...(multiple ? {multiple} : '')}
        />
    </div>
  )
}

export default Input