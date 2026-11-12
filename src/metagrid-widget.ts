import { MetagridApi, MetagridData, MetagridLanguages } from './metagrid-api.js'

let idCounter = 0
const uid = (): string => `metagrid-${++idCounter}`

const newTabText: Record<string, string> = {
  de: '(öffnet in neuem Tab)',
  fr: '(s’ouvre dans un nouvel onglet)',
  it: '(si apre in una nuova scheda)',
  nl: '(opent in nieuw tabblad)',
  en: '(opens in a new tab)'
}

/**
 * Hidden element referenced via aria-describedby. Hidden elements are still
 * read when referenced, so no CSS is needed.
 */
function hiddenText (text: string, lang?: string): HTMLSpanElement {
  const span = document.createElement('span')
  span.id = uid()
  span.hidden = true
  span.textContent = text
  if (typeof lang !== 'undefined') span.lang = lang
  return span
}

function newTabNote (language?: string): HTMLSpanElement {
  const lang = typeof language !== 'undefined' && language in newTabText ? language : 'en'
  return hiddenText(newTabText[lang], lang)
}

function makeNewTabLink (a: HTMLAnchorElement, describedBy: string): void {
  a.target = '_blank'
  a.rel = 'noopener'
  a.setAttribute('aria-describedby', describedBy)
}

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
    ul.lang = language
    const note = newTabNote(language)
    data.data.forEach((d) => {
      const link = d
      const li = document.createElement('li')
      li.classList.add('metagrid-item')
      const a = document.createElement('a')
      a.classList.add('metagrid-link')
      a.href = link.url
      a.innerText = link.provider
      let describedBy = note.id
      // title is for mouse users; screen readers get the description via aria-describedby
      if (typeof link.longDescription !== 'undefined') {
        a.title = link.longDescription
        const desc = hiddenText(link.longDescription)
        describedBy = `${desc.id} ${note.id}`
        li.append(desc)
      }
      makeNewTabLink(a, describedBy)
      li.append(a)
      ul.append(li)
    })
    mountTo.append(ul, note)
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
  div.lang = 'en'
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
  // ponytail: "Links powered by" stays English as before; only the SAHS part is tagged with its language
  const sahsLang = typeof language !== 'undefined' && [MetagridLanguages.de, MetagridLanguages.fr, MetagridLanguages.it].includes(language) ? language : 'en'
  div.innerHTML = `Links powered by <a href="https://www.metagrid.ch">Metagrid</a> – <span lang="${sahsLang}">${sahsText}</span>`
  const note = newTabNote(language)
  makeNewTabLink(div.querySelector('a') as HTMLAnchorElement, note.id)
  div.append(note)
  return div
}
