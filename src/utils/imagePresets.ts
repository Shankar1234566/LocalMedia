export interface ImagePreset {
  id: string;
  name: string;
  category: string;
  url: string;
  isClickbait?: boolean;
}

export const SAMPLE_IMAGE_PRESETS: ImagePreset[] = [
  {
    id: 'preset-pothole',
    name: 'Road Hazard / Pothole',
    category: 'civic',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'preset-water',
    name: 'Water Pipeline Leak',
    category: 'civic',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'preset-storm',
    name: 'Storm / Urban Flood',
    category: 'environment',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'preset-school',
    name: 'School / University Campus',
    category: 'education',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'preset-community',
    name: 'Community Drive / Market',
    category: 'community',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'preset-clickbait',
    name: 'Suspicious / Stock CGI (Test Flagging)',
    category: 'crime',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
    isClickbait: true,
  },
];
