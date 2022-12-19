/**
 * Possible metagrid entities
 */
export enum MetagridEntities {
  person = 'person',
}

/**
 * Supported metagrid languages
 */
export enum MetagridLanguages {
  de = 'de',
  fr = 'fr',
  en = 'en',
  it = 'it',
  nl = 'nl',
}

/**
 * Metagrid status will return the state of the response
 * possible status-codes: all http status codes and 0. 0 stands for a general network issue
 * */
export interface MetagridStatus {
  found: boolean
  statusCode: number
  error?: string
}

/**
 * The final struct of a fetch call with the status and the data
 */
export interface MetagridData {
  status: MetagridStatus
  data: MetagridLinks | []
}

/**
 * All possible values for a single link of metagrid
 */
export interface MetagridLink {
  provider: string
  url: string
  shortDescription?: string
  longDescription?: string
}

/**
 * An array of Metagrid links
 */
export interface MetagridLinks extends Array<MetagridLink> {}

/**
 * A single item detail from the metagrid api
 */
interface metagridResponseItmDetail {
  url: string
  short_description: string
  long_description: string
}

/**
 * A single item from the metagrid api
 */
type metagridResponseItem = Record<string, metagridResponseItmDetail | string>

/**
 * The metagrid api response
 */
interface metagridResponse extends Array<metagridResponseItem> {}

/**
 * MetagridApi class to fetch data from the metagrid server
 */
export class MetagridApi {
  /**
     * Slug of a project
     * You can find all the slugs over https://api.metagrid.ch/providers.json?size=40
     * f.e. https://dodis.ch/P5 -> projectSlug: dodis
     * @private
     */
  private readonly projectSlug: string

  /**
     * The entity to query
     * @private
     */
  private readonly entity: MetagridEntities = MetagridEntities.person

  /**
     * Metagrid api url
     * @private
     */
  private readonly apiUrl: string = 'https://api.metagrid.ch'

  constructor (projectSlug: string, entity: MetagridEntities, apiUrl?: string) {
    this.projectSlug = projectSlug
    this.entity = entity
    if (typeof apiUrl !== 'undefined') {
      this.apiUrl = apiUrl
    }
  }

  /**
     * Fetch a metagrid identifier
     * @param identifier
     * @param langauge
     * @param includeDescription
     * @throws error if the fetch process fails
     */
  public async fetch (identifier: string, langauge: MetagridLanguages = MetagridLanguages.de, includeDescription: boolean = false): Promise<MetagridData> {
    const queryParams: string[] = []
    queryParams.push(`include=${String(includeDescription)}`)
    queryParams.push(`language=${langauge}`)
    try {
      const resp = await fetch(`${this.apiUrl}/widget/${this.projectSlug}/${this.entity}/${identifier}.json?${queryParams.join('&')}`)
      // 4xx or 5xx error in the api
      if (!resp.ok) {
        return this.buildResponse(resp)
      }
      // return successfully
      return this.buildResponse(resp, this.transform(await resp.json()))
    } catch (error) {
      // return a general network error
      return this.buildResponse({
        statusCode: 0,
        found: false,
        error: 'unknown network error'
      })
    }
  }

  /**
     * Build the MetagridData object for a given response or status
     * @param status
     * @private
     */
  private buildResponse (status: MetagridStatus): MetagridData
  private buildResponse (resp: Response): MetagridData
  private buildResponse (resp: Response, data: MetagridLinks | []): MetagridData
  private buildResponse (resp: any, data: MetagridLinks | [] = []): MetagridData {
    if ('ok' in resp) {
      return {
        status: {
          statusCode: resp.status,
          found: resp.status === 200,
          error: resp.statusText
        },
        data
      }
    } else {
      return {
        status: resp as MetagridStatus,
        data: []
      }
    }
  }

  /**
     * Map the response from metagrid to an array of objects
     * @param data
     * @private
     */
  private transform (data: metagridResponse): MetagridLinks {
    return Object.keys(data[0]).map((key) => {
      const item: metagridResponseItmDetail | string = data[0][key]
      if (typeof item === 'string') {
        return {
          provider: key,
          url: item
        }
      }
      const result: MetagridLink = {
        provider: key,
        url: item.url,
        shortDescription: item.short_description,
        longDescription: item.long_description
      }
      return result
    })
  }

  /**
     * Fabric to create a new MetagridApi instance
     * @param projectSlug
     * @param entity
     */
  public static create (projectSlug: string, entity: string = 'person'): MetagridApi {
    return new MetagridApi(projectSlug, entity as MetagridEntities)
  }
}
