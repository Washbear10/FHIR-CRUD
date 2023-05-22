import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { HumanName } from "../../classes/dataTypes/HumanName";

import { Grid } from "@mui/material";
import Subcomponent from "../common/Subcomponent";
import CodeInput from "../primitiveInputs/CodeInput";
import PeriodInput from "../primitiveInputs/PeriodInput";
import SmallTextField from "../styledComponents/SmallTextField";
import { nameUse } from "../../utilities/valueSets/valueSets";

const HumanNameInput = ({ name, changeSingleName }) => {
	// Section for checking validity of inputs
	//
	const [errorMessage, setErrorMessage] = useState("");
	const wasMounted = useRef(false);
	useEffect(() => {
		if (!wasMounted) {
			wasMounted.current = true;
			return;
		}
		checkValidity();
	}, [name]);
	const checkValidity = () => {
		console.log("checking valdity for name: ", name);
		if (name.text == "") {
			setErrorMessage("");
		}
		if (name.text) {
			let notIncludingText = false;
			let textSplit = name.text.replace(/[^a-zA-Z0-9]/g, " ").split(" ");
			console.log(textSplit);
			let arr = [];
			arr.push(name.use);
			arr.push(name.family);
			arr.push(...name.given);
			arr.push(...name.prefix);
			arr.push(...name.suffix);
			const stringified = String(arr);
			textSplit.forEach((word) => {
				console.log(stringified);
				if (!stringified.toLowerCase().includes(word.toLowerCase())) {
					notIncludingText = true;
				}
			});
			if (notIncludingText) {
				setErrorMessage(
					"It is recommended that the text representation should contain no information that is not also found in the single parts of the name."
				);
			} else {
				setErrorMessage("");
			}
		}
	};

	// Section for handling changing data
	//
	const changeSingleGiven = (oldGivenIndex, newGiven) => {
		let newGivens = [...name.given];
		newGivens[oldGivenIndex] = newGiven;
		let newHumanName = new HumanName({
			...name,
			given: newGivens,
		});

		changeSingleName(newHumanName, name);
	};

	const addGiven = () => {
		if (name.given) {
			if (!name.given.includes("")) {
				let newHumanName = new HumanName({
					...name,
					given: [...name.given, ""],
				});
				changeSingleName(newHumanName, name);
			}
		}
	};

	const removeEmptyGivens = () => {
		let newGivens = name.given.filter((item) => item != "");
		if (newGivens.length == 0) newGivens = [""];
		let newHumanName = new HumanName({
			...name,
			given: newGivens,
		});
		changeSingleName(newHumanName, name);
	};
	const changeSinglePrefix = (oldPrefixIndex, newPrefix) => {
		let newPrefixes = [...name.prefix];
		newPrefixes[oldPrefixIndex] = newPrefix;
		let newHumanName = new HumanName({
			...name,
			prefix: newPrefixes,
		});

		changeSingleName(newHumanName, name);
	};
	const addPrefix = () => {
		if (name.prefix) {
			if (!name.prefix.includes("")) {
				let newHumanName = new HumanName({
					...name,
					prefix: [...name.prefix, ""],
				});
				changeSingleName(newHumanName, name);
			}
		}
	};
	const removeEmptyPrefixes = () => {
		let newPrefixes = name.prefix.filter((item) => item != "");
		if (newPrefixes.length == 0) newPrefixes = [""];

		let newHumanName = new HumanName({
			...name,
			prefix: newPrefixes,
		});
		changeSingleName(newHumanName, name);
	};

	const changeSingleSuffix = (oldSuffixIndex, newSuffix) => {
		let newSuffixes = [...name.suffix];
		newSuffixes[oldSuffixIndex] = newSuffix;
		let newHumanName = new HumanName({
			...name,
			suffix: newSuffixes,
		});
		changeSingleName(newHumanName, name);
	};
	const addSuffix = () => {
		if (name && name.suffix) {
			if (!name.suffix.includes("")) {
				let newHumanName = new HumanName({
					...name,
					suffix: [...name.suffix, ""],
				});
				changeSingleName(newHumanName, name);
			}
		}
	};

	const removeEmptySuffixes = () => {
		let newSuffixes = name.suffix.filter((item) => item != "");
		if (newSuffixes.length == 0) newSuffixes = [""];
		let newHumanName = new HumanName({
			...name,
			suffix: newSuffixes,
		});
		changeSingleName(newHumanName, name);
	};

	const handleChangeUse = (value) => {
		let newHumanName = new HumanName({
			...name,
			use: value == "" ? null : value,
		});
		changeSingleName(newHumanName, name);
	};

	const handleChangeFamily = (value) => {
		let newHumanName = new HumanName({
			...name,
			family: value.target.value,
		});
		changeSingleName(newHumanName, name);
	};
	const handleChangeText = (value) => {
		let newHumanName = new HumanName({
			...name,
			text: value.target.value,
		});
		changeSingleName(newHumanName, name);
	};

	const handleChangePeriod = (newValue) => {
		let newHumanName = new HumanName({
			...name,
			period: newValue,
		});
		changeSingleName(newHumanName, name);
	};

	// render Section
	//
	return (
		<>
			<Box>
				{errorMessage ? (
					<Box sx={{ display: "flex", maxWidth: "100%", height: "20%" }}>
						<ErrorOutlineIcon
							color="warning"
							sx={{ marginLeft: "1rem", marginBottom: "-5px" }}
						/>
						<Typography color="warning.main" sx={{ marginLeft: "1rem" }}>
							{errorMessage}
						</Typography>
					</Box>
				) : null}
			</Box>
			<Grid
				container
				spacing="15px"
				justifyContent={"space-between"}
				sx={{ width: "100%" }}
			>
				<Grid
					item
					xs={6}
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: "10px",
						alignItems: "start",
						justifyContent: "center",
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							gap: "10px",
							alignItems: "center",
							justifyContent: "start",
							maxWidth: "100%",
						}}
					>
						<CodeInput
							values={nameUse}
							v={name ? name.use || null : null}
							label="use"
							changeInput={handleChangeUse}
							width="150px"
						/>
						<Box
							sx={{ display: "flex", flexDirection: "row", maxWidth: "50%" }}
						>
							{name.given
								? name.given
										.map((given, index) => {
											return { given: given, index: index };
										})
										.map((g) => {
											return (
												<SmallTextField
													className="givenInput"
													value={g.given}
													label="Given Name"
													/* autoFocus={!g.given && g.key === name.given.length - 1} */
													onChange={(event) => {
														changeSingleGiven(g.index, event.target.value);
													}}
													key={g.index}
													onBlur={(e) => {
														if (
															g.given == "" ||
															e.relatedTarget == null ||
															!e.relatedTarget.closest(".givenInput")
														)
															removeEmptyGivens();
													}}
													width="250px"
												/>
											);
										})
								: null}
							<Tooltip title={"Add given"} arrow>
								<IconButton
									variant="outlined"
									color="primary"
									onClick={addGiven}
									sx={{ marginY: "5px" }}
									size="small"
									disabled={!name.given || name.given.includes("")}
								>
									<AddCircleOutlineIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						</Box>
						<SmallTextField
							value={name.family || ""}
							label="family name"
							onChange={handleChangeFamily}
							width="250px"
						/>
					</Box>

					<Box
						sx={{
							display: "flex",
							flexDirection: "row",
							gap: "10px",
							alignItems: "center",
							maxWidth: "100%",
						}}
					>
						<Box
							sx={{ display: "flex", flexDirection: "row", maxWidth: "50%" }}
						>
							{name.prefix
								? name.prefix
										.map((prefix, index) => {
											return { prefix: prefix, key: index };
										})
										.map((pf) => (
											<SmallTextField
												className="prefixInput"
												value={pf.prefix}
												key={pf.key}
												label="Prefix"
												/* autoFocus={
												!pf.prefix && pf.key === name.prefix.length - 1
											} */
												onChange={(event) => {
													changeSinglePrefix(pf.key, event.target.value);
												}}
												onBlur={(e) => {
													if (
														pf.prefix == "" ||
														e.relatedTarget == null ||
														!e.relatedTarget.closest(".prefixInput")
													)
														removeEmptyPrefixes();
												}}
												width="100px"
											/>
										))
								: null}
							<IconButton
								variant="outlined"
								color="primary"
								sx={{ marginY: "5px" }}
								size="small"
								onClick={addPrefix}
								disabled={!name.prefix || name.prefix.includes("")}
							>
								<AddCircleOutlineIcon fontSize="small" />
							</IconButton>{" "}
						</Box>

						<Box
							sx={{ display: "flex", flexDirection: "row", maxWidth: "50%" }}
						>
							{name.suffix
								? name.suffix
										.map((suffix, index) => {
											return { suffix: suffix, key: index };
										})
										.map((sf) => (
											<SmallTextField
												className="suffixInput"
												value={sf.suffix}
												key={sf.key}
												/* autoFocus={
												!sf.suffix &&
												sf.key === name.suffix.length - 1 &&
												initiallyRendered
											} */
												label="Suffix"
												onChange={(event) => {
													changeSingleSuffix(sf.key, event.target.value);
												}}
												onBlur={(e) => {
													if (
														sf.suffix == "" ||
														e.relatedTarget == null ||
														!e.relatedTarget.closest(".suffixInput")
													)
														removeEmptySuffixes();
												}}
												width="100px"
											/>
										))
								: null}
							<IconButton
								variant="outlined"
								color="primary"
								onClick={addSuffix}
								sx={{ marginY: "5px" }}
								size="small"
								disabled={!name.suffix || name.suffix.includes("")}
							>
								<AddCircleOutlineIcon fontSize="small" />
							</IconButton>
						</Box>
						<SmallTextField
							value={name.text || ""}
							label="Text"
							onChange={handleChangeText}
							width="400px"
						/>
					</Box>
				</Grid>
				<Grid item xs={6} sx={{ maxWidth: "100%" }}>
					<Subcomponent
						title="Period"
						description={"(from when to when this name was/is active)"}
					>
						<PeriodInput
							period={name.period}
							changePeriod={handleChangePeriod}
						/>
					</Subcomponent>
				</Grid>
			</Grid>
		</>
	);
};

export default HumanNameInput;

/* function areEqual(prev, next) {
	return prev.name == next.name;
}
export default memo(HumanNameInput, areEqual); */
