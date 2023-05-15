import { defineStore } from "pinia";
import { getDocument } from '@/lib/http';
import { splitJson } from "@/lxljs/data";
import { getCard, getChip, getItemLabel, getItemSummary } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import { getAtPath, getFnurgelFromUri, getFullImageUrl, asArray, unwrap } from '@/lib/item';
import { getRecordType } from "@/lxljs/vocab";
import settings from '@/lib/settings';
import { isLink } from "@/lib/jsonld";

export const useKnowledgeCardStore = defineStore('knowledgeCard', {
	state: () => ({
		current: null,
		parentEntity: null,
		mainEntity: null,
		quoted: null,
		record: null,
		wikiData: null,
	}),
	getters: {
		productType: (state) => {
			if (state.mainEntity != null) {
				const resources = getResources();
				return getRecordType(state.mainEntity['@type'], resources.vocab, resources.context).toLowerCase();
			}

			return null;
		},
		instanceIds: (state) => {
            if (state.mainEntity != null && state.mainEntity.hasOwnProperty('@reverse')) {
				if (state.mainEntity['@reverse'].hasOwnProperty('instanceOf')) {
					return state.mainEntity['@reverse']['instanceOf'].map((instance) => instance['@id']);
				}
            }

			return [];
        },
		instances: (state) => {
			return state.instanceIds.map((instanceId) => {
				const instance = state.quoted[instanceId];
				if (instance != null) {
					return instance;
				}
			});
		},
        chip: (state) => {
            if (state.mainEntity != null) {
                return getChip(state.mainEntity, getResources(), state.quoted, settings);
            }
        },
		card: (state) => {
			if (state.mainEntity != null) {
				return getCard(state.mainEntity, getResources(), state.quoted, settings);
			}
		},
		contributions: (state) => {
			// FIXME
			if (state.mainEntity != null) {
				return getAtPath(state.mainEntity, ['contribution', '*']).map(c => {
					return {
						'role': asArray(c.role).map(r => getItemLabel(r, getResources(), state.quoted, settings)),
						'agent': getItemLabel(unwrap(c.agent), getResources(), state.quoted, settings),
						'link': getFnurgelFromUri(unwrap(asArray(c.agent).map(a => a['@id'])))
					}
				});
			}
		},
        itemSummary: (state) => {
            if (state.mainEntity != null) {
                return getItemSummary(
                    state.mainEntity,
                    getResources(),
                    state.quoted,
                    settings,
                    getResources().displayGroups,
                );
            }

            return null;
        },
		imageUrl: (state) => {
			if (state.instances.length > 0) {
				const foundInstance = state.instances.find((instance) => {
					return instance.identifiedBy != null && instance.identifiedBy.find((identify) =>
						identify['@type'] == 'ISBN'
					);
				});

				if (foundInstance != null) {
					return getFullImageUrl(getFnurgelFromUri(foundInstance['@id']), foundInstance.identifiedBy[0].value);
				}
			}

			// TODO: Get image from Wikidata dataset l8er
			return 'https://upload.wikimedia.org/wikipedia/commons/d/da/Jonas_Hassen_Khemiri%2C_2019_%28cropped%29.jpg';
		},
	},
	actions: {
		async getProduct(documentId) {
			let response = await getDocument(`${documentId}/data.jsonld`);
			if (!response.data) {
				return;
			}
			
			let split = splitJson(response.data);

			if (isLink(split.mainEntity.instanceOf)) {
				this.parentEntity = split.mainEntity;

				response = await getDocument(`${this.parentEntity.instanceOf['@id']}/data.jsonld`);
				split = splitJson(response.data);
			}

			if (split.mainEntity.exactMatch != null) {
				const wikiDataMatch = split.mainEntity.exactMatch.find((match) => match['@id'].indexOf('wikidata.org') > -1)

				if (wikiDataMatch != null) {
					this.wikiData = wikiDataMatch;
				}
			}

			this.current = response.data;
			this.mainEntity = split.mainEntity;
			this.quoted = split.quoted;
			this.record = split.record;
		},
	},
});