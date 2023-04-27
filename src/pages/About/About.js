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
										Searching Patients by name
									</ListItem>
									<ListItem sx={{ display: "list-item" }}>
										Creating new resources
									</ListItem>
									<ListItem sx={{ display: "list-item" }}>
										Deleting (multiple) resources
									</ListItem>
									<ListItem sx={{ display: "list-item" }}>
										Editing any value of a resource
									</ListItem>
								</List>
							</ListItem>
						</List>
						<Typography variant="subtitle1">
							Requirements and Limitations
						</Typography>
						<List sx={{ listStyleType: "disc", pl: 4 }}>
							As mentioned before, this application only works out-of-the-box
							with IBM's LinuxForHealth FHIR implementation. When switching to
							another implementation of the API, certain things have to be taken
							note of:
							<ListItem sx={{ display: "list-item" }} disablePadding>
								Due to performance aspects, editing a resource works by issueing
								a single HTTP PATCH request with a list of change operations, so
								the API must support PATCH methods.
							</ListItem>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								The IBM version by default does not allow the PATCH operation on
								any resource (allthough it should, according to it's
								documentation), so it will have to be activated by editing the{" "}
								<i>server.xml</i> configuration file (see{" "}
								<a href="https://linuxforhealth.github.io/FHIR/guides/FHIRServerUsersGuide#31-liberty-server-configuration">
									https://linuxforhealth.github.io/FHIR/guides/FHIRServerUsersGuide#31-liberty-server-configuration
								</a>
								)
							</ListItem>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								The search functionality works by applying the{" "}
								<a href="https://build.fhir.org/search.html#modifiers">
									search parameter modifier
								</a>{" "}
								"contains" on the name attribute of "Patient". Other parameters
								can be added in the source code that fit the resources searched
								to improve effectivenes of this feature. However, at the time of
								writing the IBM server does not support a lot of basic
								parameters defined by the R4 standard (like _filter, text),
								which is why searching will (for now) be restricted to patients'
								names.
							</ListItem>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								Changing authentication credentials on the server does not
								change the behavior of the application. Changing the method of
								authentication (e.g. from Basic Auth to OAuth2) will require
								some changes to the code base.
							</ListItem>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								The interface is optimized for larger screens
								(Desktop/Laptop/Tablet). It is not intended to be used on
								devices with small screens.
							</ListItem>
							<ListItem sx={{ display: "list-item" }} disablePadding>
								As the aim for this application is to serve as an interface for
								making smaller changes for the chair's FHIR server and not to be
								used in a clinical setting with thousands of records,
								performance issues might be experienced when working with large
								datasets.
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
