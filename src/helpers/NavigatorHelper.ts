import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { UserService } from '../api/UserService';
import { UserDto } from '../models/dtos/UserDto';

export class NavigatorHelper {
  constructor() {}

  private static initializeFirebase() {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
    // Initialize Firebase
    return initializeApp(firebaseConfig);
  }

  static async PushNotificationSubscribeV2(user: UserDto, onFail: (message: string) => void, onSuccess?: () => void) {
    try {
      let permission = Notification.permission;
      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
      }

      const registration = await navigator.serviceWorker.ready;

      if (registration) {
        let subscription = await registration.pushManager.getSubscription();

        // Unsubscribe existing subscription if it's not aligned with the current applicationServerKey
        if (subscription) {
          await subscription.unsubscribe();
          subscription = null; // Reset subscription to null after unsubscribing
        }

        // Proceed to subscribe with the correct applicationServerKey
        const newSubscription = await NavigatorHelper.SetSubscriptionAsync(subscription, registration);

        // Assuming updateUserApi returns a response with 'status' and 'responseMessage'
        const response = await UserService.updateUserApi({
          ...user,
          pushNotificationSub: JSON.stringify(newSubscription),
        });

        if (response.status) {
          onSuccess?.();
        } else {
          onFail('Failed to update user with new subscription.');
        }
      }
    } catch (error) {
      //onFail(`Error subscribing to push notifications: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Keep your SetSubscriptionAsync method as it is.

  private static async SetSubscriptionAsync(subscription: PushSubscription | null, registration: ServiceWorkerRegistration) {
    // Subscribe or resubscribe if no subscription or if it's invalid
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    return subscription;
  }

  static async PushNotificationSubscribe(user: UserDto, onFail: (message: string) => void, onSuccess?: () => void) {
    try {
      let permission = Notification.permission;

      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
      }

      // Get registration token. Initially, this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.
      const messaging = getMessaging(this.initializeFirebase());
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
      });

      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // Proceed to subscribe with the correct applicationServerKey

        // Assuming updateUserApi returns a response with 'status' and 'responseMessage'
        const response = await UserService.updateUserApi({
          ...user,
          firebaseSubToken: currentToken,
        });

        if (response.status) {
          // Subscribe to FCM messages when the app is in the foreground
          onMessage(messaging, (payload) => {
            //new Notification(payload.notification?.body ?? '')
            // Handle the notification payload here or update your UI
          });

          onSuccess?.();
        } else {
          onFail('Failed to update user with a new token.');
        }
      } else {
        // Show permission request UI
        // ...
      }
    } catch (error) {
      console.log('Notification Token Error', error);
    }
  }
}
