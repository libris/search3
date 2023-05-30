import { useI18nStore } from '@/stores/i18n';
import { sortBy, head, get } from 'lodash-es';
import { getUiPhraseByLang } from '@/lxljs/string';
import { getLabelByLang } from "@/lxljs/string";
import settings from "@/lib/settings";
import { getResources } from "@/lib/resources";

export const getPropertyLabel = (property: string) => {
	const label = getLabelByLang(property, settings.language, getResources());
	return capitalize(label);
}

export const capitalize = (s: string) => {
	return s.charAt(0).toUpperCase() + s.slice(1).toLocaleLowerCase();
};

export const getImageUrl = (id: string, isbn: string) => {
	return `https://xinfo.libris.kb.se/xinfo/xinfo?type=record&identifier=libris-bib:${id},isbn:${isbn}`
};

export const getFnurgelFromUri = (id: string) => {
	if (!id) {
		return id;
	}
	
	const uriParts = id.split('/');
	const fnurgel = uriParts[uriParts.length - 1].replaceAll('#it', '');
	return fnurgel;
}

export const noFragment = (uri: string) => {
	return uri.split('#')[0];
}

export const getFullImageUrl = (id: string, isbn: string) => {
	return `https://xinfo.libris.kb.se/xinfo/xinfo?type=orginal&identifier=libris-bib:${id},isbn:${isbn}`
};

export const getLoanStatus = async (sigel: string, instance_id: string) => {
	// FIXME "search4" -> VUE_APP_BASE_URL 
	const url = `/search4/lanstatus?output=json&sigel=${sigel}&bib_id=${instance_id}`;
	const result = await fetch(url);
	return result.json();
};

export const getWorkImageUrl = (work) => {
	const i = instances(work)
	const fnurgel = i.length > 0 ? getFnurgelFromUri(head(i)['@id']) : '';
	const isbns = getAtPath(i, ['*', 'identifiedBy', {'@type': 'ISBN'}, 'value']);
	const isbn = isbns.length > 0 ? head(isbns) : '';
	return getImageUrl(fnurgel, isbn);
}

export const publicationYear = (instance) => {
	return head(getAtPath(instance, ['publication', '*', 'year'])) || 9999;
}

export const instances = (work) => {
	// TODO: '@reverse', 'instanceOf' == 'hasInstance'
	return sortInstances(getAtPath(work, ['@reverse', 'instanceOf', '*']));
}

export const sortInstances = (instances) => {
	const withYear = instances.map(i => ({'year': publicationYear(i), 'i': i}));
	return sortBy(withYear, ['year']).map(i => i.i);
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

export const asArray = (x) => {
	if (x == null) {
		return [];
	}
	return x instanceof Array ? x : [x];
}

const isSubMap = (a, b) => {
	return a instanceof Object && b instanceof Object && Object.keys(a).every(k => a[k] == b[k]);
}

export const unwrap = (x) => {
	return x instanceof Array && x.length > 0 ? x[0] : x;
}

export const translatePhrase = (phrase: string | array): string => {
	const i18nStore = useI18nStore();

	return getUiPhraseByLang(
		phrase,
		'sv', // FIXME fancy fix this l8er
		i18nStore.source,
	);
};