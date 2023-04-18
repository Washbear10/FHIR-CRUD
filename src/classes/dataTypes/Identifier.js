import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { v4 as uuidv4 } from "uuid";
import CodeableConcept from "./CodeableConcept";
import Period from "../../classes/dataTypes/Period";

export class Identifier {
	constructor({ use, type, system, value, period, assigner, internalReactID }) {
		this.use = use;
		this.type = new CodeableConcept({ ...type });
		this.system = system;
		this.value = value;
		this.period = new Period({ ...period });
		this.assigner = assigner;
		this.internalReactID = internalReactID ? internalReactID : uuidv4();
	}

	#computeDisplay() {
		return (
			<Box>
				{" "}
				<span>
					<Typography>System: </Typography>
					{this.system || "(missing)"}
				</span>{" "}
				<span>
					<Typography>Value: </Typography>
					{this.value || "(missing)"}
				</span>
			</Box>
		);
	}
	getRenderComponent() {
		const display = this.#computeDisplay();
		return <Box>{display}</Box>;
	}
}
