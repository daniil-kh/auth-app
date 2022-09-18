import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatEntity } from '../infrastructure/entities';
import { ChatDto } from '../infrastructure/repositories-interfaces';

@WebSocketGateway({ namespace: 'message', cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private chatService: ChatService;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  public afterInit(server: Server): void {
    return this.logger.log('ChatGateway Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public async handleConnection(
    client: Socket,
    @MessageBody() data: ChatDto,
  ): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`);
    await this.chatService.checkUserId(data.userId);
    const messages: ChatEntity[] = await this.chatService.getMessages();
    client.emit('get-all-messages', messages);
  }

  @SubscribeMessage('sent-new-message-server')
  async handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatEntity,
  ): Promise<void> {
    const message: ChatEntity = await this.chatService.createMessage(data);
    this.server.emit('sent-new-message-client', { message });
  }
}
