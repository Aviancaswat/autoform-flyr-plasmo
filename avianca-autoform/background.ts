// Handle the extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    await chrome.sidePanel.open({ tabId: tab.id })
  }
})

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[Background] onMessage listener ejecutado. Request:", request)
  if (request.action === "changeBackground") {
    console.log("[Background] Mensaje recibido para cambiar background con color:", request.color)
    
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      console.log("[Background] Pestaña activa encontrada:", tabs[0]?.id, tabs[0]?.url)
      if (tabs[0]?.id) {
        // Try to send message to the content script in the active tab
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "changeBackground",
          color: request.color
        }, { frameId: 0 }).then(() => {
          console.log("[Background] Mensaje enviado al content script exitosamente")
          sendResponse({ success: true, method: "contentScript" })
        }).catch((error) => {
          console.error("[Background] Error enviando mensaje al content script:", error.message)
          // If content script isn't injected, inject it now
          console.log("[Background] Content script no disponible, inyectando script directamente...")
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (color) => {
              console.log("[Script Inyectado] Función ejecutada, cambiando background a:", color)
              
              // Cambiar body
              document.body.style.backgroundColor = color
              document.body.style.setProperty('background-color', color, 'important')
              document.body.style.color = 'white'
              document.body.style.setProperty('color', 'white', 'important')
              
              // Cambiar html
              document.documentElement.style.backgroundColor = color
              document.documentElement.style.setProperty('background-color', color, 'important')
              document.documentElement.style.color = 'white'
              document.documentElement.style.setProperty('color', 'white', 'important')
              
              // Inyectar CSS directo
              const style = document.createElement('style')
              style.textContent = `
                html, body {
                  background-color: ${color} !important;
                  background: ${color} !important;
                  color: white !important;
                }
                * {
                  background-color: rgb(0,0,0,0) !important;
                  color: white !important;
                }
              `
              document.head.appendChild(style)
              
              const bgColor = window.getComputedStyle(document.body).backgroundColor
              const textColor = window.getComputedStyle(document.body).color
              console.log("[Script Inyectado] Background del body después del cambio:", bgColor)
              console.log("[Script Inyectado] Color del texto después del cambio:", textColor)
              
              return { 
                success: true, 
                bodyBg: bgColor,
                bodyColor: textColor,
                timestamp: new Date().toISOString()
              }
            },
            args: [request.color]
          }).then((results) => {
            console.log("[Background] Script inyectado exitosamente. Resultados:", results)
            sendResponse({ success: true, method: "scriptInjection", results })
          }).catch((err) => {
            console.error("[Background] Error al inyectar script:", err.message)
            sendResponse({ success: false, error: err.message, method: "scriptInjection" })
          })
        })
      } else {
        console.error("[Background] No se encontró pestaña activa")
        sendResponse({ success: false, error: "No active tab found" })
      }
    }).catch((err) => {
      console.error("[Background] Error al consultar pestaña activa:", err)
      sendResponse({ success: false, error: err.message })
    })
    
    // Indicar que vamos a responder de forma asincrónica
    return true
  }
})