import { Module } from '@nestjs/common';
import { InfrastructureController } from './app.controller';
import { InfrastructureService } from './app.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [],
  controllers: [InfrastructureController],
  providers: [InfrastructureService, EventsGateway],
})
export class AppModule { }
