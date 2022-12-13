import apiClient from '@/lib/axios'
import useSWR from 'swr'
import { strage, reqPath } from '@/const/Consts'

export function useUserFavorites(id: any, page: number, perPage: number) {
  const fetcher = (url: string) =>
    apiClient
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
        },
      })
      .then((res) => res.data)

  const { data: data, error } = useSWR(
    id
      ? reqPath('favorites', String(id)) +
          '?' +
          new URLSearchParams({
            per_page: String(perPage),
            page: String(page),
          })
      : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      onErrorRetry: (error) => {
        // 401でトークンを削除
        if (error.response && error.response.status == 401) {
          localStorage.removeItem(strage.Token)
        }
      },
    },
  )

  return {
    response: data,
    isLoading: !error && !data,
    isError: error,
  }
}
