import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	CircularProgress,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	TextareaAutosize,
	Typography,
} from "@mui/material";
import PrefixTextField from "./PrefixTextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import SmallTextField from "../../components/styledComponents/SmallTextField";
import { useImmer } from "use-immer";
import { isObjectEmptyRecursive } from "../../utilities/formatting/fhirify";
import { manualRequest } from "../../utilities/querying/query";
import isValidJson from "../../utilities/formatting/parseJson";
import { getBasicAuthCreds } from "../../utilities/authentication/basicAuth";
import { SnackbarContext } from "../../utilities/other/Contexts";
const Request = () => {
	const [urlInput, setUrlInput] = useState("Patient");
	const [method, setMethod] = useState("GET");
	const [headers, setHeaders] = useImmer([
		{ header: "Content-type", value: "application/fhir+json" },
	]);
	const [textAreaInput, setTextAreaInput] = useState("");
	const [jsonError, setJsonError] = useState(false);
	const [methodError, setMethodError] = useState(false);
	const [response, setResponse] = useState(null);
	const [responseBody, setResponseBody] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const creds = getBasicAuthCreds();
		setHeaders((draft) => {
			draft.push({
				header: "Authorization",
				value: creds ? "Basic " + creds : "",
			});
		});
	}, []);

	useEffect(() => {
		async function getBody() {
			if (response && response.body) {
				let body = await response
					.json()
					.then((data) => JSON.stringify(data, null, 4));
				setResponseBody(body);
			}
		}
		getBody();
	}, [response]);

	useEffect(() => {
		if (!textAreaInput || textAreaInput.trim().length == 0) {
			setJsonError(false);
			setMethodError(false);
		} else {
			setMethodError(method == "GET" || method == "HEAD");
			if (!isValidJson(textAreaInput)) {
				setJsonError(true);
			} else setJsonError(false);
		}
	}, [textAreaInput]);

	useEffect(() => {
		if (
			textAreaInput.trim().length > 0 &&
			(method == "GET" || method == "HEAD")
		)
			setMethodError(true);
		else setMethodError(false);
	}, [method]);

	// needed for Snackbar display up the hirarchy
	const {
		snackbarOpen,
		setSnackbarOpen,
		snackbarColor,
		setSnackbarColor,
		snackbarMessage,
		setSnackbarMessage,
		snackbarTitle,
		setSnackbarTitle,
	} = React.useContext(SnackbarContext);

	return (
		<>
			<Typography variant="h6">Construct request</Typography>
			<Typography variant="body1">
				Here you can construct an HTTP request manually to see what the FHIR
				server response looks like. Resource payloads in the body are expected
				to be JSON.
			</Typography>
			<hr />
			<Box
				sx={{
					display: "flex",
					columnGap: "1rem",
				}}
			>
				<Grid container spacing={2}>
					<Grid container item spacing={2} sx={{ alignItems: "center" }}>
						<Grid item xs={2}>
							<Typography>URL:</Typography>
						</Grid>
						<Grid item xs={10}>
							<PrefixTextField
								prefix={process.env.REACT_APP_FHIRBASE}
								value={urlInput}
								onChange={(e) => {
									setUrlInput(e.target.value);
								}}
							/>
						</Grid>
					</Grid>
					<Grid container item spacing={2} sx={{ alignItems: "center" }}>
						<Grid item xs={2}>
							<Typography>Method:</Typography>
						</Grid>
						<Grid item xs={10}>
							<FormControl sx={{ minWidth: 120 }}>
								<InputLabel id="demo-simple-select-autowidth-label"></InputLabel>
								<Select
									labelId="demo-simple-select-autowidth-label"
									id="demo-simple-select-autowidth"
									value={method}
									onChange={(event) => {
										setMethod(event.target.value);
									}}
									autoWidth
									error={methodError}
								>
									<MenuItem value={"GET"}>GET</MenuItem>
									<MenuItem value={"POST"}>POST</MenuItem>
									<MenuItem value={"PUT"}>PUT</MenuItem>
									<MenuItem value={"DELETE"}>DELETE</MenuItem>
									<MenuItem value={"PATCH"}>PATCH</MenuItem>
								</Select>
							</FormControl>
							<FormHelperText error>
								{methodError ? "Request with GET/HEAD cannot have body" : ""}
							</FormHelperText>
						</Grid>
					</Grid>

					<Grid container item spacing={2} sx={{ alignItems: "center" }}>
						<Grid item xs={2}>
							<Typography>Headers:</Typography>
						</Grid>
						<Grid item xs={10}>
							<Stack>
								{headers.map((header, index) => (
									<Box
										key={index}
										sx={{
											display: "flex",
											alignItems: "center",
											columnGap: "5px",
										}}
									>
										<SmallTextField
											value={header.header}
											label="header"
											onChange={(e) => {
												const i = headers.indexOf(header);
												setHeaders((draft) => {
													draft[i].header = e.target.value;
												});
											}}
										/>{" "}
										<Typography sx={{ fontWeight: "700" }}>:</Typography>{" "}
										<SmallTextField
											value={header.value}
											label="value"
											onChange={(e) => {
												const i = headers.indexOf(header);
												setHeaders((draft) => {
													draft[i].value = e.target.value;
												});
											}}
										/>{" "}
										<IconButton
											variant="outlined"
											color="error"
											sx={{ marginY: "5px", width: "fit-content" }}
											size="medium"
											onClick={() => {
												setHeaders((draft) => {
													draft.splice(index, 1);
												});
											}}
										>
											<RemoveCircleOutlineIcon fontSize="medium" />
										</IconButton>
									</Box>
								))}
								<IconButton
									variant="outlined"
									color="primary"
									sx={{ marginY: "5px", width: "fit-content" }}
									size="medium"
									onClick={() => {
										setHeaders([...headers, { header: "", value: "" }]);
									}}
								>
									<AddCircleOutlineIcon fontSize="medium" />
								</IconButton>
							</Stack>
						</Grid>
					</Grid>

					<Grid container item spacing={2} sx={{ alignItems: "center" }}>
						<Grid item xs={2}>
							<Typography>Body:</Typography>
						</Grid>
						<Grid item xs={10}>
							<TextField
								multiline
								error={jsonError}
								rows={10}
								fullWidth
								value={textAreaInput}
								helperText={jsonError ? "Invalid JSON format" : ""}
								onChange={(e) => {
									setTextAreaInput(e.target.value);
								}}
								onKeyDown={(e) => {
									if (e.key === "Tab") {
										e.preventDefault();
										setTextAreaInput(textAreaInput + "\t");
									}
								}}
							/>
						</Grid>
					</Grid>
					<Grid
						item
						xs={12}
						sx={{
							justifyContent: "end",
							display: "flex",
						}}
					>
						<Button
							color="primary"
							variant="contained"
							sx={{ color: "white" }}
							disabled={jsonError || methodError}
							onClick={async () => {
								setLoading(true);
								let args = [
									process.env.REACT_APP_FHIRBASE + urlInput,
									method,
									headers,
								];
								if (textAreaInput.length > 0) args.push(textAreaInput);
								let resp;
								try {
									resp = await manualRequest(...args);
									setResponse(resp);
								} catch (error) {
									setSnackbarOpen(true);
									setSnackbarColor("error");
									setSnackbarMessage(error.message);
									setSnackbarTitle("Error");
									setResponse(null);
									setResponseBody("");
								}

								setLoading(false);
							}}
						>
							Submit
						</Button>
					</Grid>
				</Grid>

				<Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
					<Typography>
						Response status:{" "}
						<span>
							<b>
								{response
									? response.status == 401
										? response.status + " (Unauthenticated)"
										: response.status
									: ""}
							</b>
						</span>
					</Typography>
					<Typography>Response body:</Typography>
					<Box height={"100%"}>
						{loading ? (
							<CircularProgress
								sx={{
									position: "relative",
									top: "50%",
									left: "50%",
								}}
							/>
						) : null}
						<TextField
							multiline
							sx={{ height: "100%" }}
							minRows={20}
							maxRows={30}
							inputProps={{
								style: {
									overflowX: "scroll",
									whiteSpace: "pre",
									height: "100%",
								},
							}}
							InputProps={{
								style: { height: "100%" },
							}}
							fullWidth
							value={responseBody || ""}
							onChange={(e) => {
								setTextAreaInput(e.target.value);
							}}
							disabled
							onKeyDown={(e) => {
								if (e.key === "Tab") {
									e.preventDefault();
									setTextAreaInput(textAreaInput + "\t");
								}
							}}
						/>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default Request;
