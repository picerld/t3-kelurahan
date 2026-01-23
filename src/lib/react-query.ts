import { QueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            onError: () => {
                toast.error("Terjadi kesalahan");
            }
        }
    }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiFnReturnType<FnType extends (...args: any) => Promise<unknown>> =
  Awaited<ReturnType<FnType>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryConfig<T extends (...args: any[]) => unknown> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  MutationFnType extends (...args: any) => Promise<any>
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
