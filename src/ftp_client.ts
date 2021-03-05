import Client, { FileInfo } from 'ssh2-sftp-client';
import { FTP } from "./config";
import * as readline from 'readline';


class FTPClient {
	_config: FTP = new FTP();
	_client: Client = new Client();
	_state: "disconnected" | "connecting" | "connected" = "disconnected";
	_waiting_connections: Array<(res: boolean) => void> = new Array<(res: boolean) => void>();


	set_config(config: FTP) {
		this._config = config;
	}

	_connect(): Promise<boolean> {
		return new Promise<boolean>((res, rej) => {
			if (this._state == "connecting") {
				this._waiting_connections.push(res);
				return;
			} else if (this._state == "connected") {
				return res(true);
			}

			this._waiting_connections.push(res);
			this._state = "connecting";


			this._client.connect({
				host: this._config.host,
				port: this._config.port || 22,
				username: this._config.username,
				password: this._config.password
			})
				.then(() => {
					this._state = "connected";
					for (const x of this._waiting_connections) {
						x(true);
					}
				}).catch((err: string) => {
					this._state = "disconnected";
					console.log(err);
					process.exit(3);
					for (const x of this._waiting_connections) {
						x(false);
					}
				});
		});
	}

	async test() {
		await this._connect();
		console.log("Test successfull");
		process.exit(0);
	}

	async download_all() {
		if (!await this._connect()) {
			process.exit(3);
		};
		const folders: Array<string> = [this._config.remoteDirectory];
		const local: Array<string> = [process.env.PWD || "."];
		const promises_waiting: Array<Promise<string>> = new Array<Promise<string>>();

		while (folders.length) {
			const folder_path = folders.pop();
			const local_folder = local.pop();
			if (!folder_path || !local_folder) continue;
			console.log("processing folder=" + folder_path);

			const files: FileInfo[] = await this._client.list(folder_path);

			for (const f of files) {
				const new_path: string = folder_path.trim() + "/" + f.name.trim();
				const new_local_path: string = local_folder.trim() + "/" + f.name.trim();
				if (f.type === 'd') {
					let rl = readline.createInterface({
						input: process.stdin,
						output: process.stdout
					});

					let waitf = () => { };
					const waitp = new Promise<void>((res) => {
						waitf = res;
					});
					rl.question('Should download folder=' + new_path + '? [y/n] ', (answer) => {
						switch (answer.toLowerCase()) {
							case 'y':
								folders.push(new_path);
								local.push(new_local_path);
								break;
							default:
								break;
						}
						rl.close();
						waitf();
					});
					await waitp;
				} else if (f.type === '-') {
					console.log("downloading file=" + new_path + " to=" + new_local_path);
					promises_waiting.push(this._client.fastGet(new_path, new_local_path, {
						concurrency: 16, // integer. Number of concurrent reads to use
						chunkSize: 8192, // integer. Size of each read in bytes
					  }).then(()=>{
						console.log("downloaded=" + new_path);
						return "ok";
					}));
					if (promises_waiting.length === 10) {
						await Promise.all(promises_waiting);
						promises_waiting.length = 0;
					}
				}
			}

		}

		await Promise.all(promises_waiting);
		promises_waiting.length = 0;
	}

	async sync() {

	}

	async upload() {

	}


}

/*
const sftp: Client = new Client();

sftp.connect({
	host: ftp.host,
	port: ftp.port || 22,
	username: ftp.username,
	password: ftp.password
}).then((stream: any) => {
	return sftp.list(ftp.remoteDirectory);
}).then((data: FileInfo[]) => {
	// console.log(data, 'the data info');
	console.log('success');
}).catch((err: string) => {
	console.log(err, 'catch error');
});

*/

const client: FTPClient = new FTPClient();
export default client;