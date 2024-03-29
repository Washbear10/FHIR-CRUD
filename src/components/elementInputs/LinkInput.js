import { Box } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "../../classes/dataTypes/backboneElements/Patient/Link";
import { isObjectEmptyRecursive } from "../../utilities/formatting/fhirify";
import { AttributeBlockErrorContext } from "../../utilities/other/Contexts";
import CodeInput from "../primitiveInputs/CodeInput";
import ReferenceInput from "./ReferenceInput";
import { linkType } from "../../utilities/valueSets/valueSets";

const LinkInput = ({ link, changeLink }) => {
	// Section for checking validity of inputs
	//
	const [errorMessage, setErrorMessage] = useState("");
	const {
		attributeBlockError,
		setAttributeBlockError,
		attributeBlockErrorMessage,
		setAttributeBlockErrorMessage,
	} = useContext(AttributeBlockErrorContext);
	const wasMounted = useRef(false);
	useEffect(() => {
		if (!wasMounted) {
			wasMounted.current = true;
			return;
		}
		checkValidity();
	}, [link]);

	const checkValidity = () => {
		// checks if constraints of Resource / element are adhered to
		if (link.type && isObjectEmptyRecursive(link.other)) {
			setAttributeBlockError(true);
			setAttributeBlockErrorMessage(
				"Choose a resource this reference refers to."
			);
			setErrorMessage("Both type and Patient reference must be supplied.");
		} else if (!isObjectEmptyRecursive(link.other) && !link.type) {
			setAttributeBlockError(true);
			setAttributeBlockErrorMessage("Choose the type of this reference.");
			setErrorMessage("Both type and Patient reference must be supplied.");
		} else {
			setAttributeBlockError(false);
			setAttributeBlockErrorMessage("");

			setErrorMessage("");
		}
	};

	// Section for handling data changes
	//
	const handleChangeType = (newValue) => {
		let newLink = new Link({ ...link, type: newValue });
		changeLink(newLink, link);
	};
	const handleChangeOther = (newValue) => {
		setAttributeBlockError(false);
		setAttributeBlockErrorMessage("");
		setErrorMessage("");
		let newLink = new Link({ ...link, other: newValue });
		if (!newValue || !newValue.reference) newLink.type = null;

		changeLink(newLink, link);
	};

	// render Section
	//
	return (
		<Box sx={{ display: "flex", gap: "20px", flexDirection: "column" }}>
			<Box sx={{ width: "500px" }}>
				<ReferenceInput
					reference={link.other}
					changeReference={handleChangeOther}
					referenceOptions={{
						Patient: {
							//displayAttribute: "name",
							calculateDisplayAttribute: (jsonResource) => {
								let s = "";
								if (jsonResource.name) {
									/* jsonResource.name.forEach((singleName) => {
										s += singleName.family ? singleName.family : "";
										s += singleName.given
											? ", " + singleName.given.join(" ")
											: "";

										s += ";";
									}); */
									let names = jsonResource.name.map((singleName) => {
										let s1 = "";
										if (singleName.prefix)
											singleName.prefix.forEach((pf) => {
												s1 += pf + " ";
											});
										if (singleName.family) s1 += singleName.family;
										s1 = s1.trim();
										let s3 = "";
										if (singleName.given)
											s3 += singleName.given.reduce(
												(acc, curr) => acc + " " + curr,
												""
											);
										s3 = s3.trim();
										let final = [s1, s3].filter((item) => item).join(", ");
										return final;
									});
									return names.find((item) => item);
								} else {
									s = "(Unnamed)";
								}
								return s;
							},
							paramsAndModifiers: ["name:contains"],
						},
						RelatedPerson: {
							//displayAttribute: "name",
							calculateDisplayAttribute: (jsonResource) => {
								let s = "";
								if (jsonResource.name) {
									jsonResource.name.forEach((singleName) => {
										s +=
											singleName.given.join(" ") +
											+(singleName.family ? ", " + singleName.family : "");
										s += ";";
									});
								} else {
									s = "(Unnamed)";
								}
								return s;
							},
							paramsAndModifiers: ["name:contains"],
						},
					}}
					error={attributeBlockError ? 1 : 0}
					helpertext={errorMessage}
				/>
			</Box>
			<CodeInput
				values={linkType}
				v={link.type}
				label="Type"
				changeInput={handleChangeType}
				error={errorMessage ? 1 : 0}
				helpertext={errorMessage}
			/>
		</Box>
	);
};

export default LinkInput;
