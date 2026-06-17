import { Category, CategoryNode } from "../types/categories";

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const map = new Map<string, CategoryNode>();
  const roots: CategoryNode[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, {
      id: cat.id,
      name: cat.name['de-DE'],
      children: [],
    });
  });

  categories.forEach((cat) => {
    const node = map.get(cat.id)!;
    const parentId = cat.ancestors?.at(-1)?.id;

    if (parentId && map.has(parentId)) {
      map.get(parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}
