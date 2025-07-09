import Fuse from 'fuse.js';
import { keywordToCategory } from './categoryMapper';

const keywords = Object.keys(keywordToCategory).map(k => ({ keyword: k, category: keywordToCategory[k] }));

const fuse = new Fuse(keywords, {
    keys: ['keyword'],
    threshold: 0.4, // Adjust: 0.0 (strict) to 1.0 (loose)
});

export function getCategoryFromDescription(description = '') {
    const lowerDesc = description.toLowerCase();
    const words = lowerDesc.split(/\s+/);

    for (let word of words) {
        const result = fuse.search(word);
        if (result.length > 0) {
            return result[0].item.category;
        }
    }


    return 'Others'; // fallback category
}
