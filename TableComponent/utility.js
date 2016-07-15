const ascendingSortOfBoolean = (data, propertyName) => {
	return data.sort(function (first, second) {
		return first[propertyName].toSting().localeCompare(second[propertyName].toSting());
	});
}
const descendingSortOfBoolean = () => {
	return data.sort(function (first, second) {
		return first[propertyName].toSting().localeCompare(second[propertyName].toSting());
	});
}
const ascendingSortOfString = (data, propertyName) => {
	return data.sort(function (first, second) {
		return first[propertyName].localeCompare(second[propertyName]);
	});
}
const descendingSortOfString = (data, propertyName) => {
	return data.sort(function (first, second) {
		return second[propertyName].localeCompare(first[propertyName]);
	});
}
const ascendingSortOfNumber = (data, propertyName) => {
	return data.sort(function (first, second) {
		return first[propertyName] - second[propertyName];

	});
}
const descendingSortOfNumber = (data, propertyName) => {
	return data.sort(function (first, second) {
		return second[propertyName] - first[propertyName];			
	});
}	


exports.ascendingSortByPropery = (data, propertyName) => {

	let propertyVal = data[0][propertyName];
	let propertyValType = typeof propertyVal;

	switch (propertyValType) {
		case 'string': data = ascendingSortOfString(data, propertyName); break;
		case 'number': data = ascendingSortOfNumber(data, propertyName); break;		
		case 'boolean': data = ascendingSortOfBoolean(data, propertyName); break;
	}

	return data;
}

exports.descendingSortByPropery = (data, propertyName) => {

	let propertyVal = data[0][propertyName];
	let propertyValType = typeof propertyVal;

	switch (propertyValType) {
		case 'string': data = descendingSortOfString(data, propertyName); break;
		case 'number': data = descendingSortOfNumber(data, propertyName); break;
		case 'boolean': data = descendingSortOfBoolean(data, propertyName); break;
	}

	return data;
}