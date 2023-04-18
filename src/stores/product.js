import { defineStore } from "pinia";
import { getDocument } from '@/lib/http';
import { splitJson } from "@/lxljs/data";
import { getChip, getItemSummary } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import { getImageUrl } from '@/lib/item';
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
        workChip: (state) => {
            if (state.mainEntity != null) {
                return getChip(state.mainEntity, getResources(), state.quoted, settings);
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
				const uriParts = foundInstance['@id'].split('/');
				const fnurgel = uriParts[uriParts.length - 1];

				return getImageUrl(fnurgel, foundInstance.identifiedBy[0].value);
			}

			return getImageUrl('10145888','9789185251872');
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