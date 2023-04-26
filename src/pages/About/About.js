import React from "react";
import { Box } from "@mui/system";
import { List, ListItem, Typography } from "@mui/material";
const About = () => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Typography variant="h5">About this application</Typography>
			<br></br>
			<Typography variant="body1">
				<b>Purpose</b>
			</Typography>
			<Typography variant="body2" paragraph>
				This application was developed as part of a bachelor thesis for the
				Chair of IT Infrastructure for Translational Medical Research (MiSiT) of
				the University of Augsburg. The primary aim of this software is to offer
				a graphical user interface for displaying, editing, creating and
				deleting resources stored by the chair's FHIR server ("LinuxForHealth
				FHIR Server") for the purpose of supporting research and education
				conducted by the chair.
			</Typography>
			<Typography variant="body1">
				<b>Legal notice</b>
			</Typography>
			<Typography variant="body2" paragraph>
				As part of a scientific bachelor's project, any documents and source
				code related to this software are open source and are not subject to
				copyright. Regarding usage of this software, no guarantees are made to
				safety or security of the system, nor integrity of the data the system
				processes. Therefore it is not intended for any application beyond it's
				stated use in the above section. Neither the developer, maintainer nor
				the institution hosting this application are responsible for any
				consequences that may arise from using it.
			</Typography>
			<Typography variant="body1">
				<b>Documentation</b>
			</Typography>
			<Typography variant="body2" paragraph>
				A github repository was/is maintained for version control. The final
				paper and access to the source code repository can be requested at the
				Chair of IT Infrastructure for Translational Medical Research (MiSiT).
			</Typography>
			<Typography variant="body1">
				<b>Notes</b>
			</Typography>
			<Typography variant="body2" paragraph>
				This section describes points that are relevant to further development
				and use in production.
				<Box sx={{ width: "100%", px: "2rem", paddingTop: "1rem" }}>
					<Box>
						<Typography variant="subtitle1">Framework</Typography>
						<List sx={{ listStyleType: "disc", pl: 4 }}>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								The only resource type supported is the basic "Patient" type as
								it is specified in the R4 version of the FHIR standard. Any
								extensions to that specification are not supported.
							</ListItem>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								The technologies used include Javascript, HTML, CSS, Github,{" "}
								<a href="https://v5.mui.com">Material UI v5</a> ,
								<a href="https://mui.com/x/">MUI X v5</a> and{" "}
								<a href="https://legacy.reactjs.org/versions/">
									React version 18.2
								</a>
								.
							</ListItem>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								The interface and queries/requests made are tailored to the
								implementation of{" "}
								<a href="https://linuxforhealth.github.io/FHIR/">
									IBM's "LinuxForHealth FHIR Server"
								</a>{" "}
								and tested against{" "}
								<a href="https://hub.docker.com/r/ibmcom/ibm-fhir-server/tags">
									version 4.11.1 of it's docker image
								</a>
								.
							</ListItem>
						</List>
						<Typography variant="subtitle1">Features</Typography>
						<List sx={{ listStyleType: "disc", pl: 4 }}>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								Reusable components for all elements and datatypes contained in
								the standard definition of the "Patient" resource type exist.
								Those can be utilized with no or little modification when other
								resource types are added.
							</ListItem>

							<ListItem sx={{ display: "list-item" }} disablePadding>
								Authentication to access the website is not required, however
								making use of settings/CRUD functionality will require the
								production FHIR server's HTTP Basic Auth credentials.
							</ListItem>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								Main features include
								<List sx={{ listStyleType: "disc", pl: 4 }}>
									<ListItem sx={{ display: "list-item" }}>
										searching Patients by name
									</ListItem>
									<ListItem sx={{ display: "list-item" }}>
										deleting (multiple) resources
									</ListItem>
									<ListItem sx={{ display: "list-item" }}>
										editing any value of a resource
									</ListItem>
									<ListItem sx={{ display: "list-item" }}>
										limiting the number of records returned
									</ListItem>
								</List>
							</ListItem>
						</List>
					</Box>
				</Box>
				(Last updated at the time of release/publication)
			</Typography>
		</Box>
	);
};

export default About;
