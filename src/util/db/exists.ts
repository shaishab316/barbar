import { Model, Types } from 'mongoose';
import ServerError from '../../errors/ServerError';
import { StatusCodes } from 'http-status-codes';

export const exists = (model: Model<any>) => async (_id: string) =>
  (Types.ObjectId.isValid(_id) && (await model.exists({ _id }))) ||
  Promise.reject(
    new ServerError(
      StatusCodes.NOT_FOUND,
      `${model.modelName ?? 'Document'} not found`,
    ),
  );
