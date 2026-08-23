export type Category = {
  id: number;
  name: string;
  thumbnail: string | null;
  promptCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Prompt = {
  id: number;
  categoryId: number;
  thumbnail: string | null;
  promptText: string;
  createdAt: string;
  updatedAt: string;
};
