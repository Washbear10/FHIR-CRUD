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
			console.log("has url: ", attachment.url);
			getAttachment(attachment.url)
				.then((response) => {
					console.log(response);
					return response.blob();
				})
				.then((blob) => {
					const reader = new FileReader();
					reader.readAsDataURL(blob);

					reader.onload = () => {
						/* const parsedData = reader.result.replace(/data:.*\/.*;base64,/, ""); */
						const parsedData = reader.result;
						makeImage(parsedData).then((image) => {
							setDisplayImage(image);
						});
					};
				});
		}
	}, [attachment]);

	function makeImage(fileData) {
		return new Promise(function (resolved, rejected) {
			console.log(fileData);
			var i = new Image();
			i.onload = function (e) {
				resolved(i);
			};
			i.src = fileData;
		});
	}

	const handleFileChange = (e) => {
		if (e.target.files) {
			const file = e.target.files[0];
			console.log(file);
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				if (reader.result.startsWith("data:")) {
					const parsedData = reader.result.replace(/data:.*\/.*;base64,/, "");
					let newAttachment = new Attachment({
						...attachment,
						data: parsedData,
						url: null,
					});
					changeAttachment(newAttachment, attachment);
				}
			};
		}
	};
	/* if (attachment.url) {
		return (
			<Box
				sx={{
					height: dimensions.heigh,
					width: dimensions.width,
					maxWidth: "100%",
					maxHeight: "500px",
				}}
			>
				<img src={`data:image/jpeg;base64,${attachment.data}`} />;
			</Box>
		);
	} else if (attachment.data) {
		/* const image = await getImageDimensions(attachment.data); 
		return (
			<Box
				sx={{
					height: dimensions.heigh,
					width: dimensions.width,
					maxWidth: "100%",
					maxHeight: "500px",
				}}
			>
				<img src={`data:image/jpeg;base64,${attachment.data}`} />;
			</Box>
		);
	} */
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
			<Button variant="contained" component="label">
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
