import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface T {
    completed: boolean;
    level: bigint;
    stars: bigint;
}
export interface backendInterface {
    addCoins(amount: bigint): Promise<void>;
    buyDetector(): Promise<void>;
    buyMultiplier(): Promise<void>;
    buyShield(): Promise<void>;
    getAllLevelProgress(): Promise<Array<T>>;
    getCoins(): Promise<bigint>;
    getLevelProgress(level: bigint): Promise<T>;
    getPowerupInventory(): Promise<[bigint, bigint, bigint]>;
    spendCoins(amount: bigint): Promise<void>;
    updateLevelProgress(level: bigint, stars: bigint, completed: boolean): Promise<void>;
    useDetector(): Promise<void>;
    useMultiplier(): Promise<void>;
    useShield(): Promise<void>;
}
