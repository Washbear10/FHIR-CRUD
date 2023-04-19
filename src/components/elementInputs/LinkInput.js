import React from "react";
import Link from "../../classes/dataTypes/Link";
import CodeInput from "../primitiveInputs/CodeInput";
import ReferenceInput from "./ReferenceInput";
import { Box } from "@mui/system";

const codeValues = ["replaced-by", "replaces", "refer", "seealso"];
const LinkInput = ({ link, changeLink }) => {
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
				/>
			</Box>
			<CodeInput
				values={codeValues}
				v={link.type}
				label="Type"
				changeInput={handleChangeType}
			/>
		</Box>
	);
};

export default LinkInput;
