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
    this.socket = io('http://10.81.0.211:7000', {
      path: '/socket.io/',
      transports: ['websocket'],
    });
  }

  // Listen for Like notifications
  listenForNotifications(userId: any): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('connect', () => {
        console.log('🔔Socket connected:', this.socket.connected);
      });

      this.socket.on(`notification:${userId}`, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(`notification:${userId}`);
      };
    });
  }

  onLikeUpdated(
    topicId: number
  ): Observable<{ topicId: number; likeCount: any }> {
    return new Observable((observer) => {
      const eventName = `likeUpdated:${topicId}`;
      console.log(`Listening for event: ${eventName}`);

      this.socket.on(eventName, (data) => {
        console.log(`Received update:`, data);
        observer.next(data);
      });

      return () => {
        console.log(`Unsubscribing from: ${eventName}`);
        this.socket.off(eventName);
      };
    });
  }

  onReplyLikeUpdated(
    replyId: number
  ): Observable<{ replyId: number; likeCount: any }> {
    return new Observable((observer) => {
      const eventName = `likeUpdated:${replyId}`;

      console.log(`Checking WebSocket Connection...`);
      if (!this.socket.connected) {
        console.warn('⚠️ WebSocket is not connected! Retrying...');
        this.socket.connect();
      }

      console.log(`✅ Listening for event: ${eventName}`);
      this.socket.on(eventName, (data) => {
        console.log(`📩 Received update for reply ${replyId}:`, data);
        observer.next(data);
      });

      return () => {
        console.log(`🔴 Unsubscribing from event: ${eventName}`);
        this.socket.off(eventName);
      };
    });
  }

  // Listen for Subscription notifications
  listenForSubscriptionNotifications(userId: number): Observable<any> {
    return new Observable((observer) => {
      console.log('📩 Listening for Subscription notifications...');
      this.socket.on(`subscription:${userId}`, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(`subscription:${userId}`);
      };
    });
  }
}
