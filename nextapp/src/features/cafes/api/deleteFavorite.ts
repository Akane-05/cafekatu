import apiClient from '@/lib/axios'
import { strage } from '@/const/Consts'
import { BasicRes } from '@/features/index'
import { resolveHandler, errorHandler } from '@/features/index'

export async function deleteFavorite(id: number): Promise<BasicRes> {
  return apiClient
    .delete(`/cafes/${id}/favorite`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const response = <BasicRes>resolveHandler(res)
      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
