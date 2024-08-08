import { Request, Response, NextFunction } from 'express';
import { FileModel } from '../models/FileModel';

export default class FileController {
  constructor() {}

  static async index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    res.status(200).json({
      status: 'success',
      message: 'App is running',
    });
  }

  static async show(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const fileId = req.params?.id;

    if (!fileId) {
      res.status(400).json({
        status: 'error',
        message: 'File ID is required',
      });
    }

    const findFile = FileModel.findByPk(fileId);

    if (!findFile) {
      res.status(400).json({
        status: 'error',
        message: 'File ID is invalid',
      });
    }

    res.status(200).json({
      status: 'success',
      data: findFile,
    });
  }

  static async store(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    res.status(201).json({
      status: 'success',
      message: 'App is running',
    });
  }

  static async destroy(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    res.status(200).json({
      status: 'success',
      message: 'App is running',
    });
  }
}
