import React, { useReducer, useEffect } from 'react';
import { validate } from '../../util/validators';

import './Input.css';

const inputReducer = (state, { type, payload }) => {
  switch (type) {
    case 'INPUT_CHANGE':
      return {
        ...state,
        value: payload.value,
        isValid: validate(payload.value, payload.validators),
        isTouched: true,
      };
    case 'INPUT_BLUR':
      return { ...state, isTouched: true };
    default:
      return state;
  }
};

export default function Input({
  element,
  label,
  type,
  name,
  id,
  validators,
  errorText,
  onInput,
  initialValue,
  initialIsValid,
  initialIsTouched,
}) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: initialValue || '',
    isValid: initialIsValid || false,
    isTouched: initialIsTouched || false,
  });

  const changeHandler = (e) => {
    dispatch({
      type: 'INPUT_CHANGE',
      payload: { value: e.target.value, validators: validators },
    });
  };

  const blurHandler = () => {
    dispatch({ type: 'INPUT_BLUR' });
  };

  const { value, isValid, isTouched } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  const ele =
    element === 'input' ? (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
    ) : (
      <textarea
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
    );

  return (
    <>
      <div
        className={`form-control ${
          !isValid && isTouched && 'form-control--invalid'
        }`}
      >
        <label htmlFor={id}>{label}</label>
        {ele}
        {!isValid && isTouched && <p>{errorText}</p>}
      </div>
    </>
  );
}
