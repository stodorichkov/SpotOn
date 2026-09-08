export interface CategoryLike {
  nameEn?: string | null;
  nameBg?: string | null;
}

export const getCategoryDisplayName = (category: CategoryLike, language: string): string => {
  const preferred = language?.toLowerCase().startsWith('bg') ? category.nameBg : category.nameEn;
  return preferred || category.nameEn || category.nameBg || '';
};

export const getCategoryColorSeed = (category: CategoryLike): string =>
  category.nameEn || category.nameBg || '';
