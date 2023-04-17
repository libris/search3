import { useContextStore } from '../stores/context';
import { useDisplayStore } from '../stores/display';
import { useVocabStore } from '../stores/vocab';

export const getResources = () => {
	const contextStore = useContextStore();
	const vocabStore = useVocabStore();
	const displayStore = useDisplayStore();

	return {
		context: contextStore.context,
		vocab: vocabStore.graph,
		display: displayStore.current,
	};
};