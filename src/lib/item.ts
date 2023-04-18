import { useDataStore } from "@/stores/data";
import { useVocabStore } from "@/stores/vocab";

export const getItemById = (id: string) => {
	const data = useDataStore();
	const vocab = useVocabStore();

	const foundInData = data.current.find((item) =>
		item['@id'] == id
	);

	if (foundInData != null) {
		return foundInData;
	}

	if (vocab.graph == null) {
		return null;
	}

	return vocab.graph.find((item) => item['@id'] == id);
};

export const getItemsByRelation = (id: string, fieldKey: string) => {
	const data = useDataStore();
	let result = [];

	data.indexedData.forEach((item) => {
		if (item[fieldKey] != null && typeof item[fieldKey] === 'object') {
			if (item[fieldKey]['@id'] != null && item[fieldKey]['@id'] === id) {
				result.push(item);
			}
		}
	});

	return result;
};

export const getImageUrl = (id: string, isbn: string) => {
	return `https://xinfo.libris.kb.se/xinfo/xinfo?type=record&identifier=libris-bib:${id},isbn:${isbn}`
};