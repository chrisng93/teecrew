import {
  useCallback, useEffect, useReducer, useRef,
} from 'react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { Button, TextField } from '@mui/material';
import { useSWRConfig } from 'swr';

import { authOptions } from '../../common/auth/authOptions';
import prisma from '../../common/db/prisma';
import { User } from '../../common/types/user';

import styles from '../../styles/Edit.module.scss';

interface Props {
  user: User;
}

interface State {
  handicap: number;
  locationLat: number;
  locationLng: number;
  name: string;
  userId: string;
}

interface Payload {
  field: string;
  value: any;
}

interface Action {
  payload: Payload,
  type: 'CHANGE_VALUE',
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CHANGE_VALUE': {
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    }
    default: {
      return state;
    }
  }
};

// TODO: Add profile photo, ability to add new photo.
// TODO: Add location search.
const Edit = ({ user }: Props) => {
  const { mutate } = useSWRConfig();
  const autocomplete = useRef(null);

  const [state, dispatch] = useReducer(reducer, {
    locationLat: user.locationLat,
    locationLng: user.locationLng,
    handicap: user.handicap,
    name: user.name,
    userId: user.userId,
  });

  const dispatchAction = useCallback((field: string, value: any) => dispatch({
    payload: {
      field,
      value,
    },
    type: 'CHANGE_VALUE',
  }), []);

  const handleSubmit = useCallback(() => {
    const updateFn = async () => {
      const data = await fetch(
        '/api/profile/edit',
        {
          body: JSON.stringify({
            ...state,
            id: user.id,
          }),
          method: 'POST',
        },
      );
      return data;
    };
    mutate('/api/profile/edit', updateFn, { optimisticData: state, rollbackOnError: true });
  }, [mutate, state, user.id]);

  if (typeof window !== 'undefined') {
    const input = document.getElementById('location');
    const options = {
      componentRestrictions: { country: 'us' },
      fields: ['address_components', 'geometry', 'icon', 'name'],
    };

    autocomplete.current = new google.maps.places.Autocomplete(input, options);
  }

  const onPlaceChanged = useCallback(() => {
    if (autocomplete.current) {
      const place = autocomplete.current.getPlace();
      dispatchAction('locationLat', place.geometry.location.lat());
      dispatchAction('locationLng', place.geometry.location.lng());
    }
  }, [dispatchAction]);
  useEffect(() => {
    const listener = google.maps.event.addListener(autocomplete.current, 'place_changed', onPlaceChanged);
    return () => google.maps.event.removeListener(listener);
  }, [onPlaceChanged]);

  return (
    <div>
      <form className={styles.form}>
        <TextField defaultValue={state.userId} id="userid" label="User ID" onChange={(event) => dispatchAction('userId', event.target.value)} required type="text" />
        <TextField defaultValue={state.name} id="name" label="Name" onChange={(event) => dispatchAction('name', event.target.value)} required type="text" />
        {/** TODO: Geocode location before sending it down */}
        <TextField defaultValue={state.locationLat && state.locationLng && `${state.locationLat},${state.locationLng}`} id="location" label="Location" required type="search" />
        <TextField defaultValue={state.handicap} id="handicap" label="Handicap" onChange={(event) => dispatchAction('handicap', parseInt(event.target.value, 10))} type="number" />
      </form>
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
};

export default Edit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email || '',
    },
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};
