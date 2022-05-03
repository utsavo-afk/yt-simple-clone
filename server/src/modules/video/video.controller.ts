import { Request, Response } from 'express';
import busboy from 'busboy';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import { createVideo, findVideo, findVideos } from './video.service';
import getPathHelper from '@src/helpers/getPath.helper';
import { UpdateVideoBody, UpdateVideoParams } from './video.schema';

const MIME_TYPES = ['video/mp4', 'video/mov'];
const CHUNK_SIZE_IN_BYTES = 1_000_000;

export async function uploadVideoHandler(req: Request, res: Response) {
	const bb = busboy({ headers: req.headers });
	const user = res.locals.user;
	const video = await createVideo({ owner: user._id });
	bb.on('file', async (_, file, info) => {
		if (!MIME_TYPES.includes(info.mimeType)) {
			return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid file type' });
		}
		const extension = info.mimeType.split('/')[1];

		const filePath = getPathHelper({ videoId: video.videoId, extension });

		video.extension = extension;
		await video.save();

		// create stream
		const stream = fs.createWriteStream(filePath);

		file.pipe(stream);
	});
	bb.on('close', () => {
		res.writeHead(StatusCodes.CREATED, { Connection: 'close', 'Content-Type': 'application/json' });
		res.write(JSON.stringify(video));
		res.end();
	});

	return req.pipe(bb);
}

export async function updateVideoHandler(req: Request<UpdateVideoParams, unknown, UpdateVideoBody>, res: Response) {
	const { videoId } = req.params;
	const { title, description, published } = req.body;

	const { _id: userId } = res.locals.user;

	const video = await findVideo(videoId);

	if (!video) {
		return res.status(StatusCodes.NOT_FOUND).send({ message: 'Video not found' });
	}

	if (String(video.owner) !== String(userId)) {
		return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
	}

	video.title = title;
	video.description = description;
	video.published = published;
	await video.save();

	return res.status(StatusCodes.OK).send(video);
}

export async function findVideosHandler(req: Request, res: Response) {
	const videos = await findVideos();
	return res.status(StatusCodes.OK).send(videos);
}

export async function streamVideoHandler(req: Request, res: Response) {
	const { videoId } = req.params;

	const range = req.headers.range;
	if (!range) {
		return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Range must be provided' });
	}

	const video = await findVideo(videoId);
	if (!video) {
		return res.status(StatusCodes.NOT_FOUND).send({ message: 'Video not found' });
	}

	const filePath = getPathHelper({ videoId: video.videoId, extension: video.extension });

	const fileSizeInBytes = fs.statSync(filePath).size;

	const chunkStart = Number(range.replace(/\D/g, ''));

	const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, fileSizeInBytes - 1);

	const contentLength = chunkEnd - chunkStart + 1;

	const headers = {
		'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': contentLength,
		'Content-Type': `video/${video.extension}`,
		'Cross-Origin_Resource-Policy': 'cross-origin',
	};

	res.writeHead(StatusCodes.PARTIAL_CONTENT, headers);

	const videoStream = fs.createReadStream(filePath, {
		start: chunkStart,
		end: chunkEnd,
	});

	videoStream.pipe(res);
}
