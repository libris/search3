import { defineStore } from "pinia";
import { getDocument } from '@/lib/http';
import { splitJson } from "@/lxljs/data";

export const useProductStore = defineStore('product', {
	state: () => ({
		current: null,
		mainEntity: null,
		quoted: null,
		record: null,
	}),
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