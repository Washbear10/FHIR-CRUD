import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "../../classes/dataTypes/Link";
import CodeInput from "../primitiveInputs/CodeInput";
import ReferenceInput from "./ReferenceInput";
import { Box } from "@mui/system";
import { isObjectEmptyRecursive } from "../../utilities/fhirify";
import { AttributeBlockErrorContext } from "../../utilities/AttributeBlockErrorContext";

const codeValues = ["replaced-by", "replaces", "refer", "seealso"];
const LinkInput = ({ link, changeLink }) => {
	const [errorMessage, setErrorMessage] = useState("");

	const { attributeBlockError, setAttributeBlockError } = useContext(
		AttributeBlockErrorContext
	);

	const wasMounted = useRef(false);
	useEffect(() => {
		if (wasMounted) checkInputValidity();
		else wasMounted.current = true;
	}, [link]);

	const checkInputValidity = () => {
		if (
			(link.type && isObjectEmptyRecursive(link.other)) ||
			(!isObjectEmptyRecursive(link.other) && !link.type)
		) {
			setAttributeBlockError(true);
			setErrorMessage("Both type and Patient reference must be supplied.");
		} else {
			setAttributeBlockError(false);
			setErrorMessage("");
		}
	};

	const handleChangeType = (newValue) => {
		let newLink = new Link({ ...link, type: newValue });
		changeLink(newLink, link);
	};
	const handleChangeOther = (newValue) => {
		let newLink = new Link({ ...link, other: newValue });
		changeLink(newLink, link);
	};
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
					error={attributeBlockError}
					helperText={errorMessage}
				/>
			</Box>
			<CodeInput
				values={codeValues}
				v={link.type}
				label="Type"
				changeInput={handleChangeType}
				error={attributeBlockError}
				helperText={errorMessage}
			/>
		</Box>
	);
};

export default LinkInput;
