export default function ({ videoId, extension }: { videoId: string; extension: string }) {
	return `${process.cwd()}/media/${videoId}.${extension}`;
}
