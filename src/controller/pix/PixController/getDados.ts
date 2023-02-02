import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Fcweb } from '../../../db/table/fcweb';

export const Get = async (req: Request, res: Response) => {
  await Fcweb.findOne({
    where: {
        id: {
          [Op.like]: req.params.id,
        },
      },
  })
    .then((response: any) => {
      res.status(200).json(response);
    })
    .catch((err: any) => {
      res.status(400).json(err);
    });
};