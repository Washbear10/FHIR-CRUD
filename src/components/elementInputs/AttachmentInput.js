import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import Attachment from "../../classes/dataTypes/Attachment";
const AttachmentInput = ({ attachment, changeAttachment }) => {
	const [dimensions, setDimensions] = useState({});

	useEffect(() => {
		if (attachment.data) {
			makeImage(attachment.data).then((image) => {
				setDimensions({ height: image.height, width: image.width });
			});
		}
	}, [attachment]);

	function makeImage(fileData) {
		return new Promise(function (resolved, rejected) {
			var i = new Image();
			i.onload = function () {
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
	if (attachment.url) {
		return "has some url";
	} else if (attachment.data) {
		/* const image = await getImageDimensions(attachment.data); */
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
