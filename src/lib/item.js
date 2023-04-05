import { useDataStore } from "@/stores/data";
import { useVocabStore } from "@/stores/vocab";

export const getItemById = (id) => {
	const data = useDataStore();
	const vocab = useVocabStore();

	const foundInData = data.graph.find((item) =>
		item['@id'] == id
	);

	if (foundInData != null) {
		return foundInData;
	}

	if (vocab.graph == null) {
		return null;
	}

	return vocab.graph.find((item) =>
		item['@id'] == id
	);
};

export const getItemsByRelation = (id, fieldKey) => {
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
