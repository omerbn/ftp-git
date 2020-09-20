import os from 'os';

console.log(os.freemem);
interface Link {
	description?: string;
	id?: number;
	url: string;
	[index: string]: any; // index?
}

interface TranslatedLink extends Link {
	language: string;
}

function filterByTerm(
	input: Array<Link>,
	searchTerm: string,
	lookupKey: string = "url"
): Array<Link> {
	if (!searchTerm) throw Error("searchTerm cannot be empty");
	if (!input.length) throw Error("input cannot be empty");
	const regex = new RegExp(searchTerm, "i");
	return input
		.filter(function (arrayElement) {
			return arrayElement[lookupKey].match(regex);
		});
}

const obj1: TranslatedLink = {
	description:
		"TypeScript tutorial for beginners is a tutorial for all the JavaScript developers ...",
	id: 1,
	url: "www.valentinog.com/typescript/",
	language: "en"
};
const obj2: Link = { url: "string2", description: "d1" };
const obj3: Link = { description: "d1", url: "string3" };
const arrOfLinks: Link[] = [obj1, obj2, obj3];

const term: string = "java";

filterByTerm(arrOfLinks, term);