// export all classes need to be publiced as ThingIF library
export * from "./RequestObjects"
export * from "./Site"
export * from "./App"
export * from "./Command"
export * from "./Predicate"
export * from "./ServerCode"
export * from "./ServerCodeResult"
export * from "./Trigger"
export * from "./APIAuthor"
export * from "./TypedID"
export * from "./AppBuilder"
export * from "./ThingIFError"

export function getSDKVersion(): string {
    return "0.1";
}