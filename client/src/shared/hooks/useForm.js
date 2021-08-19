import { useReducer, useCallback } from 'react';

const formReducer = (state, { type, payload }) => {
  switch (type) {
    case 'INPUT_CHANGE':
      let isFormValid = true;
      for (const input in state.inputs) {
        if (state.inputs[input] === undefined) {
          continue;
        }
        if (input === payload.inputId) {
          isFormValid = isFormValid && payload.isValid;
        } else {
          isFormValid = isFormValid && state.inputs[input].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [payload.inputId]: {
            value: payload.value,
            isValid: payload.isValid,
          },
        },
        isFormValid,
      };
    case 'SET_FORM':
      return {
        ...state,
        inputs: payload.inputs,
        isFormValid: payload.isFormValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialValid) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isFormValid: initialValid,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      payload: { inputId: id, value, isValid },
    });
  }, []);

  const setFormData = useCallback((inputs, isFormValid) => {
    dispatch({ type: 'SET_FORM', payload: { inputs, isFormValid } });
  }, []);

  return { formState, inputHandler, setFormData };
};
