export const isLink = (jsonLd: object) => {
    return jsonLd != null && Object.keys(jsonLd).length == 1 && jsonLd['@id'];
};