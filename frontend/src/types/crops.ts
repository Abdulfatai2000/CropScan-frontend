export type Crop = 'Tomato' | 'Maize' | 'Bell pepper' | 'Citrus' | 'Potato';

export interface CropInfo {
  name: Crop;
  eyebrow: string;
  image: string;
  position?: string;
  scientificName: string;
  yorubaName: string;
  description: string;
  commonDiseases: string[];
}

export const SUPPORTED_CROPS: CropInfo[] = [
  {
    name: 'Tomato',
    eyebrow: 'Fruit crop',
    scientificName: 'Solanum lycopersicum',
    yorubaName: 'Tòmátì',
    image: 'https://images.unsplash.com/photo-1530541835461-dedaf9cf368a?auto=format&fit=crop&w=900&q=82',
    description: 'High-value horticultural crop susceptible to early blight, late blight, leaf mold, and bacterial spot.',
    commonDiseases: ['Early Blight', 'Late Blight', 'Leaf Mold', 'Bacterial Spot', 'Yellow Leaf Curl Virus'],
  },
  {
    name: 'Maize',
    eyebrow: 'Cereal crop',
    scientificName: 'Zea mays',
    yorubaName: 'Àgbàdo',
    image: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=900&q=82',
    description: 'Vital staple cereal vulnerable to common rust, northern leaf blight, and grey leaf spot.',
    commonDiseases: ['Common Rust', 'Northern Leaf Blight', 'Cercospora Leaf Spot'],
  },
  {
    name: 'Bell pepper',
    eyebrow: 'Fruit crop',
    scientificName: 'Capsicum annuum',
    yorubaName: 'Ata tàtáṣé',
    image: 'https://images.unsplash.com/photo-1721520290342-7d4362e180bb?auto=format&fit=crop&w=900&q=82',
    description: 'Warm-season solanaceous crop prone to bacterial spot and viral mosaic infections.',
    commonDiseases: ['Bacterial Spot', 'Healthy Foliage'],
  },
  {
    name: 'Citrus',
    eyebrow: 'Tree crop',
    scientificName: 'Citrus spp.',
    yorubaName: 'Ọsàn',
    image: 'https://images.unsplash.com/photo-1735992522542-90e535107e76?auto=format&fit=crop&w=900&q=82',
    description: 'Perennial orchard crop monitored for citrus greening (Huanglongbing), black spot, and canker.',
    commonDiseases: ['Citrus Greening (HLB)', 'Black Spot', 'Canker'],
  },
  {
    name: 'Potato',
    eyebrow: 'Root crop',
    scientificName: 'Solanum tuberosum',
    yorubaName: 'Kùkùndùkú / Pútátò',
    image: 'https://images.unsplash.com/photo-1529313780224-1a12b68bed16?auto=format&fit=crop&w=900&q=82',
    position: 'center 72%',
    description: 'Tuber crop susceptible to devastating fungal blights that cause rapid foliage necrosis.',
    commonDiseases: ['Early Blight', 'Late Blight', 'Healthy Foliage'],
  },
];
