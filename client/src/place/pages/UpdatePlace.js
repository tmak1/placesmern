import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormEements/Input';
import ImageUpload from '../../shared/components/FormEements/ImageUpload';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import Button from '../../shared/components/FormEements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import { useForm } from '../../shared/hooks/useForm';
import { AuthContext } from '../../shared/context/auth-context';

import './PlaceForm.css';

export default function UpdatePlace() {
  // let PLACES = [
  //   {
  //     id: 'p1',
  //     title: 'Empire State Building',
  //     description: 'One of the most famous skyscrapers',
  //     coordinates: {
  //       lat: 40.7484474,
  //       lng: -73.9871516,
  //     },
  //     address: '20 W 34th St, New York, NY 10001',
  //     imageUrl:
  //       'https://www.findingtheuniverse.com/wp-content/uploads/2020/07/Empire-State-Building-view-from-uptown_by_Laurence-Norah-2.jpg',
  //     creatorId: 'u1',
  //   },
  //   {
  //     id: 'p2',
  //     title: 'Eiffel Tower',
  //     description: "Gustave Eiffel's iconic, wrought-iron 1889 tower.",
  //     coordinates: {
  //       lat: 48.858441,
  //       lng: 2.293235,
  //     },
  //     address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
  //     imageUrl:
  //       'https://imagesvc.meredithcorp.io/v3/mm/image?q=85&c=sc&poi=face&w=1600&h=800&url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2017%2F02%2Feiffel-tower-paris-france-EIFFEL0217.jpg',
  //     creatorId: 'u2',
  //   },
  // ];
  const history = useHistory();
  const placeId = useParams().pid;
  const auth = useContext(AuthContext);
  const [loadedPlace, setLoadedPlace] = useState();
  const [imageFile, setImageFile] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { formState, inputHandler, setFormData } = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
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

  const submitHandler = async (e) => {
    e.preventDefault();
    //console.log('form submit: ', formState);
    const formData = new FormData();
    formData.append('title', formState.inputs.title.value);
    formData.append('description', formState.inputs.description.value);
    formData.append('image', formState.inputs.image.value);
    const data = await sendRequest(
      `${process.env.REACT_APP_API_URL}/places/${placeId}`,
      'PATCH',
      {
        Authorization: `Bearer ${auth.token}`,
      },
      formData
    );
    history.push(`/${data.place.creatorId}/places`);
  };

  useEffect(() => {
    (async () => {
      let data;
      let image;
      try {
        data = await sendRequest(
          `${process.env.REACT_APP_API_URL}/places/${placeId}`
        );
        image = await sendRequest(
          `${process.env.REACT_APP_API_URL}/uploads/${data.place.imageUrl}`,
          undefined,
          undefined,
          undefined,
          data.place.imageUrl.split('/')[2]
        );
        setLoadedPlace(data.place);
        setImageFile(image);
        setFormData(
          {
            title: { value: data.place.title, isValid: true },
            description: { value: data.place.description, isValid: true },
            image: { value: image, isValid: true },
          },
          true
        );
      } catch (error) {}
    })();
  }, [setFormData, sendRequest, placeId]);

  return (
    <>
      {isLoading && <LoadingSpinner overlay />}
      {!isLoading && error && <ErrorModal error={error} onClear={clearError} />}
      {!isLoading &&
        !error &&
        loadedPlace &&
        loadedPlace.title &&
        loadedPlace.description &&
        imageFile && (
          <form className="place-form" onSubmit={submitHandler}>
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              initialValue={imageFile}
              initialIsValid={true}
              errorText=""
            />
            <Input
              element="input"
              label="Title"
              type="text"
              name="title"
              id="title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Title Required!"
              onInput={inputHandler}
              initialValue={loadedPlace.title}
              initialIsValid={true}
              initialIsTouched={true}
            />
            <Input
              element="textarea"
              label="Description"
              name="description"
              id="description"
              validators={[VALIDATOR_MINLENGTH(5), VALIDATOR_REQUIRE()]}
              errorText="Description Required! (min. 5 characters)"
              onInput={inputHandler}
              initialValue={loadedPlace.description}
              initialIsValid={true}
              initialIsTouched={true}
            />
            <Button type="submit" disabled={!formState.isFormValid}>
              UPDATE PLACE
            </Button>
          </form>
        )}
    </>
  );
}
