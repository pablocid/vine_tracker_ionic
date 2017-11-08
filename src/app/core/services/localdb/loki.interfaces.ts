export interface LokiFace {
    getCollection(name: string): LokiCollection;
    loadDatabase(first: any, callback: any): void;
    listCollections(): string[];
    removeCollection(name: string): any;
    loadCollection(name: string): LokiCollection;
    saveDatabase(callback?: any): void;
    addCollection(name: string, options?: { indices: any[], unique: any[] }): LokiCollection;
    close(): void;
}
export interface LokiCollection {
    insert(object: Object): void;
    remove(id: string);
    removeDataOnly(): void;
    get(id: string): any;
    by(field: string, id: string): any;
    find(query?: Object): any[];
    findOne(query?: Object): any;
    findAndRemove(query?: Object): void;
    where(fun: Function): any[];
    chain(): LokiChain,
    ensureUniqueIndex(field: string): void;
    update(object: Object): void;
    data: Object[];
}

export interface LokiChain {
    find(query: Object): LokiChain;
    limit(num: number): LokiChain;
    offset(num: number): LokiChain;
    remove(): LokiChain;
    branchResultset(): LokiChain;
    where(fun: Function): LokiChain;
    sort(fun: Function): LokiChain;
    update(fun: Function): LokiChain;
    data(): any[];
}