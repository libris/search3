import { useContextStore } from '../stores/context';
import { useDisplayStore } from '../stores/display';
import { useVocabStore } from '../stores/vocab';
import { useI18nStore } from '../stores/i18n';

export const getResources = () => {
	const contextStore = useContextStore();
	const vocabStore = useVocabStore();
	const displayStore = useDisplayStore();
	const i18nStore = useI18nStore();

	return {
		context: contextStore.context,
		vocab: vocabStore.map,
		display: displayStore.current,
		displayGroups: displayStore.groups,
		i18n: i18nStore.current,
	};
};