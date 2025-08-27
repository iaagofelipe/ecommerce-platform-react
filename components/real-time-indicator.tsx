"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Clock, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useHealth } from "@/hooks/use-orders"

interface RealTimeIndicatorProps {
  isPolling?: boolean
  lastUpdate?: Date
  className?: string
}

export function RealTimeIndicator({ isPolling = false, lastUpdate, className }: RealTimeIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const { data: healthData, isError: healthError } = useHealth()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const isConnected = isOnline && healthData?.status === "UP" && !healthError
  const statusColor = isConnected
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  const StatusIcon = isConnected ? (isPolling ? Wifi : CheckCircle) : WifiOff

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <Badge className={statusColor}>
            <StatusIcon className={`h-3 w-3 mr-1 ${isPolling ? "animate-pulse" : ""}`} />
            {isConnected ? (isPolling ? "Atualizando" : "Online") : "Offline"}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">Status da Conexão</h4>
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${isConnected ? "text-green-600" : "text-red-600"}`} />
              <span className="text-sm">{isConnected ? "Conectado ao servidor" : "Desconectado"}</span>
            </div>
          </div>

          {lastUpdate && (
            <div className="space-y-2">
              <h4 className="font-medium">Última Atualização</h4>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{lastUpdate.toLocaleTimeString("pt-BR")}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Configurações</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Polling: {isPolling ? "3s" : "Desabilitado"}</p>
              <p>• Health Check: 30s</p>
              <p>• SSE: Em breve</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
