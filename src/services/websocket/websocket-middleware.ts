import {
  isAction,
  type ActionCreatorWithoutPayload,
  type ActionCreatorWithPayload,
  type Middleware,
} from '@reduxjs/toolkit';

type TWebSocketActions<TMessage> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  connecting: ActionCreatorWithoutPayload;
  open: ActionCreatorWithoutPayload;
  close: ActionCreatorWithoutPayload;
  error: ActionCreatorWithPayload<string>;
  message: ActionCreatorWithPayload<TMessage>;
};

type TWebSocketAuth = {
  isAuthError: (message: unknown) => boolean;
  refreshUrl: () => Promise<string>;
};

type TWebSocketMiddlewareOptions<TMessage> = {
  actions: TWebSocketActions<TMessage>;
  parseMessage: (message: unknown) => TMessage | null;
  auth?: TWebSocketAuth;
};

export const createWebSocketMiddleware = <TMessage>({
  actions,
  parseMessage,
  auth,
}: TWebSocketMiddlewareOptions<TMessage>): Middleware => {
  let socket: WebSocket | null = null;
  let isActive = false;
  let authRetryCount = 0;

  return (storeApi) => {
    const closeSocket = () => {
      const currentSocket = socket;

      socket = null;

      if (currentSocket) {
        currentSocket.onclose = null;
        currentSocket.close();
      }
    };

    const openSocket = (url: string) => {
      closeSocket();
      storeApi.dispatch(actions.connecting());

      const nextSocket = new WebSocket(url);

      socket = nextSocket;

      nextSocket.onopen = () => {
        if (socket === nextSocket) {
          storeApi.dispatch(actions.open());
        }
      };

      nextSocket.onerror = () => {
        if (socket === nextSocket) {
          storeApi.dispatch(actions.error('Ошибка WebSocket-соединения'));
        }
      };

      nextSocket.onclose = () => {
        if (socket === nextSocket) {
          socket = null;
          storeApi.dispatch(actions.close());
        }
      };

      nextSocket.onmessage = (event: MessageEvent<string>) => {
        if (socket !== nextSocket || typeof event.data !== 'string') {
          return;
        }

        let message: unknown;

        try {
          message = JSON.parse(event.data) as unknown;
        } catch {
          storeApi.dispatch(actions.error('Получены некорректные данные WebSocket'));
          return;
        }

        if (auth?.isAuthError(message)) {
          if (authRetryCount > 0) {
            closeSocket();
            storeApi.dispatch(actions.error('Не удалось обновить токен доступа'));
            return;
          }

          authRetryCount += 1;
          closeSocket();

          void auth
            .refreshUrl()
            .then((refreshedUrl) => {
              if (isActive) {
                openSocket(refreshedUrl);
              }
            })
            .catch((error: unknown) => {
              storeApi.dispatch(
                actions.error(
                  error instanceof Error
                    ? error.message
                    : 'Не удалось обновить токен доступа'
                )
              );
            });
          return;
        }

        const parsedMessage = parseMessage(message);

        if (!parsedMessage) {
          storeApi.dispatch(actions.error('Получены некорректные данные заказов'));
          return;
        }

        authRetryCount = 0;
        storeApi.dispatch(actions.message(parsedMessage));
      };
    };

    return (next) => (action) => {
      const result = next(action);

      if (!isAction(action)) {
        return result;
      }

      if (action.type === actions.connect.type) {
        isActive = true;
        authRetryCount = 0;
        openSocket((action as ReturnType<typeof actions.connect>).payload);
      }

      if (action.type === actions.disconnect.type) {
        isActive = false;
        authRetryCount = 0;
        closeSocket();
      }

      return result;
    };
  };
};
