import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormEements/Input';
import Button from '../../shared/components/FormEements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useForm } from '../../shared/hooks/useForm';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import { AuthContext } from '../../shared/context/auth-context';

import './PlaceForm.css';
import ImageUpload from '../../shared/components/FormEements/ImageUpload';

export default function NewPlace() {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { formState, inputHandler } = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      image: {
        value: '',
        isValid: false,
      },
    },
    false
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      //console.log('form submit: ', formData);
      await sendRequest(
        `${process.env.REACT_APP_API_URL}/places`,
        'POST',
        {
          Authorization: `Bearer ${auth.token}`,
        },
        formData
      );
      history.push(`/${auth.userId}/places`);
    } catch (error) {}
  };

  //console.log('formState ', formState);

  return (
    <>
      {isLoading && <LoadingSpinner overlay />}
      {!isLoading && error && <ErrorModal error={error} onClear={clearError} />}
      {
        <form className="place-form" onSubmit={submitHandler}>
          <Input
            element="input"
            label="Title"
            type="text"
            name="title"
            id="title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Title Required!"
            onInput={inputHandler}
          />
          <ImageUpload
            id="image"
            center
            onInput={inputHandler}
            errorText="Image Required!"
          />
          <Input
            element="textarea"
            label="Description"
            name="description"
            id="description"
            validators={[VALIDATOR_MINLENGTH(5), VALIDATOR_REQUIRE()]}
            errorText="Description Required! (min. 5 characters)"
            onInput={inputHandler}
          />
          <Input
            element="input"
            label="Address"
            type="text"
            name="address"
            id="address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Address Required!"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isFormValid}>
            ADD PLACE
          </Button>
        </form>
      }
    </>
  );
}
