import style from './ItkVtkViewer.module.css'
import '@material/web/navigationdrawer/navigation-drawer.js'
import './serviceContext'
import './collapse-ui'
import { setContext } from './context'
import { makeHtml } from './utils'
import { updateDrawer } from './toggleUICollapsed'

function createInterface(context) {
  context.viewContainers = new Map()

  const viewContainer = document.createElement('div')
  viewContainer.className = `${style.viewContainer}`
  context.viewContainers.set('volume', viewContainer)
  setContext(viewContainer, context)

  const serviceContextProvider = document.createElement('service-context')
  serviceContextProvider.appendChild(viewContainer)
  context.rootContainer.appendChild(serviceContextProvider)

  const viewport = document.createElement('div')
  viewContainer.appendChild(viewport)
  viewport.setAttribute('class', style.viewport)

  const container3d = context.renderingViewContainers.get('volume')
  viewport.appendChild(container3d)
  container3d.style.height = '100%'

  // if somehow already set (by non reference-ui from config obj?)
  if (!context.uiContainer) {
    context.uiContainer = document.createElement('div')
  }

  const sidebar = makeHtml(`
    <div class='${style.uiContainer}'>
      <md-navigation-drawer type="dismissible" id='drawer' class='${style.drawer}'></md-navigation-drawer>
      <collapse-ui class='${style.collapseButton}'/>
    </div>
  `)
  const drawer = sidebar.querySelector('#drawer')
  drawer.appendChild(context.uiContainer)
  viewport.appendChild(sidebar)
  context.drawer = drawer

  setTimeout(() => {
    // hack to keep scroll bar from squishing uiContainer, because uiContainer width does not get reduces with scroll bar.
    drawer.shadowRoot.children[0].style.overflow = 'visible'
    // sets hacked width of drawer based on context.uiCollapsed
    updateDrawer(context)
  }, 0)

  if (!context.uiGroups) {
    // String to UI group element
    context.uiGroups = new Map()
  }
}

export default createInterface
