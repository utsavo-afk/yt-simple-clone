import { Router } from 'express';
import requireUser from '@src/middleware/requireUser';
import { findVideosHandler, streamVideoHandler, updateVideoHandler, uploadVideoHandler } from './video.controller';

const router = Router();

router.route('/').post(requireUser, uploadVideoHandler).get(findVideosHandler);
router.route('/:videoId').patch(requireUser, updateVideoHandler).get(streamVideoHandler);

export default router;
