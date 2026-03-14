import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useBackendCoins() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["coins"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCoins();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAddCoins() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      if (!actor) return;
      await actor.addCoins(BigInt(amount));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coins"] }),
  });
}

export function useSpendCoins() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      if (!actor) return;
      await actor.spendCoins(BigInt(amount));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coins"] }),
  });
}

export function useBackendLevelProgress() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["levelProgress"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLevelProgress();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useUpdateLevelProgress() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      level: number;
      stars: number;
      completed: boolean;
    }) => {
      if (!actor) return;
      await actor.updateLevelProgress(
        BigInt(args.level),
        BigInt(args.stars),
        args.completed,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["levelProgress"] }),
  });
}

export function useBackendPowerups() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["powerups"],
    queryFn: async () => {
      if (!actor)
        return [BigInt(0), BigInt(0), BigInt(0)] as [bigint, bigint, bigint];
      return actor.getPowerupInventory();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// Build method name dynamically to avoid biome hook detection false positives
function makePowerupMethodName(prefix: string, type: string): string {
  return `${prefix}${type.charAt(0).toUpperCase()}${type.slice(1)}`;
}

type AnyRecord = Record<string, () => Promise<void>>;

export function useBuyPowerup() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (type: "detector" | "multiplier" | "shield") => {
      if (!actor) return;
      const methodName = makePowerupMethodName("buy", type);
      await (actor as unknown as AnyRecord)[methodName]();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["powerups", "coins"] }),
  });
}

export function useUsePowerupBackend() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (type: "detector" | "multiplier" | "shield") => {
      if (!actor) return;
      const methodName = makePowerupMethodName("use", type);
      await (actor as unknown as AnyRecord)[methodName]();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["powerups"] }),
  });
}
