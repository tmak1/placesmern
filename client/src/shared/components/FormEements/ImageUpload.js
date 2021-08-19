import React, { useRef, useReducer, useEffect } from 'react';
import Button from './Button';

import './ImageUpload.css';

const imageReducer = (state, { type, payload }) => {
  switch (type) {
    case 'INPUT_CHANGE':
      return {
        ...state,
        value: payload.value,
        isValid: payload.isValid,
      };
    case 'SET_PREVIEWURL':
      return {
        ...state,
        previewUrl: payload.previewUrl,
      };
    default:
      return state;
  }
};

export default function ImageUpload({
  id,
  onInput,
  center,
  errorText,
  initialValue,
  initialIsValid,
}) {
  const filePickerRef = useRef();
  const [fileState, dispatch] = useReducer(imageReducer, {
    value: initialValue || null,
    isValid: initialIsValid || false,
    previewUrl: null,
  });
  const { value, isValid, previewUrl } = fileState;
  const pickedHandler = (e) => {
    let pickedFile;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      dispatch({
        type: 'INPUT_CHANGE',
        payload: { value: pickedFile, isValid: true },
      });
    }
  };

  useEffect(() => {
    if (!value && !isValid) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      dispatch({
        type: 'SET_PREVIEWURL',
        payload: { previewUrl: fileReader.result },
      });
    };
    fileReader.readAsDataURL(value);
  }, [value, isValid]);

  useEffect(() => {
    onInput(id, value, isValid);
  }, [onInput, previewUrl, id, value, isValid]);

  return (
    <div className="form-control">
      <input
        id={id}
        type="file"
        ref={filePickerRef}
        style={{ display: 'none' }}
        accept=".jpg, .jpeg, .png"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            <p>Please pick an image</p>
          )}
        </div>
        <Button
          type="button"
          onClick={() => {
            filePickerRef.current.click();
          }}
        >
          PICK IMAGE
        </Button>

        {!isValid && (
          <div className="image-upload__invalid ">
            <p>{errorText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
