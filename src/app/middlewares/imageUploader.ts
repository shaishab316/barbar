/* eslint-disable no-undef, no-unused-vars */
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import deleteFile from '../../util/file/deleteFile';
import { createDir } from '../../util/file/createDir';
import catchAsync from '../../util/server/catchAsync';
import sharp from 'sharp';

/**
 * @description Multer middleware to handle image uploads with optional resizing.
 */
const imageUploader = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
} = {}) => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'images');
  const resizedDir = path.join(uploadDir, 'resized');

  createDir(uploadDir, resizedDir);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  const fileFilter = (_req: any, file: any, cb: FileFilterCallback) =>
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(
          new ServerError(
            StatusCodes.BAD_REQUEST,
            'Only image files are allowed',
          ),
        );

  const upload = multer({
    storage,
    fileFilter,
  }).fields([{ name: 'images', maxCount: 20 }]);

  return catchAsync((req, res, next) => {
    upload(req, res, async err => {
      if (err) next(err);

      const uploadedImages = req.files as { images?: Express.Multer.File[] };

      if (!uploadedImages?.images?.length) return next();

      const resizedImages: string[] = [];

      for (const file of uploadedImages.images) {
        const filePath = path.join(uploadDir, file.filename);

        if (!width && !height) resizedImages.push(`/images/${file.filename}`);
        else {
          const resizedFilePath = path.join(resizedDir, file.filename);

          try {
            await sharp(filePath)
              .resize(width, height, { fit: 'inside' })
              .toFile(resizedFilePath);

            await deleteFile(`/images/${file.filename}`);

            resizedImages.push(`/images/resized/${file.filename}`);
          } catch {
            next(
              new ServerError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Image resizing failed',
              ),
            );
          }
        }
      }

      req.body.images = resizedImages;
      next();
    });
  });
};

export default imageUploader;
