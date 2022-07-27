import NextAuth from 'next-auth';

import { authOptions } from '../../../common/auth/authOptions';

export default NextAuth(authOptions);
