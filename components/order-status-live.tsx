"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, CreditCard, Truck, XCircle, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getStatusColor, getStatusLabel } from "@/lib/utils"
import type { OrderStatus } from "@/lib/schemas"

const statusIcons = {
  NEW: Clock,
  PAY_PENDING: CreditCard,
  PAID: CheckCircle,
  SHIPPED: Truck,
  CANCELLED: XCircle,
}

const statusTimeline: OrderStatus[] = ["NEW", "PAY_PENDING", "PAID", "SHIPPED"]

interface OrderStatusLiveProps {
  status: OrderStatus
  createdAt: string
  isUpdating?: boolean
  className?: string
}

export function OrderStatusLive({ status, createdAt, isUpdating = false, className }: OrderStatusLiveProps) {
  const [animateStatus, setAnimateStatus] = useState(false)
  const [previousStatus, setPreviousStatus] = useState<OrderStatus>(status)

  useEffect(() => {
    if (status !== previousStatus) {
      setAnimateStatus(true)
      setPreviousStatus(status)

      const timer = setTimeout(() => {
        setAnimateStatus(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [status, previousStatus])

  const StatusIcon = statusIcons[status] || Clock
  const currentIndex = statusTimeline.indexOf(status)
  const progress = status === "CANCELLED" ? 0 : ((currentIndex + 1) / statusTimeline.length) * 100

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            Status do Pedido
            {isUpdating && <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />}
          </span>
          <Badge className={`${getStatusColor(status)} ${animateStatus ? "animate-pulse" : ""}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {getStatusLabel(status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress
            value={progress}
            className={`transition-all duration-1000 ${animateStatus ? "animate-pulse" : ""}`}
          />
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {statusTimeline.map((timelineStatus, index) => {
              const Icon = statusIcons[timelineStatus]
              const isActive = currentIndex >= index && status !== "CANCELLED"
              const isCurrent = status === timelineStatus

              return (
                <div key={timelineStatus} className="flex flex-col items-center space-y-2 relative">
                  <div
                    className={`
                    h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground text-muted-foreground bg-background"
                    }
                    ${isCurrent && animateStatus ? "ring-2 ring-primary ring-offset-2 animate-pulse" : ""}
                  `}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {getStatusLabel(timelineStatus)}
                  </span>

                  {/* Connection Line */}
                  {index < statusTimeline.length - 1 && (
                    <div
                      className={`absolute top-4 left-8 h-0.5 w-16 transition-all duration-500 ${
                        currentIndex > index && status !== "CANCELLED" ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Status Messages */}
        <div className="text-sm text-muted-foreground">
          {status === "NEW" && <p>Pedido criado e aguardando processamento...</p>}
          {status === "PAY_PENDING" && <p>Aguardando confirmação do pagamento...</p>}
          {status === "PAID" && <p>Pagamento confirmado! Preparando para envio...</p>}
          {status === "SHIPPED" && <p>Pedido enviado e a caminho do destino!</p>}
          {status === "CANCELLED" && <p>Pedido cancelado.</p>}
        </div>
      </CardContent>
    </Card>
  )
}
