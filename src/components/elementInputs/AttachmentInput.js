import React, { useContext, useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import Attachment from "../../classes/dataTypes/Attachment";
import { getAttachment } from "../../utilities/query";
import { AttributeBlockErrorContext } from "../../utilities/AttributeBlockErrorContext";
const AttachmentInput = ({ attachment, changeAttachment, photoSizeSum }) => {
	const [displayImage, setDisplayImage] = useState(null);

	const {
		attributeBlockError,
		setAttributeBlockError,
		attributeBlockErrorMessage,
		setAttributeBlockErrorMessage,
	} = useContext(AttributeBlockErrorContext);
	const [errorMessage, setErrorMessage] = useState("");

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
			if (!file.type.match("image.*")) {
				setErrorMessage("Only images are allowed.");
				return;
			}
			if (
				file.size + photoSizeSum >
				process.env.REACT_APP_MAX_ATTACHMENT_SIZE
			) {
				/* setAttributeBlockError(true);
				setAttributeBlockErrorMessage(
					"Files exceed maximum size (10MB in total). Please remove or compress files."
				); */
				setErrorMessage(
					"Files exceed maximum size (10MB in total). Please remove or compress some files in order to add more."
				);

				return;
			}
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				console.log("in Onload");
				console.log(reader);
				let parsedData;
				if (reader.result.startsWith("data:")) {
					console.log("in if check");
					console.log(reader.result);
					const match = reader.result
						.slice(0, 100)
						.match(/data:.*\/.*;base64,/);
					parsedData = match ? reader.result.slice(match[0].length) : "";
					console.log(parsedData);

					/* const parsedData = reader.result; */
				}
				console.log("parsed: ", parsedData);
				console.log("rr: ", reader.result);
				let newAttachment = new Attachment({
					...attachment,
					data: parsedData || reader.result,
					url: null,
					contentType: "image/jpeg",
				});
				console.log("newAtta: ", newAttachment);
				setAttributeBlockError(false);
				setAttributeBlockErrorMessage("");
				changeAttachment(newAttachment, attachment);
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
			<Box sx={{ display: "flex", gap: "1rem" }}>
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
				{errorMessage ? (
					<Typography color="error">{errorMessage}</Typography>
				) : null}
			</Box>
		);
	}
};

export default AttachmentInput;
