export function clearObjectFromEmptyValues(obj) {
	if (obj instanceof Object) {
		if (Array.isArray(obj)) {
			/* obj.forEach((item, index) => {
				let empty = clearObjectFromEmptyValues(item);
				if (empty) obj.splice(index, 1);
			}); */
			for (let i = obj.length - 1; i >= 0; i--) {
				let empty = clearObjectFromEmptyValues(obj[i]);
				if (empty) obj.splice(i, 1);
			}
		}
		for (let key in obj) {
			if (
				key === "internalReactID" ||
				key === "internalReactExpanded" ||
				obj[key] === null ||
				obj[key] === undefined ||
				obj[key] === "" ||
				obj[key] === NaN
			) {
				delete obj[key];
			} else {
				let empty = clearObjectFromEmptyValues(obj[key]);
				if (empty) delete obj[key];
			}
		}
		/* if (isObjectEmpty(obj)) return true; */
		if (isObjectEmptyRecursive(obj)) return true;
		else return false;
	} else {
		if (
			obj === "internalReactID" ||
			obj === "internalReactExpanded" ||
			obj === null ||
			obj === undefined ||
			obj === "" ||
			obj === NaN
		) {
			return true;
		} else {
			return false;
		}
	}
}

export const isObjectEmptyRecursive = (obj) => {
	if (obj instanceof Object) {
		if (obj === null || obj === undefined || Object.keys(obj).length === 0)
			return true;
		if (Array.isArray(obj)) {
			return obj.every((item) => isObjectEmptyRecursive(item));
		}
		return Object.keys(obj).every((key) => {
			if (key === "internalReactID" || key === "internalReactExpanded")
				return true;
			return isObjectEmptyRecursive(obj[key]);
		});
	} else {
		if (obj === null || obj === undefined || obj === "" || obj === NaN) {
			return true;
		} else {
			return false;
		}
	}
};
