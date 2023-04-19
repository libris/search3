import { useDataStore } from "@/views/SearchResults/store";
import { useVocabStore } from "@/stores/vocab";

export const getImageUrl = (id: string, isbn: string) => {
	return `https://xinfo.libris.kb.se/xinfo/xinfo?type=record&identifier=libris-bib:${id},isbn:${isbn}`
};