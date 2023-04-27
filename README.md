## About this application

### Purpose

This application was developed as part of a bachelor thesis for the Chair of IT Infrastructure for Translational Medical Research (MiSiT) of the University of Augsburg. The primary aim of this software is to offer a graphical user interface for displaying, editing, creating and deleting resources stored by the chair's FHIR server ("LinuxForHealth FHIR Server") for the purpose of supporting research and education conducted by the chair.

### Legal notice

As part of a scientific bachelor's project, any documents and source code related to this software are open source and are not subject to copyright. Regarding usage of this software, no guarantees are made to safety or security of the system, nor integrity of the data the system processes. Therefore it is not intended for any application beyond it's stated use in the above section. Neither the developer, maintainer nor the institution hosting this application are responsible for any consequences that may arise from using it.

### Documentation

A github repository was/is maintained for version control. The final paper and access to the source code repository can be requested at the Chair of IT Infrastructure for Translational Medical Research (MiSiT).

### Notes

This section describes points that are relevant to further development and use in production.

- #### Installation

  A Dockerfile is provided in the root directory which can be used to build an Image by running `docker build -t [imagename:tag] .` from within the root directory. Alternatively, you can install node.js and the required packages via `npm ci` and run the server with `npm start`. Environment variables from the Dockerfile must be supplied to that process.

  Note that in order to change environment variables used by the dockerized app (such as the Fhir server base location), these have to be set in the dockerfile and the image has to be rebuilt. (Reason for this is that the application is bundled with webpack and code and variables are made static at npm build time.)

- #### Framework
  - The only resource type supported is the basic "Patient" type as it is specified in the R4 version of the FHIR standard. Any extensions to that specification are not supported.
  - The technologies used include Javascript, HTML, CSS, Github, Material UI v5 ,MUI X v5 and React version 18.2.
  - The interface and queries/requests made are tailored to the implementation of IBM's "LinuxForHealth FHIR Server" and tested against version 4.11.1 of it's docker image.
- #### Features
  - Reusable components for all elements and datatypes contained in the standard definition of the "Patient" resource type exist. Those can be utilized with no or little modification when other resource types are added.
  - Authentication to access the website is not required, however making use of settings/CRUD functionality will require the production FHIR server's HTTP Basic Auth credentials.
  - Main features include
    - Searching Patients by name
    - Creating new resources
    - Deleting (multiple) resources
    - Editing any value of a resource
- #### Requirements and Limitations
  As mentioned before, this application only works out-of-the-box with IBM's LinuxForHealth FHIR implementation. When switching to another implementation of the API, certain things have to be taken note of:
  - Due to performance aspects, editing a resource works by issueing a single HTTP PATCH request with a list of change operations, so the API must support PATCH methods.
  - The IBM version by default does not allow the PATCH operation on any resource (allthough it should, according to it's documentation), so it will have to be activated by editing the server.xml configuration file (see https://linuxforhealth.github.io/FHIR/guides/FHIRServerUsersGuide#31-liberty-server-configuration)
  - The search functionality works by applying the search parameter modifier "contains" on the name attribute of "Patient". Other parameters can be added in the source code that fit the resources searched to improve effectivenes of this feature. However, at the time of writing the IBM server does not support a lot of basic parameters defined by the R4 standard (like \_filter, text), which is why searching will (for now) be restricted to patients' names.
  - Changing authentication credentials on the server does not change the behavior of the application. Changing the method of authentication (e.g. from Basic Auth to OAuth2) will require some changes to the code base.
  - The interface is optimized for larger screens (Desktop/Laptop/Tablet). It is not intended to be used on devices with small screens.
    As the aim for this application is to serve as an interface for making smaller changes for the chair's FHIR server and not to be used in a clinical setting with thousands of records, performance issues might be experienced when working with large datasets.

(Last updated at the time of release/publication)
