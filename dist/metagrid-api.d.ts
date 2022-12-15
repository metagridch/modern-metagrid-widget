/**
 * Possible metagrid entities
 */
export declare enum MetagridEntities {
    person = "person"
}
/**
 * Supported metagrid languages
 */
export declare enum MetagridLanguages {
    de = "de",
    fr = "fr",
    en = "en",
    it = "it",
    nl = "nl"
}
/**
 * Metagrid status will return the state of the response
 * possible status-codes: all http status codes and 0. 0 stands for a general network issue
 * */
export interface MetagridStatus {
    found: boolean;
    statusCode: number;
    error?: string;
}
/**
 * The final struct of a fetch call with the status and the data
 */
export interface MetagridData {
    status: MetagridStatus;
    data: MetagridLinks | [];
}
/**
 * All possible values for a single link of metagrid
 */
export interface MetagridLink {
    provider: string;
    url: string;
    shortDescription?: string;
    longDescription?: string;
}
/**
 * An array of Metagrid links
 */
interface MetagridLinks extends Array<MetagridLink> {
}
/**
 * MetagridApi class to fetch data from the metagrid server
 */
export declare class MetagridApi {
    /**
       * Slug of a project
       * You can find all the slugs over https://api.metagrid.ch/providers.json?size=40
       * f.e. https://dodis.ch/P5 -> projectSlug: dodis
       * @private
       */
    private readonly projectSlug;
    /**
       * The entity to query
       * @private
       */
    private readonly entity;
    /**
       * Metagrid api url
       * @private
       */
    private readonly apiUrl;
    constructor(projectSlug: string, entity: MetagridEntities, apiUrl?: string);
    /**
       * Fetch a metagrid identifier
       * @param identifier
       * @param langauge
       * @param includeDescription
       * @throws error if the fetch process fails
       */
    fetch(identifier: string, langauge?: MetagridLanguages, includeDescription?: boolean): Promise<MetagridData>;
    /**
       * Build the MetagridData object for a given response or status
       * @param status
       * @private
       */
    private buildResponse;
    /**
       * Map the response from metagrid to an array of objects
       * @param data
       * @private
       */
    private transform;
    /**
       * Fabric to create a new MetagridApi instance
       * @param projectSlug
       * @param entity
       */
    static create(projectSlug: string, entity?: string): MetagridApi;
}
export {};
//# sourceMappingURL=metagrid-api.d.ts.map