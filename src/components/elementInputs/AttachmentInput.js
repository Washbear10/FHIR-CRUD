import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import Attachment from "../../classes/dataTypes/Attachment";
import { getAttachment } from "../../utilities/query";
const AttachmentInput = ({ attachment, changeAttachment }) => {
	const [displayImage, setDisplayImage] = useState(null);

	useEffect(() => {
		if (attachment.data) {
			makeImage(attachment.data).then((image) => {
				setDisplayImage(image);
			});
		} else if (attachment.url) {
			getAttachment(attachment.url)
				.then((response) => {
					return response.blob();
				})
				.then((blob) => {
					const reader = new FileReader();
					reader.readAsDataURL(blob);

					reader.onload = () => {
						const parsedData = reader.result.replace(/data:.*\/.*;base64,/, "");
						/* const parsedData = reader.result; */
						makeImage(parsedData).then((image) => {
							setDisplayImage(image);
						});
					};
				});
		}
	}, [attachment]);

	function makeImage(fileData) {
		return new Promise(function (resolved, rejected) {
			var i = new Image();
			i.onload = function (e) {
				resolved(i);
			};
			i.src = `data:image/jpeg;base64,${fileData}`;
		});
	}

	const handleFileChange = (e) => {
		if (e.target.files) {
			const file = e.target.files[0];
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				if (reader.result.startsWith("data:")) {
					const parsedData = reader.result.replace(/data:.*\/.*;base64,/, "");
					/* const parsedData = reader.result; */

					let newAttachment = new Attachment({
						...attachment,
						data: parsedData,
						url: null,
						contentType: "image/jpeg",
					});
					changeAttachment(newAttachment, attachment);
				}
			};
		}
	};

	if (displayImage) {
		return (
			<Box sx={{}}>
				<img
					src={`${displayImage.src}`}
					style={{
						objectFit: "contain ",
						maxHeight: "200px",
						maxWidth: "500px",
					}}
				/>
				;
			</Box>
		);
	} else {
		return (
			<Button variant="contained" component="label" sx={{ width: "3rem" }}>
				Upload
				<input
					hidden
					accept="image/*"
					multiple
					type="file"
					onChange={handleFileChange}
				/>
			</Button>
		);
	}
};

export default AttachmentInput;
