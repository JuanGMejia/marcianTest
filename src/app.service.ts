// infrastructure.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto, InventoryItem, HistoryLog } from './create-order.dto';
import { EventsGateway } from './events.gateway';
import { v4 as uuidv4 } from 'uuid'; // (Opcional: usa un string random si no tienes uuid)

@Injectable()
export class InfrastructureService {
  // Base de datos en memoria (Simulación)
  private inventory: InventoryItem[] = [
    { resource: 'oxigeno', quantity: 100, unit: '%' },
    { resource: 'agua', quantity: 500, unit: 'litros' },
    { resource: 'tuercas', quantity: 1000, unit: 'unidades' },
  ];

  private history: HistoryLog[] = [];

  constructor(private readonly eventsGateway: EventsGateway) { }

  getInventory() {
    return this.inventory;
  }

  getHistory() {
    return this.history;
  }

  processOrder(order: CreateOrderDto) {
    const item = this.inventory.find(
      (i) => i.resource.toLowerCase() === order.resource.toLowerCase(),
    );

    if (!item) {
      throw new BadRequestException(`El recurso ${order.resource} no existe en Ares Prime.`);
    }

    // Validación de Stock
    if (item.quantity < order.quantity) {
      throw new BadRequestException(`Stock insuficiente de ${item.resource}.`);
    }

    // 1. Actualizar Inventario
    item.quantity -= order.quantity;

    // 2. Registro Histórico Impecable
    const log: HistoryLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      action: 'ORDER_PROCESSED',
      details: `Se consumieron ${order.quantity} de ${item.resource}. Stock restante: ${item.quantity}`,
    };
    this.history.unshift(log); // Añadir al inicio

    // 3. Notificación en Tiempo Real (WebSockets)
    this.eventsGateway.broadcastInventoryUpdate(this.inventory);

    // 4. Verificación de Seguridad (Alertas)
    this.checkCriticalLevels(item);

    return { status: 'success', currentStock: item.quantity, logId: log.id };
  }

  private checkCriticalLevels(item: InventoryItem) {
    // Si es oxígeno y baja del 20%, o agua y baja de 50L
    if (item.resource === 'oxigeno' && item.quantity < 20) {
      this.eventsGateway.sendCriticalAlert('OXIGENO', item.quantity);
    }
    if (item.resource === 'agua' && item.quantity < 50) {
      this.eventsGateway.sendCriticalAlert('AGUA', item.quantity);
    }
  }
}