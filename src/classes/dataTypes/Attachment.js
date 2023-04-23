import { v4 as uuidv4 } from "uuid";
export default class Attachment {
	constructor({
		contentType,
		language,
		data,
		url,
		size,
		hash,
		title,
		creation,
		height,
		width,
		frames,
		duration,
		pages,
		internalReactID,
	}) {
		console.log("in att constructor");
		this.contentType = contentType;
		this.language = language;
		this.data = data;
		this.url = url;
		this.size = size;
		this.hash = hash;
		this.title = title;
		this.creation = creation;
		this.height = height;
		this.width = width;
		this.frames = frames;
		this.duration = duration;
		this.pages = pages;
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}
}
