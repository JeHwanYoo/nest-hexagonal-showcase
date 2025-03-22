export type ModelInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string
    createdAt?: Date
    updatedAt?: Date
}
