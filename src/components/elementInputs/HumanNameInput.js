import { TextField, Tooltip, Typography } from "@mui/material";
import React, { memo, useRef } from "react";
import { Box } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Period from "../../classes/dataTypes/Period";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, IconButton } from "@mui/material";
import { HumanName } from "../../classes/dataTypes/HumanName";

import dayjs from "dayjs";
import DateTabs from "../common/DateTabs";
import { getDateTimeParts } from "../../utilities/parseDateTime";
import CodeInput from "../primitiveInputs/CodeInput";
import SmallTextField from "../styledComponents/SmallTextField";
import { Grid } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Subcomponent from "../common/Subcomponent";
import { Stack } from "@mui/system";
import PeriodInput from "../primitiveInputs/PeriodInput";

const HumanNameInput = ({ name, changeSingleName }) => {
	const initiallyRendered = useRef(false);

	useEffect(() => {
		initiallyRendered.current = true;
	}, []);

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

	return (
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
						values={[
							"usual",
							"official",
							"temp",
							"nickname",
							"anonymous",
							"old",
							"maiden",
						]}
						v={name ? name.use || null : null}
						label="use"
						changeInput={handleChangeUse}
						width="150px"
					/>
					<Box sx={{ display: "flex", flexDirection: "row", maxWidth: "50%" }}>
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
						<IconButton
							variant="outlined"
							color="primary"
							onClick={addGiven}
							sx={{ marginY: "5px" }}
							size="small"
							disabled={!name.given || name.given.includes("")}
						>
							<AddCircleOutlineIcon fontSize="small" />
						</IconButton>{" "}
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
					<Box sx={{ display: "flex", flexDirection: "row", maxWidth: "50%" }}>
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

					<Box sx={{ display: "flex", flexDirection: "row", maxWidth: "50%" }}>
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
					<PeriodInput period={name.period} changePeriod={handleChangePeriod} />
				</Subcomponent>
			</Grid>
		</Grid>
	);
};

export default HumanNameInput;

/* function areEqual(prev, next) {
	return prev.name == next.name;
}
export default memo(HumanNameInput, areEqual); */
