export type Category = 'Outerwear' | 'Tops' | 'Bottoms' | 'Dresses';
type ArtworkKind = 'coat' | 'shirt' | 'trouser' | 'dress';

export interface Product {
  id: string;
  name: string;
  category: Category;
  priceInCents: number;
  image: string;
  imageAlt: string;
  description: string;
  material: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

const artworkPaths: Record<ArtworkKind, string> = {
  coat: '<path d="M59 31 73 22h14l14 9 20 18-12 13-10-8v69H61V54l-10 8-12-13 20-18Z"/><path d="m73 22 7 13 7-13M80 35v87" class="detail"/>',
  shirt: '<path d="m60 32 13-9h14l13 9 18 13-11 14-10-7v61H53V52l-10 7-11-14 18-13Z"/><path d="m73 23 7 13 7-13M80 36v68" class="detail"/>',
  trouser: '<path d="M54 29h52l-4 45-4 55H79l-2-43-4 43H53l-2-55-3-45Z"/><path d="M54 42h50M80 43v26" class="detail"/>',
  dress: '<path d="m65 28 9-7h12l9 7 12 10-9 10 18 66H44l18-66-9-10 12-10Z"/><path d="m74 21 6 12 6-12M80 33v24m-22 13h44" class="detail"/>'
};

function createProductImage(kind: ArtworkKind, garment: string, ground: string) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180">' +
    '<defs><linearGradient id="fabric" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + garment + '"/><stop offset="1" stop-color="' + garment + '" stop-opacity=".76"/></linearGradient></defs>' +
    '<rect width="160" height="180" fill="' + ground + '"/>' +
    '<circle cx="129" cy="34" r="24" fill="#ffffff" opacity=".24"/>' +
    '<ellipse cx="81" cy="143" rx="38" ry="7" fill="#37302b" opacity=".12"/>' +
    '<g fill="url(#fabric)" stroke="#37302b" stroke-opacity=".3" stroke-width="1.4" stroke-linejoin="round">' + artworkPaths[kind] + '</g>' +
    '<text x="12" y="166" fill="#37302b" opacity=".58" font-family="Arial,sans-serif" font-size="6" letter-spacing="1.5">NORTHLINE · EVERYDAY FORM</text></svg>';
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

export const PRODUCTS: Product[] = [
  {
    id: 'solstice-coat',
    name: 'The Solstice Coat',
    category: 'Outerwear',
    priceInCents: 24800,
    image: createProductImage('coat', '#9d8065', '#e9ded2'),
    imageAlt: 'Illustration of a long warm taupe coat',
    description: 'A relaxed, softly structured layer that brings a little intention to the everyday.',
    material: 'Recycled wool blend · Fully lined · Made in small runs'
  },
  {
    id: 'everyday-overshirt',
    name: 'Everyday Overshirt',
    category: 'Tops',
    priceInCents: 12800,
    image: createProductImage('shirt', '#75816a', '#e3e6d9'),
    imageAlt: 'Illustration of an olive green button-front overshirt',
    description: 'The easy in-between layer. Wear it open, buttoned up, or borrowed for the commute home.',
    material: 'Organic cotton twill · Natural corozo buttons'
  },
  {
    id: 'relaxed-trouser',
    name: 'Relaxed Wool Trouser',
    category: 'Bottoms',
    priceInCents: 15800,
    image: createProductImage('trouser', '#514e4a', '#e4ded8'),
    imageAlt: 'Illustration of charcoal wide-leg trousers',
    description: 'An easy drape and a clean line make these a quiet workhorse in any wardrobe.',
    material: 'Responsible wool blend · Pockets in all the right places'
  },
  {
    id: 'column-dress',
    name: 'Linen Column Dress',
    category: 'Dresses',
    priceInCents: 18800,
    image: createProductImage('dress', '#b86f54', '#f0ddd2'),
    imageAlt: 'Illustration of a terracotta sleeveless column dress',
    description: 'Light linen with an uncomplicated silhouette, ready for a warm day or a late table.',
    material: 'European flax linen · Garment washed for softness'
  },
  {
    id: 'studio-knit',
    name: 'Studio Knit',
    category: 'Tops',
    priceInCents: 9800,
    image: createProductImage('shirt', '#c09a72', '#eee4d4'),
    imageAlt: 'Illustration of a sand-colored knit top',
    description: 'A tactile, close-to-the-skin knit with enough ease to make staying in feel like a plan.',
    material: 'Cotton and linen blend · Naturally breathable'
  },
  {
    id: 'weekender-jacket',
    name: 'The Weekender Jacket',
    category: 'Outerwear',
    priceInCents: 21800,
    image: createProductImage('coat', '#65767a', '#dce5e4'),
    imageAlt: 'Illustration of a slate blue everyday jacket',
    description: 'A light, practical shell with room for the things worth bringing along.',
    material: 'Recycled cotton canvas · Low-impact water-resistant finish'
  }
];

export const CATEGORIES: Category[] = ['Outerwear', 'Tops', 'Bottoms', 'Dresses'];

export function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceInCents / 100);
}
