import { Router } from 'express';
import FileController from '../controllers/fileController';

const router = Router();

router.route('/').get(FileController.index).post(FileController.store);

router.route('/:id').get(FileController.show).delete(FileController.destroy);

export default router;
