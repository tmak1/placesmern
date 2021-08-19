import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormEements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

export default function Users() {
  const [loadedUsers, setLoadedUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // let USERS = [
  //   {
  //     id: 'u1',
  //     name: 'John Doe',
  //     email: 'jo.doe@gmail.com',
  //     password: 'hello',
  //     imageUrl:
  //       'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/75226074-4200-4395-8242-314c82aa674c/d721jxy-91dce9cf-ef52-46df-b6ad-73d93ebfdf4c.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNzUyMjYwNzQtNDIwMC00Mzk1LTgyNDItMzE0YzgyYWE2NzRjXC9kNzIxanh5LTkxZGNlOWNmLWVmNTItNDZkZi1iNmFkLTczZDkzZWJmZGY0Yy5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.qLGPqy0jQHbEQ5DYkppjwBd-6zlkhO4wCmN2OgUeAW8',
  //     placeIds: [],
  //   },
  //   {
  //     id: 'u2',
  //     name: 'Jane Doe',
  //     email: 'ja.doe@gmail.com',
  //     password: 'who',
  //     imageUrl:
  //       'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/75226074-4200-4395-8242-314c82aa674c/d721jxy-91dce9cf-ef52-46df-b6ad-73d93ebfdf4c.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvNzUyMjYwNzQtNDIwMC00Mzk1LTgyNDItMzE0YzgyYWE2NzRjXC9kNzIxanh5LTkxZGNlOWNmLWVmNTItNDZkZi1iNmFkLTczZDkzZWJmZGY0Yy5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.qLGPqy0jQHbEQ5DYkppjwBd-6zlkhO4wCmN2OgUeAW8',
  //     placeIds: [],
  //   },
  // ];

  useEffect(() => {
    (async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users`
        );
        setLoadedUsers(data.users);
      } catch (error) {}
    })();
  }, [sendRequest]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner overlay />
      ) : error ? (
        <ErrorModal error={error} onClear={clearError} />
      ) : loadedUsers && loadedUsers.length > 0 ? (
        <UsersList items={loadedUsers} />
      ) : (
        <div>
          <div className="center">
            <Card>
              <h2>No users found</h2>
            </Card>
          </div>
          <br />
          <br />
          <br />
          <Button inverse to="/login">
            Signup?
          </Button>
        </div>
      )}
    </>
  );
}
