import { Category } from "@/types/models";
import { createContext, useContext } from "react";
import { useAsyncStorageState } from "../hooks/use-async-storage-state";


type CategoryContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  categoriesHydrated: boolean;
};

const CategoryContext = createContext<CategoryContextType | null>(null);

import default_categories from '@/data/default_categories.json';
const DEFAULT_CATEGORIES = default_categories.categories;
const categoriesKey = "categories";

export function CategoryProvider({ children } : {children : React.ReactNode}) {
  const [categories, setCategories, categoriesHydrated] =
    useAsyncStorageState<Category[]>(categoriesKey, DEFAULT_CATEGORIES);

  const addCategory = (category : Category) => {
    setCategories(prev => [...prev, category ]);
  };

  const removeCategory = (id: string) => {
    setCategories(prev => [...prev.filter(c => c.id !== id)]);
  };

  return (
    <CategoryContext.Provider value={{ categories, setCategories, addCategory, removeCategory, categoriesHydrated }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategories must be inside <CategoryProvider>");
  return ctx;
}