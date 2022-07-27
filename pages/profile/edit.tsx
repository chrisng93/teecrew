import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { TextField } from '@mui/material';

import { authOptions } from '../../common/auth/authOptions';
import prisma from '../../common/db/prisma';
import { User } from '../../common/types/user';

import styles from '../../styles/Edit.module.scss';

interface Props {
  user: User;
}

const Edit = ({ user }: Props) => (
  <div>
    <div className={styles.form}>
      <TextField defaultValue={user.userId} id="userid" label="User ID" required type="text" />
      <TextField defaultValue={user.name} id="name" label="Name" required type="text" />
      <TextField id="location" label="Location" required type="search" />
      <TextField defaultValue={user.handicap} id="handicap" label="Handicap" type="number" />
    </div>
  </div>
);

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
