import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor(private messageService: MessageService) {
    this.socket = io('http://localhost:7000', {
      path: '/socket.io/',
      transports: ['websocket'],
    });
  }

  // Listen for notifications
  listenForNotifications(userId: number): Observable<any> {
    return new Observable((observer) => {
      console.log('🔔socket------->✨');
      this.socket.on(`notification:${userId}`, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(`notification:${userId}`);
      };
    });
  }
}
