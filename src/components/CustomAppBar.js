import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import AuthenticationPrompt from "./AuthenticationPrompt";
import { LoginContext } from "../utilities/LoginContext";
import { useState } from "react";
const drawerWidth = 240;
const titleBarHeight = 60;

function CustomAppBar({ window, content }) {
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const { authenticationPromptOpen, setAuthenticationPromptOpen } =
		React.useContext(LoginContext);

	const handleLoginOpen = () => {
		setAuthenticationPromptOpen(true);
	};
	const handleLoginClose = () => {
		setAuthenticationPromptOpen(false);
	};

	const navigate = useNavigate();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const drawer = (
		<Box sx={{}}>
			<Toolbar />
			<Divider />
			<List>
				{["Search", "Create resources", "Configuration"].map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon>
								{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
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
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"Login"} />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar
				position="fixed"
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					height: `${titleBarHeight}px`,
					ml: { md: `${drawerWidth}px` },
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
						Search Resources
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
					container={container}
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
