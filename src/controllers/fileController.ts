import { Request, Response, NextFunction } from 'express';

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
    res.status(200).json({
      status: 'success',
      message: 'App is running',
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
