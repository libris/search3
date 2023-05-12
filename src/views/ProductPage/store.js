import { defineStore } from "pinia";
import { getDocument } from '@/lib/http';
import { splitJson } from "@/lxljs/data";
import { getCard, getChip, getItemLabel, getItemSummary } from '@/lxljs/display';
import { getResources } from '@/lib/resources';
import { getAtPath, getFnurgelFromUri, getFullImageUrl, asArray, unwrap } from '@/lib/item';
import { getRecordType } from "@/lxljs/vocab";

import settings from '@/lib/settings';

export const useProductStore = defineStore('product', {
	state: () => ({
		current: null,
		parentEntity: null,
		mainEntity: null,
		quoted: null,
		record: null,
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
		subjectSchemes: (state) => {
			const schemes = [...new Set(state.subjects.map(s => s?.inScheme))];
			return schemes.map(scheme => {
				return {
					'scheme': scheme,
					'subjects': state.subjects.filter(subject => subject.inScheme === scheme)
				}
			});
		},
		subjects: (state) => {
			if (state.mainEntity != null) {
				return getAtPath(state.mainEntity, ['subject', '*']).map(s => {
					if (s['@id'] != null ) {
						const subject = state.quoted[s['@id']];
						const schemeId = subject['inScheme']['@id'];
						const scheme = state.quoted[schemeId];
						const chip = getChip(scheme, getResources(), state.quoted, settings);
						// FIXME
						let schemeLabel = '';
						if (chip.hasOwnProperty('title')) {
							schemeLabel = chip.title;
						} else if (chip.hasOwnProperty('prefLabel')) {
							schemeLabel = chip.prefLabel;
						}
						return {
							'inScheme': schemeLabel,
							'subject': getItemLabel(s, getResources(), state.quoted, settings),
							'link': `find?o=${s['@id']}&@type=Text&_limit=20&_sort=`
						}
					}
				}).filter(s => s != null);
			}
		},
		gfSchemes: (state) => {
			const schemes = [...new Set(state.genreForms.map(gf => gf?.inScheme))];
			return schemes.map(scheme => {
				return {
					'scheme': scheme,
					'genreForms': state.genreForms.filter(gf => gf.inScheme === scheme)
				}
			});
		},
		genreForms: (state) => {
			if (state.mainEntity != null) {
				return getAtPath(state.mainEntity, ['genreForm', '*']).map(gf => {
					if (gf['@id'] != null ) {
						const genreForm = state.quoted[gf['@id']];
						const schemeId = genreForm['inScheme']['@id'];
						const scheme = state.quoted[schemeId];
						return {
							'inScheme': getChip(scheme, getResources(), state.quoted, settings).title,
							'genreForm': getItemLabel(gf, getResources(), state.quoted, settings),
							'link': `find?o=${gf['@id']}&@type=Text&_limit=20&_sort=`
						}
					}
				}).filter(s => s != null);
			}
		},
		author: (state) => {
			if (state.mainEntity != null) {
				return getAtPath(state.mainEntity, ['contribution', '*']).find(c => {
					if (Array.isArray(c.role)) {
						return c.role.find((r) => r['@id'].indexOf('author') > -1);
					} else {
						return c.role['@id'].indexOf('author') > -1;
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
			const foundInstance = state.instances.find((instance) => {
				return instance.identifiedBy != null && instance.identifiedBy.find((identify) =>
					identify['@type'] == 'ISBN'
				);
			});

			if (foundInstance != null) {
				return getFullImageUrl(getFnurgelFromUri(foundInstance['@id']), foundInstance.identifiedBy[0].value);
			}

			return '';
		},
	},
	actions: {
		async getProduct(documentId) {
			let response = await getDocument(`${documentId}/data.jsonld`);
			let split = splitJson(response.data);

			console.log('split', JSON.parse(JSON.stringify(split)));
			if (split.mainEntity.instanceOf != null) {
				this.parentEntity = split.mainEntity;

				response = await getDocument(`${this.parentEntity.instanceOf['@id']}/data.jsonld`);
				split = splitJson(response.data);
			}

			this.current = response.data;
			this.mainEntity = split.mainEntity;
			this.quoted = split.quoted;
			this.record = split.record;
		},
	},
});