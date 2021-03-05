export class FTP {
	host: string = "";
	username: string = "";
	password: string = "";
	port: number = 22;
	remoteDirectory: string = "";
}
export class Repo {
	type: "git" | "bitbucket" = "git";
	auth_type: "ssh" | "login" = "ssh";
	username?: string = "";
	password? :string = "";
}

export class Config {
	ftp: FTP = new FTP();
	repo: Repo = new Repo();
}
