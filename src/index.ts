import { Config } from "./config"
import * as fs from "fs";
import { parse } from 'ts-command-line-args';
import client from "./ftp_client";

interface ICopyFilesArguments {
	downloadAll?: boolean,
	sync?: boolean,
	watch?: boolean,
	testFtp?: boolean,
    help?: boolean
}



// loading config
const CONFIG_FILE_PATH = "ftpgit.config.json";
let CONFIG: Config;
try {
	CONFIG = require(process.cwd() + '/' + CONFIG_FILE_PATH);
} catch (e) {
	if (e.code === "MODULE_NOT_FOUND") {
		CONFIG = new Config();
		console.log("config file='" + CONFIG_FILE_PATH + "' not found");
		const str: string = JSON.stringify(CONFIG, null, 4);
		fs.writeFileSync(CONFIG_FILE_PATH, str);
		console.log("config file='" + CONFIG_FILE_PATH + "' Created. bye");
		process.exit(0);
	} else {
		throw e;
	}
}

// handling args
const args = parse<ICopyFilesArguments>(
    {
		downloadAll: {type: Boolean, optional: true, description: "Downloads everything, asks foreach folder"},
		sync: {type: Boolean, optional: true, description: "Sync local files with ftp files"},
		watch: {type: Boolean, optional: true, description: "Start to watch files"},
		testFtp: {type: Boolean, optional: true, description: "Tests ftp connection"},
        help: { type: Boolean, optional: true, alias: 'h', description: 'Prints this usage guide' },
    },
    {
        helpArg: 'help',
        // headerContentSections: [{ header: 'My Example Config', content: 'Thanks for using Our Awesome Library' }],
        // footerContentSections: [{ header: 'Footer', content: `Copyright: Big Faceless Corp. inc.` }],
    },
);

if (Object.keys(args).length === 0) {
	console.log("No option chosen. run with --help");
	process.exit(1);
}
else if (Object.keys(args).length !== 1) {
	console.log("Only 1 option is allowed. run with --help");
	process.exit(2);
}

// initiating ftp client
client.set_config(CONFIG.ftp);

// handling switches
if (args.testFtp) {
	client.test();
}
else if (args.downloadAll) {
	client.download_all();
}
else if (args.sync) {
	client.sync();
}
else if (args.watch) {
	// watcher!
}
