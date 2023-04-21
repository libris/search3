
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