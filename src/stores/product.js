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
		getProduct(documentId) {
			getDocument(`${documentId}/data.jsonld`).then((response) => {
				const split = splitJson(response.data);
				console.log('splitJson', JSON.parse(JSON.stringify(split)));

				this.current = response.data;
				this.mainEntity = split.mainEntity;
				this.quoted = split.quoted;
				this.record = split.record;
			});
		},
	},
});