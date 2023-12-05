export interface Option {
  id: string;
  name: string;
}

export const tapeWidth: Option[] = [
  { id: '25mm', name: '25 mm' },
  { id: '36mm', name: '36 mm' },
  { id: '38mm', name: '38 mm' },
];

export const numberOfRoles: Option[] = [
  { id: '1box-24roles', name: '1 box (24 roles)' },
  { id: '1box-36roles', name: '1 box (36 roles)' },
  { id: '1roll', name: '1 roll' },
  { id: '12roll', name: '12 roles' },
  { id: '24roles', name: '24 roles' },
  { id: '3roles', name: '3 roles' },
  { id: '6roles', name: '6 roles' },
  { id: '2box-48roles', name: '2 box (48 roles)' },
  { id: '2box-72roles', name: '2 box (72 roles)' },
  { id: '3box-108roles', name: '3 box (108 roles)' },
  { id: '3box-72roles', name: '3 box (72 roles)' },
];
