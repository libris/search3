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
		instanceIds: null,
	}),
	getters: {
		instanceIds: (state) => {
            if (state.mainEntity != null && state.mainEntity.hasOwnProperty('@reverse')) {
                return state.mainEntity['@reverse']['instanceOf'];
            }
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