import React, { useEffect } from "react";
import { useState } from "react";
import SmallTextField from "../styledComponents/SmallTextField";

const IntegerInput = ({
	label,
	value,
	changeValue,
	width,
	negativeAllowed,
	min,
	max,
}) => {
	const [negativeSignPlaceholder, setNegativeSignPlaceholder] = useState(false);
	useEffect(() => {}, [value]);

	const handleChange = (val) => {
		console.log("trying to change val to :", val);
		const re = negativeAllowed ? /^-?\d*$|^$/ : /^\d+$|^$/;
		if (re.test(val)) {
			console.log("allowed: ", val);
			if (val == "-") {
				console.log("val is - -> setneg true");
				setNegativeSignPlaceholder(true);
			} else {
				if (val === "" || (parseInt(val) >= min && parseInt(val) <= max)) {
					console.log("parse succS: ", parseInt(val));
					changeValue(val);
				} else {
					console.log("parse not succ: ", parseInt(val));
				}
				setNegativeSignPlaceholder(false);
			}
		}
	};
	return (
		<SmallTextField
			label={label}
			value={
				negativeSignPlaceholder
					? "-"
					: Number.isInteger(parseInt(value))
					? value
					: ""
			}
			onChange={(e) => {
				handleChange(e.target.value);
			}}
			width={width}
		/>
	);
};

export default IntegerInput;
