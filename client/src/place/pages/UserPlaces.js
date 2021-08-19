import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormEements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import PlacesList from '../components/PlacesList';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import { AuthContext } from '../../shared/context/auth-context';

export default function Place() {
  const userId = useParams().uid;
  const auth = useContext(AuthContext);
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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

  const deletePlaceHandler = async (placeId) => {
    try {
      const data = await sendRequest(
        `${process.env.REACT_APP_API_URL}/places/${placeId}`,
        'DELETE',
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      console.log(data.place.placeId);
      setLoadedPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place.placeId !== data.place.placeId)
      );
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_API_URL}/places/users/${userId}`
        );
        setLoadedPlaces(data.places);
      } catch (error) {}
    })();
  }, [sendRequest, userId]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner overlay />
      ) : error ? (
        <ErrorModal error={error} onClear={clearError} />
      ) : loadedPlaces && loadedPlaces.length > 0 ? (
        <PlacesList
          items={loadedPlaces}
          deletePlaceHandler={deletePlaceHandler}
        />
      ) : (
        <div>
          <div className="center">
            <Card>No places Found</Card>
          </div>
          <br />
          <br />
          <br />
          {auth.userId === userId && (
            <Button inverse to="/places/new">
              Create One?
            </Button>
          )}
        </div>
      )}
    </>
  );
}
