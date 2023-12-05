export interface TapeDescription {
  id: string;
  title: string;
  description: string;
  materials: string[];
}

// TODO: add proper id's when needed
export const tapesDescription: TapeDescription[] = [
  {
    id: '',
    title: 'QuiP Purple Masking Tape',
    description: `QuiP Masking Tape for sensitive surfaces has low adhesive strength 
    and is suitable for application on:`,
    materials: ['Wallpaper', 'Latex'],
  },
  {
    id: '',
    title: 'QuiP GOLD Masking Tape',
    description: `Precision Masking tape for smooth surfaces has an average adhesion strength. 
    This tape is ideally suited for masking even surfaces;`,
    materials: ['Glas', 'Metal', 'Wood'],
  },
  {
    id: '',
    title: 'QuiP Green Masking Tape',
    description: `Masking tape for freshly surfaces has an average adhesion strength. 
    This tape is ideally suited for masking on freshly painted surfaces.`,
    materials: ['Just painted door frames', 'Just painted walls'],
  },
  {
    id: '',
    title: 'QuiP Rose Masking Tape',
    description: `Precision Masking tape with a strong adhesion is suited for 
    masking on slightly rough surfaces.`,
    materials: ['Stucco', 'Concrete'],
  },
];
