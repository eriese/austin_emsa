export function snakeToCamel(str: string) {
	return str.replace(/(_\w)/g, function(m){
		return m[1].toUpperCase();
	});
}

export function camelToSnake(str: string) {
	return str.replace(/[\w]([A-Z])/g, function(m) {
		return m[0] + "_" + m[1];
	}).toLowerCase();
}

export function JsonSnakeToCamel(obj: object) {
	const converted = snakeToCamel(JSON.stringify(obj));
	return JSON.parse(converted);
}

export function JsonCamelToSnake(obj: object) {
	const converted = camelToSnake(JSON.stringify(obj));
	return JSON.parse(converted);
}
