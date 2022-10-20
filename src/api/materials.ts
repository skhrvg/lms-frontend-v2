import axios from './axios';
import type { MaterialContentBlocks } from '@/types/materials';

export const getMaterialById: (
  id: string,
) => Promise<MaterialContentBlocks> = async (id) => {
  const url = `/api/v2/notion/materials/${id}/`;

  return (await axios.get(url)).data as MaterialContentBlocks;
};