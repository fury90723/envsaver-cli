import arg from 'arg';
import fs from 'fs';
let rawData = require(`${process.cwd()}/storage.json`);

const storagePath = `${process.cwd()}/storage.json`;

function parseArgumentsIntoOptions(rArgs) {
	const args = arg(
		{
			'--create': Boolean,
			'--set': Boolean,
			'--get': Boolean,
			'--delete': Boolean,
			'--help': Boolean,
			'-c': '--create',
			'-s': '--set',
			'-g': '--get',
			'-d': '--delete',
			'-h': '--help'
		},
		{
			argv: rArgs.slice(2),
		}
	);
	return {
		createKey: args['--create'] || false,
		setKey: args['--set'] || false,
		getKey: args['--get'] || false,
		deleteKey: args['--delete'] || false,
		help: args['--help'] || false
	};

}

export function cli(args) {
	let options = parseArgumentsIntoOptions(args);

	if (options.createKey) {
		let values = args.slice(3).toString();
		let key = values.split(',')[0];

		if (!rawData[key]) {
			rawData[key] = args.slice(4).toString();
			fs.writeFileSync(storagePath, JSON.stringify(rawData));
			console.log("Key created successfully.");
		} else {
			console.log("Key is already present. Not updating the value.");
		}

	}

	if (options.getKey) {
		let v = args.slice(3).toString();

		if (rawData[v]) {
			console.log(rawData[v]);
		} else {
			console.log("No such key is present.");
		}
	}

	if (options.setKey) {
		let values = args.slice(3).toString();
		let key = values.split(',')[0];

		if (rawData[key]) {
			rawData[key] = args.slice(4).toString();
			fs.writeFileSync(storagePath, JSON.stringify(rawData));
			console.log("Key updated successfully.");
		} else {
			console.log("No such key is present.");
		}

	}

	if (options.deleteKey) {
		if (rawData[args.slice(3).toString()]) {
			delete rawData[args.slice(3).toString()];
			fs.writeFileSync(storagePath, JSON.stringify(rawData));
			console.log("Key deleted successfully.");
		} else {
			console.log("No such key is present.");
		}
	}

	if (options.help) {
		console.log("\n");
		console.log("Usage: envsaver [option] [arg1] [arg2 if needed] ");
		console.log("\n");
		console.log("Options:");
		console.log("\n");
		console.log("--create, -c    :  adds a key and a value inside the storage. Takes two args, key and value");
		console.log("--delete, -d    :  deletes a key inside the storage. Takes one arg, key name");
		console.log("--set,    -s    :  sets a value inside an existing key. Takes two args, key and value");
		console.log("--get,    -g    :  gets a value from inside the storage. Takes one arg, key name");
		console.log("\n");
	}
}
