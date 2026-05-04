/**
 * Flexible restaurant text search: tokenize, drop filler words, expand related terms,
 * match across name / description / area / city / businessType / cuisine (not exact phrase only).
 */

const STOP = new Set([
    'near',
    'me',
    'the',
    'a',
    'an',
    'in',
    'at',
    'for',
    'to',
    'of',
    'and',
    'or',
    'restaurant',
    'restaurants',
    'food',
    'order',
    'orders',
    'i',
    'want',
    'some',
    'get',
    'with',
    'my',
    'here',
    'delivery',
    'pickup',
    'dine',
    'best',
    'good',
    'great',
    'find',
    'show',
]);

/** Map a user token to extra substrings / cuisine hints (lowercase). */
const EXPANSIONS = {
    healthy: [
        'health',
        'salad',
        'organic',
        'vegan',
        'vegetarian',
        'grilled',
        'grill',
        'fresh',
        'bowl',
        'soup',
        'green',
        'keto',
        'low fat',
        'nutritious',
        'lean',
    ],
    health: ['healthy', 'salad', 'organic', 'fresh'],
    pizza: ['pizzeria', 'italian', 'margherita', 'slice', 'neapolitan', 'pepperoni'],
    burgers: ['burger', 'american', 'patty', 'beef'],
    burger: ['burgers', 'american', 'fast'],
    chinese: ['asian', 'noodles', 'dim sum', 'szechuan', 'sichuan'],
    indian: ['curry', 'masala', 'tandoori', 'biryani', 'desi'],
    italian: ['pasta', 'pizza', 'risotto'],
    mexican: ['taco', 'burrito', 'quesadilla'],
    japanese: ['sushi', 'ramen', 'teriyaki'],
    thai: ['pad thai', 'curry'],
    bbq: ['barbecue', 'grill', 'smoked'],
    breakfast: ['brunch', 'eggs', 'pancake'],
    coffee: ['cafe', 'espresso', 'latte'],
    dessert: ['sweet', 'cake', 'ice cream'],
    vegan: ['plant', 'vegetarian', 'healthy'],
    vegetarian: ['veggie', 'salad', 'vegan'],
};

function tokenize(raw) {
    const s = String(raw || '')
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ');
    return s
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 1 && !STOP.has(t));
}

function expandTerms(tokens) {
    const out = new Set();
    for (const t of tokens) {
        out.add(t);
        const extra = EXPANSIONS[t];
        if (extra) {
            for (const e of extra) {
                const parts = e.split(/\s+/).filter((p) => p.length > 1);
                for (const p of parts) out.add(p);
                if (e.includes(' ')) out.add(e);
            }
        }
    }
    return [...out].filter((term) => String(term).length >= 2);
}

/**
 * @param {string|null|undefined} search
 * @returns {object|null} Prisma-compatible `{ OR: [...] }` or null
 */
function buildRestaurantSearchWhere(search) {
    if (search == null || !String(search).trim()) return null;

    let tokens = tokenize(search);
    if (tokens.length === 0) {
        const stripped = String(search)
            .replace(/\bnear\s+me\b/gi, ' ')
            .replace(/[^\w\s]/g, ' ')
            .trim();
        if (stripped.length >= 2) {
            const t = stripped.toLowerCase().split(/\s+/).filter((x) => x.length > 1 && !STOP.has(x));
            tokens = t.length ? t : [stripped.toLowerCase()];
        }
    }

    const terms = expandTerms(tokens.length ? tokens : tokenize(search));
    if (terms.length === 0) return null;

    const ors = [];
    const seen = new Set();
    for (let term of terms) {
        term = String(term).trim();
        if (term.length < 2) continue;
        const key = term.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);

        const cap = term.charAt(0).toUpperCase() + term.slice(1).toLowerCase();
        const upper = term.toUpperCase();

        ors.push(
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { area: { contains: term, mode: 'insensitive' } },
            { city: { contains: term, mode: 'insensitive' } },
            { businessType: { contains: term, mode: 'insensitive' } },
            { cuisineTypes: { hasSome: [term, cap, upper, key] } },
            {
                menuItems: {
                    some: {
                        OR: [
                            { name: { contains: term, mode: 'insensitive' } },
                            { description: { contains: term, mode: 'insensitive' } },
                        ],
                    },
                },
            }
        );
    }

    return ors.length ? { OR: ors } : null;
}

module.exports = { buildRestaurantSearchWhere, tokenize, expandTerms };
