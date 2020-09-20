interface IPerson {
	name: string;
	city: string;
	age: number;
	printDetails(): void;
}

const tom: IPerson = {
	name: "Tom",
	city: "Munich",
	age: 33,
	printDetails: function () {
		console.log(`${this.name} - ${this.city}`);
	}
};

class Animal {
	#name: string;
	private nname: string = "o";
	public y: string = "2";

	constructor(theName: string) {
		this.#name = theName;
	}
}

const a: Animal = new Animal("y");
// a.nnmae = "omer";
a.y = "1";