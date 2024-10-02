export interface IBaseService<T> {
    create(item: T): Promise<T>;
    update(id: string, item: Partial<T>): Promise<T>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<T | null>;
    findAll(): Promise<T[]>;
}
