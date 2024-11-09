import { MetagridLanguages } from './metagrid-api.js';
/**
   * Widget renders the metagrid links into a given html element
   * @param mountTo
   * @param projectSlug
   * @param identifier
   * @param language
   * @param includeDescription
   */
export declare function widget(mountTo: HTMLElement, projectSlug: string, identifier: string, language?: string, includeDescription?: boolean): Promise<void>;
/**
   * Create credit div for metagrid
   * @param language
   */
export declare function credit(language?: MetagridLanguages): HTMLElement;
//# sourceMappingURL=metagrid-widget.d.ts.map