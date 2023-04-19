import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Test from "./pages/Home/Test";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	BrowserRouter,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<Router>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/test" elemen={<Test />} />
		</Routes>
	</Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals