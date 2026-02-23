import { useState } from "react"
import { Button } from "~/components/ui/button"
import "~/globals.css"

function IndexSidepanel() {
  const [data, setData] = useState("")

  return (
    <div className="w-full h-screen bg-background text-foreground p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Avianca Autoform</h1>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Ingresa un valor:</label>
        <input 
          onChange={(e) => setData(e.target.value)} 
          value={data}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Escribe aquí..."
        />
      </div>

      <Button variant="default" className="w-full">
        Enviar datos
      </Button>

      <a 
        href="https://docs.plasmo.com" 
        target="_blank"
        className="text-sm text-primary underline hover:text-primary/80"
      >
        Ver documentación
      </a>
    </div>
  )
}

export default IndexSidepanel

