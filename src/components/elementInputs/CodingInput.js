import { Box } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import Coding from "../../classes/dataTypes/Coding";
import { isObjectEmptyRecursive } from "../../utilities/formatting/fhirify";
import { AttributeBlockErrorContext } from "../../utilities/other/Contexts";
import BooleanInput from "../primitiveInputs/BooleanInput";
import CodeInput from "../primitiveInputs/CodeInput";
import SmallTextField from "../styledComponents/SmallTextField";
const CodingInput = ({
	coding,
	changeCoding,
	defaultSystem,
	systemUneditable,
	systemValueCombinationRequired,
	bindingCodes,
}) => {
	// Error display section
	const [errorMessage, setErrorMessage] = useState("");
	const {
		attributeBlockError,
		setAttributeBlockError,
		attributeBlockErrorMessage,
		setAttributeBlockErrorMessage,
	} = useContext(AttributeBlockErrorContext);

	// Section for checking validity of inputs
	//
	const wasMounted = useRef(false);
	useEffect(() => {
		if (!wasMounted) {
			// disable check on mounting
			wasMounted.current = true;
			return;
		}
		if (
			systemValueCombinationRequired &&
			!coding.system &&
			!coding.value &&
			!isObjectEmptyRecursive(coding)
		) {
			setErrorMessage("System and value must be supplied together.");
		} else {
			setErrorMessage("");
		}
	}, [coding]);

	// Section for handling changing data
	//
	const handleChangeSystem = (newValue) => {
		let newCoding = new Coding({ ...coding, system: newValue });
		changeCoding(newCoding, coding);
	};
	const handleChangeVersion = (newValue) => {
		let newCoding = new Coding({ ...coding, version: newValue });
		changeCoding(newCoding, coding);
	};
	const handleChangeCode = (newValue) => {
		let newCoding;
		if (!newValue) {
			newCoding = new Coding({
				...coding,
				code: null,
				system: null,
			});
		} else if (coding.system == null && defaultSystem) {
			newCoding = new Coding({
				...coding,
				code: newValue,
				system: defaultSystem,
			});
		} else newCoding = new Coding({ ...coding, code: newValue });
		changeCoding(newCoding, coding);
	};
	const handleChangeDisplay = (newValue) => {
		let newCoding = new Coding({
			...coding,
			display: newValue,
		});
		changeCoding(newCoding, coding);
	};
	const handleChangeUserSelected = (newValue) => {
		let value = typeof newValue === "boolean" ? newValue : null;
		let newCoding = new Coding({
			...coding,
			userSelected: value,
		});
		changeCoding(newCoding, coding);
	};

	// render Section
	//
	return (
		<Box sx={{ display: "flex", columnGap: "5px" }}>
			<SmallTextField
				value={
					coding.system !== null && coding.system !== undefined
						? coding.system
						: defaultSystem
						? defaultSystem
						: ""
				}
				label="system"
				disabled={systemUneditable}
				onChange={(e) => {
					handleChangeSystem(e.target.value);
				}}
				className="systemInput"
				error={errorMessage && !systemUneditable ? 1 : 0}
				helperText={errorMessage && !systemUneditable ? errorMessage : null}
			/>

			{bindingCodes ? (
				// if codes from valueSet supplied, show Autocomplete, else freetext
				<CodeInput
					v={coding.code}
					values={bindingCodes}
					changeInput={(newValue) => {
						handleChangeCode(newValue);
					}}
					label={"code"}
					clearOnBlur={true}
					error={errorMessage ? 1 : 0}
					helpertext={errorMessage}
				/>
			) : (
				<SmallTextField
					value={coding.code ? coding.code : ""}
					label="code"
					onChange={(e) => {
						handleChangeCode(e.target.value);
					}}
					className="codeInput"
					error={errorMessage ? 1 : 0}
					helpertext={errorMessage}
				/>
			)}

			<SmallTextField
				value={coding.version ? coding.version : ""}
				label="version"
				onChange={(e) => {
					handleChangeVersion(e.target.value);
				}}
				className="versionInput"
			/>
			<SmallTextField
				value={coding.display ? coding.display : ""}
				label="display"
				onChange={(e) => {
					handleChangeDisplay(e.target.value);
				}}
				className="displayInput"
			/>
			<BooleanInput
				checked={
					coding ? (coding.userSelected ? coding.userSelected : null) : null
				}
				title="userSelected"
				changeChecked={handleChangeUserSelected}
			/>
		</Box>
	);
};

export default CodingInput;
