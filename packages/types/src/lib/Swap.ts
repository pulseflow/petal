export type Swap<Object, Key extends keyof Object, RecordValue> = Omit<Object, Key> & Record<Key, RecordValue>;
