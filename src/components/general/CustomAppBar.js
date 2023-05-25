import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import HelpIcon from "@mui/icons-material/Help";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../../utilities/other/Contexts";
import Link from "@mui/material/Link";
import CircleIcon from "@mui/icons-material/Circle";
import { checkOnline } from "../../utilities/querying/query";
import { useState, useEffect } from "react";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import logo from "../../static/logo.png";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { getBasicAuthCreds } from "../../utilities/authentication/basicAuth";
const drawerWidth = 240;
const titleBarHeight = 60;

/**
 * Top-level component to render any Page within a scaffold and a Menubar
 * @returns
 */
function CustomAppBar({ content, title }) {
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [connection, setConnection] = useState(null);
	useEffect(() => {
		let online = checkOnline();
		setConnection(online);
		const interval = setInterval(async () => {
			let online = await checkOnline();
			setConnection(online);
		}, 15000);
		return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
	}, []);

	const { authenticationPromptOpen, setAuthenticationPromptOpen } =
		React.useContext(LoginContext);
	const handleLoginOpen = () => {
		setAuthenticationPromptOpen(true);
	};
	const loc = useLocation();
	const handleLogout = () => {
		document.cookie =
			"basicCreds=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		window.location.reload();
	};

	const navigate = useNavigate();
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<Box sx={{ height: "fit-content" }}>
			<Toolbar
				sx={{
					"&.MuiToolbar-root": {
						paddingLeft: "1px",
						paddingRight: "1px",
						backgroundColor: "rgba(100,100,150,0.8)",
					},
				}}
			>
				<Box height={"100%"} width={"100%"}>
					<img src={logo} alt="Chair logo" style={{ width: "100%" }} />
				</Box>
			</Toolbar>
			<Divider />
			<List>
				<ListItem key={"Search"} disablePadding>
					<ListItemButton
						onClick={(e) => {
							navigate("/");
						}}
					>
						<ListItemIcon>
							<SearchIcon />
						</ListItemIcon>
						<ListItemText primary={"Search"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"Make request"} disablePadding>
					<ListItemButton
						onClick={(e) => {
							navigate("/request");
						}}
					>
						<ListItemIcon>
							<ReadMoreIcon />
						</ListItemIcon>
						<ListItemText primary={"Make request"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"About"} disablePadding>
					<ListItemButton
						onClick={(e) => {
							navigate("/about");
						}}
					>
						<ListItemIcon>
							<HelpIcon />
						</ListItemIcon>
						<ListItemText primary={"About"} />
					</ListItemButton>
				</ListItem>
			</List>
			<Divider />
			<List>
				<ListItem key={"Login"} disablePadding>
					<ListItemButton
						onClick={(e) => {
							handleLoginOpen();
						}}
					>
						<ListItemIcon>
							<VpnKeyIcon />
						</ListItemIcon>
						<ListItemText primary={"Login"} />
					</ListItemButton>
				</ListItem>
				<ListItem key={"Login"} disablePadding>
					<ListItemButton
						onClick={(e) => {
							handleLogout();
						}}
					>
						<ListItemIcon>
							<VpnKeyIcon />
						</ListItemIcon>
						<ListItemText primary={"Logout"} />
					</ListItemButton>
				</ListItem>
			</List>
			<Box sx={{ height: "100%", display: "flex" }}>
				<Box sx={{ my: "auto", px: "1rem" }}>
					<Typography variant="body2">
						Display your advertisment here! WOW!!!
					</Typography>
				</Box>
			</Box>
		</Box>
	);

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar
				position="fixed"
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					height: `${titleBarHeight}px`,
					ml: { md: `${drawerWidth}px` },
					background: "radial-gradient(ellipse at top, #17375a, #171d55)",
				}}
			>
				<Toolbar
					sx={{
						height: `${titleBarHeight}px`,
					}}
				>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { md: "none" } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						{title}
					</Typography>
					<Typography
						variant="body2"
						sx={{
							color: getBasicAuthCreds() ? "green" : "rgb(255, 181, 20)",
							ml: "1rem",
						}}
					>
						{getBasicAuthCreds() ? "Authenticated" : "Not authenticated"}
					</Typography>
					<Typography
						variant="body2"
						noWrap
						component="div"
						sx={{
							justifySelf: "end",
							marginLeft: "auto",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						configured FHIR server status:
						<Box
							ml={"15px"}
							sx={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<Tooltip
								title={
									connection
										? "FHIR server online"
										: "No connection to FHIR server"
								}
							>
								{connection ? (
									<CircleIcon color="success" fontSize="" />
								) : (
									<CircularProgress
										color="error"
										size={"1rem"}
										thickness={10}
										disableShrink
									/>
								)}
							</Tooltip>
							<Link
								href={process.env.REACT_APP_FHIRBASE_DIRECT + "/metadata"}
								sx={{ color: "yellow" }}
								variant="subtitle1"
								target="_blank"
								underline="always"
							>
								{process.env.REACT_APP_FHIRBASE_DIRECT}
							</Link>
						</Box>
					</Typography>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{
					width: { md: drawerWidth },
					flexShrink: { md: 0 },
				}}
				aria-label="mailbox folders"
			>
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Drawer
					//container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { sm: "block", md: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", md: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Paper
				elevation={10}
				sx={{
					width: "70%",
					marginTop: `${titleBarHeight + 10}px`,
					padding: "3rem  10rem ",
					marginX: "10px",
				}}
			>
				{content}
			</Paper>
		</Box>
	);
}

export default CustomAppBar;
