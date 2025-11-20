// events.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // Permitir conexiones desde cualquier origen (Dashboard Tierra)
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Centro de Control conectado: ${client.id}`);
  }

  // Transmite el estado actual a todos los clientes conectados
  broadcastInventoryUpdate(inventory: any[]) {
    this.server.emit('inventory_update', inventory);
  }

  // Alerta Roja: Nivel Crítico
  sendCriticalAlert(resource: string, level: number) {
    this.server.emit('critical_alert', {
      type: 'CRITICAL',
      message: `¡ADVERTENCIA! Niveles de ${resource} críticos: ${level}`,
      timestamp: new Date(),
    });
  }
}

// create-order.dto.ts
export class CreateOrderDto {
  resource: string; // ej: 'oxigeno', 'agua', 'tuercas'
  quantity: number; // Cantidad a consumir o agregar (negativo para agregar)
}

export interface InventoryItem {
  resource: string;
  quantity: number;
  unit: string;
}

export interface HistoryLog {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
}