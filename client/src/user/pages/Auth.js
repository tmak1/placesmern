import React, { useState, useContext } from 'react';

import Input from '../../shared/components/FormEements/Input';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormEements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useForm } from '../../shared/hooks/useForm';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';
import ImageUpload from '../../shared/components/FormEements/ImageUpload';

export default function Auth() {
  const auth = useContext(AuthContext);
  const { formState, inputHandler, setFormData } = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const switchModeHandler = () => {
    if (isLoginMode) {
      setIsLoginMode(false);
      setFormData(
        {
          ...formState.inputs,
          name: { value: '', isValid: false },
          image: { value: null, isValid: false },
        },
        false
      );
    } else {
      setIsLoginMode(true);
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/login`,
          'POST',
          { 'Content-Type': 'application/json', Authorization: `Bearer ` },
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        );

        auth.login(data.user.userId, data.token);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append('name', formState.inputs.name.value);
        formData.append('email', formState.inputs.email.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        //console.log('form submit: ', formData);
        const data = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/signup`,
          'POST',
          { Authorization: `Bearer ` },
          formData
        );
        //console.log(data);
        auth.login(data.user.userId, data.token);
      } catch (error) {}
    }
  };
  console.log('LOGIN IS RENDERING!');
  //console.log('formState ', formState);

  return (
    <>
      {isLoading && <LoadingSpinner overlay />}
      {!isLoading && error && <ErrorModal error={error} onClear={clearError} />}
      {!isLoading && !error && (
        <form className="place-form" onSubmit={submitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              label="Name"
              type="text"
              name="name"
              id="name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Name Required!"
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Image Required!"
            />
          )}
          <Input
            element="input"
            label="Email"
            type="email"
            name="email"
            id="email"
            validators={[VALIDATOR_EMAIL(), VALIDATOR_REQUIRE]}
            errorText="Email Required!"
            onInput={inputHandler}
          />
          <Input
            element="input"
            type="password"
            label="Password"
            name="password"
            id="password"
            validators={[VALIDATOR_MINLENGTH(3), VALIDATOR_REQUIRE()]}
            errorText="Password Required! (min. 3 characters)"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isFormValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
          <Button type="button" onClick={switchModeHandler}>
            SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
          </Button>
        </form>
      )}
    </>
  );
}
