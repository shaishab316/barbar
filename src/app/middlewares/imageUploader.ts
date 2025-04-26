/* eslint-disable no-undef, no-unused-vars */
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { StatusCodes } from 'http-status-codes';
import ServerError from '../../errors/ServerError';
import { createDir } from '../../util/file/createDir';
import catchAsync from '../../util/server/catchAsync';
import sharp from 'sharp';
import { json } from '../../util/transform/json';

/**
 * @description Multer middleware to handle image uploads with optional resizing.
 */
const imageUploader = ({
  width,
  height,
  fieldName = 'images',
  maxCount = 10,
  maxFileSizeMB = 5,
}: {
  width?: number;
  height?: number;
  fieldName?: string;
  maxCount?: number;
  maxFileSizeMB?: number;
} = {}) => {
  const uploadDir = path.join(process.cwd(), 'uploads', 'images');

  createDir(uploadDir);

  const storage = multer.memoryStorage();

  const fileFilter = (_req: any, file: any, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith('image/'))
      return cb(
        new ServerError(
          StatusCodes.BAD_REQUEST,
          'Only image files are allowed',
        ),
      );

    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxFileSizeMB * 1024 * 1024,
      files: maxCount,
    },
  }).fields([{ name: fieldName, maxCount }]);

  return catchAsync(async (req, res, next) => {
    upload(req, res, async err => {
      if (err) return next(err);

      const uploadedImages = req.files as {
        [key: string]: Express.Multer.File[];
      };

      if (uploadedImages?.[fieldName]?.length) {
        const images: string[] = [];

        for (const file of uploadedImages[fieldName]) {
          try {
            const fileExt = path.extname(file.originalname);
            const fileName = `${file.originalname
              .replace(fileExt, '')
              .toLowerCase()
              .split(' ')
              .join('-')}-${Date.now()}${fileExt}`;

            const filePath = path.join(uploadDir, fileName);

            if (width || height) {
              await sharp(file.buffer)
                .resize(width, height, { fit: 'inside' })
                .toFile(filePath);
            } else {
              await sharp(file.buffer).toFile(filePath);
            }

            images.push(`/${path.join('images', fileName)}`);
          } catch (error) {
            return next(
              new ServerError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Image processing failed',
              ),
            );
          }
        }

        req.body[fieldName] = maxCount > 1 ? images : images[0];
        req.tempFiles = images;
      }

      if (req.body.data) req.body = json(req.body.data);
      next();
    });
  });
};

export default imageUploader;
