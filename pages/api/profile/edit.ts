import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../common/db/prisma';

const schema = Joi.object({
  handicap: Joi.number(),
  locationLat: Joi.number(),
  locationLng: Joi.number(),
  name: Joi.string().required(),
  id: Joi.string().guid().required(),
  userId: Joi.string().required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>,
) {
  const { body } = req;
  const requestUser = JSON.parse(body);

  const { error } = schema.validate(requestUser);
  if (error) {
    return res.status(400).json(error);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: requestUser.id,
    },
    data: requestUser,
  });

  return res.status(200).json(updatedUser);
}
