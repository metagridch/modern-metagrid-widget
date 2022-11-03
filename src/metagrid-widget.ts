import { MetagridApi, MetagridData, MetagridLanguages } from './metagrid-api.js'

/**
   * Widget renders the metagrid links into a given html element
   * @param mountTo
   * @param projectSlug
   * @param identifier
   * @param language
   * @param includeDescription
   */
export async function widget (mountTo: HTMLElement, projectSlug: string, identifier: string, language: string = 'de', includeDescription = false): Promise<void> {
  const api: MetagridApi = MetagridApi.create(projectSlug)
  const data: MetagridData = await api.fetch(identifier, language as MetagridLanguages, includeDescription)
  if (data.status.found) {
    // build up link list
    const ul = document.createElement('ul')
    ul.classList.add('metagrid-list')
    data.data.forEach((d) => {
      const link = d
      const li = document.createElement('li')
      li.classList.add('metagrid-item')
      const a = document.createElement('a')
      a.classList.add('metagrid-link')
      a.href = link.url
      a.innerText = link.provider
      a.target = '_blank'
      // check if we can set a title
      if (typeof link.longDescription !== 'undefined') {
        a.title = link.longDescription
      }
      li.append(a)
      ul.append(li)
    })
    mountTo.append(ul)
    mountTo.append(credit(language as MetagridLanguages))
  } else {
    console.info(`Metagrid didn't find a concordance. Statuscode: ${data.status.statusCode}, error: ${data.status.error as string}`)
  }
}

/**
   * Create credit div for metagrid
   * @param language
   */
export function credit (language?: MetagridLanguages): HTMLElement {
  const div = document.createElement('div')
  div.classList.add('metagrid-credit')
  let sahsText: string = 'the networking initiative of the SAHS'
  switch (language) {
    case MetagridLanguages.de:
      sahsText = 'die Vernetzungsinitiative der SAGW'
      break
    case MetagridLanguages.fr:
      sahsText = 'l’initiative de mise en réseau de l’ASSH'
      break
    case MetagridLanguages.it:
      sahsText = 'l’iniziativa di messa in rete dell’ASSU'
      break
  }
  div.innerHTML = `Links powered by <a href="https://www.metagrid.ch" target="_blank">Metagrid</a> – ${sahsText}`
  return div
}
