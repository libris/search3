import { sortBy, head, get } from 'lodash-es';
import {arrayPathToString} from "@/lxljs/string";

export const getImageUrl = (id: string, isbn: string) => {
	return `https://xinfo.libris.kb.se/xinfo/xinfo?type=record&identifier=libris-bib:${id},isbn:${isbn}`
};

export const getFnurgelFromUri = (id: string) => {
	const uriParts = id.split('/');
	const fnurgel = uriParts[uriParts.length - 1].replaceAll('#it', '');
	return fnurgel;
}

export const getFullImageUrl = (id: string, isbn: string) => {
	return `https://xinfo.libris.kb.se/xinfo/xinfo?type=orginal&identifier=libris-bib:${id},isbn:${isbn}`
};

export const getLoanStatus = async (sigel: string, instance_id: string) => {
	const url = `http://lanstatus.libris.kb.se/status/status.php?output=xml&sigel=${sigel}&bib_id=${instance_id}`;
	const result = await fetch(url);
	// FIXME: 'Access to fetch at 'http://lanstatus.libris.kb.se/status/status.php?output=xml&sigel=Vetb&bib_id=4d0ktz1p27hpdl4s'
	//  from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is
	//  present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors'
	//  to fetch the resource with CORS disabled.
	let status = 'OK';
	return status;
};

export const getWorkImageUrl = (work) => {
	const i = instances(work)
	const fnurgel = i.length > 0 ? getFnurgelFromUri(head(i)['@id']) : '';
	const isbns = getAtPath(i, ['*', 'identifiedBy', {'@type': 'ISBN'}, 'value']);
	const isbn = isbns.length > 0 ? head(isbns) : '';
	console.log(`fnurgel: ${fnurgel} isbn: ${JSON.stringify(isbn)}`);
	return getFullImageUrl(fnurgel, isbn);
}

export const publicationYear = (instance) => {
	return head(getAtPath(instance, ['publication', '*', 'year'])) || 9999;
}

export const instances = (work) => {
	// TODO: '@reverse', 'instanceOf' == 'hasInstance'
	const instances = getAtPath(work, ['@reverse', 'instanceOf', '*'])
		.map(i => ({'year': publicationYear(i), 'i': i}));
	return sortBy(instances, ['year']).map(i => i.i);
}

export const getAtPath = (thing, path, defaultTo = []) => {
	let t = thing
	// TODO: handle framed vs unframed
	for (let i = 0; i < path.length ; i++) {
		const p = path[i];
		if (p == '*') {
			if (t instanceof Array) {
				return t.flatMap(o => getAtPath(o, path.slice(i + 1), []))
			}
			else {
				return defaultTo
			}
		}
		else if (typeof p == 'string' || typeof p == 'number') {
			t = get(t, [p], defaultTo);
		}
		else if (p instanceof Object) {
			if (t instanceof Array) {
				return t.filter(o => isSubMap(p, o)).flatMap(o => getAtPath(o, path.slice(i + 1), []));
			}
			else if (isSubMap(p, t)) {
				continue;
			}
			else {
				return defaultTo
			}
		}
	}
	return t;
}

const isSubMap = (a, b) => {
	return a instanceof Object && b instanceof Object && Object.keys(a).every(k => a[k] == b[k]);
}