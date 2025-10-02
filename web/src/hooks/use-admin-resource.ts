"use client";

import useSWR, { useSWRConfig } from "swr";
import { apiMutation, apiRequest } from "@/lib/api-client";

type AdminListResponse<T> = { data: T[] };
type AdminSingleResponse<T> = { data: T };

type Identifiable = { id: number };

type CreateOptions<T> = {
  optimistic?: T;
};

type UpdateOptions<T> = {
  optimistic?: T;
};

type DeleteOptions = {
  optimisticId?: number;
};

export function useAdminResource<T extends Identifiable>(path: string) {
  //1.- Fetch the admin list using SWR so the UI stays in sync with mutations.
  const { data, error, isLoading, mutate } = useSWR<AdminListResponse<T>>(path, (url: string) =>
    apiRequest<AdminListResponse<T>>(url),
  );
  const { mutate: globalMutate } = useSWRConfig();

  async function create(payload: unknown, options: CreateOptions<T> = {}) {
    //1.- Perform the POST request with optimistic data appended to the cache.
    await mutate(
      async (current) => {
        const response = await apiMutation<AdminSingleResponse<T>>(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return { data: [...(current?.data ?? []), response.data] };
      },
      {
        optimisticData: {
          data: [...(data?.data ?? []), ...(options.optimistic ? [options.optimistic] : [])],
        },
        rollbackOnError: true,
        revalidate: false,
      },
    );
  }

  async function update(id: number, payload: unknown, options: UpdateOptions<T> = {}) {
    //1.- Send a PATCH request and optimistically merge the response into the cache.
    const url = `${path}/${id}`;
    await mutate(
      async (current) => {
        const response = await apiMutation<AdminSingleResponse<T>>(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return {
          data: (current?.data ?? []).map((item) => (item.id === id ? response.data : item)),
        };
      },
      {
        optimisticData: {
          data: (data?.data ?? []).map((item) => (item.id === id && options.optimistic ? options.optimistic : item)),
        },
        rollbackOnError: true,
        revalidate: false,
      },
    );
  }

  async function destroy(id: number, options: DeleteOptions = {}) {
    //1.- Issue the DELETE request and optimistically filter the item from cache.
    const url = `${path}/${id}`;
    await mutate(
      async (current) => {
        await apiMutation<unknown>(url, { method: "DELETE" });
        return { data: (current?.data ?? []).filter((item) => item.id !== id) };
      },
      {
        optimisticData: {
          data: (data?.data ?? []).filter((item) => item.id !== (options.optimisticId ?? id)),
        },
        rollbackOnError: true,
        revalidate: false,
      },
    );
  }

  async function refresh() {
    //1.- Revalidate the cache through SWR's global mutate utility.
    await globalMutate(path);
  }

  return {
    items: data?.data ?? [],
    isLoading,
    error,
    create,
    update,
    destroy,
    refresh,
  } as const;
}
