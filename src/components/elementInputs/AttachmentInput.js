import { Box, Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Attachment from "../../classes/dataTypes/Attachment";
import { AttributeBlockErrorContext } from "../../utilities/other/Contexts";
import { getAttachment } from "../../utilities/querying/query";

/**
 * Component for displaying and uploading files.
 * This is the only element input component that is specified to the resource it is contained it (Currently Patient). Some adjustments will have to be made to make this
 * universally reusable for other contexts.
 * @param {*} photoSizeSum the sum of all Photos currently contained within the resource. Used to disable further uploads if maximum photo size sum is exceeded (for connective
 * performance reasons -> takes very long to upload.)
 */
const AttachmentInput = ({ attachment, changeAttachment, photoSizeSum }) => {
	// JS Image object
	const [displayImage, setDisplayImage] = useState(null);

	// error values
	const {
		attributeBlockError,
		setAttributeBlockError,
		attributeBlockErrorMessage,
		setAttributeBlockErrorMessage,
	} = useContext(AttributeBlockErrorContext);
	const [errorMessage, setErrorMessage] = useState("");

	// whenever attachment for this component changes, make an Image out of it and store in state
	useEffect(() => {
		if (attachment.data) {
			// case image received as base64 data
			makeImage(attachment.data).then((image) => {
				setDisplayImage(image);
			});
		} else if (attachment.url) {
			// case image received as url

			// make request
			getAttachment(attachment.url)
				.then((response) => {
					return response.blob();
				})
				.then((blob) => {
					const reader = new FileReader();
					reader.readAsDataURL(blob);

					reader.onload = () => {
						// remove datatype prefix if existing
						const parsedData = reader.result.replace(/data:.*\/.*;base64,/, "");
						/* const parsedData = reader.result; */

						// make image out of it and set to state
						makeImage(parsedData).then((image) => {
							setDisplayImage(image);
						});
					};
				});
		}
	}, [attachment]);

	// helper function to create an image Object out of base64 data
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
				// limit due to performance reasons
				setErrorMessage(
					`Files exceed maximum size (${
						process.env.REACT_APP_MAX_ATTACHMENT_SIZE / 1000000
					}MB in total). Please remove or compress some files in order to add more.`
				);

				return;
			}
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				let parsedData;
				if (reader.result.startsWith("data:")) {
					// remove preamble, sliced to 100 to avoid parcing entire string
					const match = reader.result
						.slice(0, 100)
						.match(/data:.*\/.*;base64,/);
					parsedData = match ? reader.result.slice(match[0].length) : "";
				}
				let newAttachment = new Attachment({
					...attachment,
					data: parsedData || reader.result, // if data was received raw, without preamble, just take the read data
					url: null,
					contentType: "image/jpeg",
				});
				changeAttachment(newAttachment, attachment);
			};
		}
	};

	// render section:

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
