import { defineStore } from "pinia";
import { getDocument } from '@/lib/http';
import { splitJson } from "@/lxljs/data";
import { getCard, getChip, getItemSummary } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import {getFnurgelFromUri, getFullImageUrl} from '@/lib/item';
import settings from '@/lib/settings';

export const useProductStore = defineStore('product', {
	state: () => ({
		current: null,
		mainEntity: null,
		quoted: null,
		record: null,
	}),
	getters: {
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
		work: (state) => {
			if (state.mainEntity != null) {
				return state.mainEntity;
			}
		},
        workChip: (state) => {
            if (state.mainEntity != null) {
                return getChip(state.mainEntity, getResources(), state.quoted, settings);
            }
        },
		workCard: (state) => {
			if (state.mainEntity != null) {
				return getCard(state.mainEntity, getResources(), state.quoted, settings);
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
			const foundInstance = state.instances.find((instance) => {
				return instance.identifiedBy != null && instance.identifiedBy.find((identify) =>
					identify['@type'] == 'ISBN'
				);
			});

			if (foundInstance != null) {
				return getFullImageUrl(getFnurgelFromUri(foundInstance['@id']), foundInstance.identifiedBy[0].value);
			}

			return getFullImageUrl('10145888','9789185251872');
		},
	},
	actions: {
		async getProduct(documentId) {
			const response = await getDocument(`${documentId}/data.jsonld`);
			const split = splitJson(response.data);

			this.current = response.data;
			this.mainEntity = split.mainEntity;
			this.quoted = split.quoted;
			this.record = split.record;
		},
	},
});