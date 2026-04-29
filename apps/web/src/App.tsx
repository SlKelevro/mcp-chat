import { useEffect, useState } from 'react';
import { ChatWorkspace } from './components/ChatWorkspace';
import { LoginScreen } from './components/LoginScreen';
import {
  createChat,
  getMe,
  listChats,
  listMessages,
  login,
  sendMessage,
} from './lib/api';
import { clearSession, loadSession, saveSession } from './lib/session';
import { Chat, Message, Session } from './lib/types';

export default function App() {
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [email, setEmail] = useState('admin@mcp.chat');
  const [password, setPassword] = useState('admin');
  const [draftTitle, setDraftTitle] = useState('New conversation');
  const [draftMessage, setDraftMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    void restoreSession(session);
  }, [session]);

  async function restoreSession(currentSession: Session) {
    setStatus('Restoring session');

    try {
      const user = await getMe(currentSession.accessToken);
      if (user.id !== currentSession.userId || user.email !== currentSession.email) {
        const nextSession = {
          ...currentSession,
          userId: user.id,
          email: user.email,
        };

        saveSession(nextSession);
        setSession(nextSession);
        return;
      }

      await refreshWorkspace(currentSession.accessToken);
    } catch (caughtError) {
      clearSession();
      setSession(null);
      setError(getErrorMessage(caughtError));
      setStatus('Session expired');
    }
  }

  async function refreshWorkspace(accessToken: string) {
    setStatus('Syncing chats');

    try {
      const userChats = await listChats(accessToken);
      const nextSelectedChatId =
        selectedChatId && userChats.some((chat) => chat.id === selectedChatId)
          ? selectedChatId
          : userChats[0]?.id ?? null;
      const nextMessages = nextSelectedChatId ? await listMessages(accessToken, nextSelectedChatId) : [];

      setChats(userChats);
      setSelectedChatId(nextSelectedChatId);
      setMessages(nextMessages);
      setStatus(userChats.length === 0 ? 'Create your first chat' : 'Workspace synced');
      setError(null);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setStatus('Unable to reach API');
    }
  }

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setIsSubmittingLogin(true);
    setStatus('Preparing session');

    try {
      const response = await login(email.trim(), password);
      const nextSession = {
        accessToken: response.accessToken,
        userId: response.user.id,
        email: response.user.email,
      };
      saveSession(nextSession);
      setSession(nextSession);
      setError(null);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setStatus('Login failed');
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  async function handleCreateChat() {
    if (!session) {
      return;
    }

    if (!draftTitle.trim()) {
      setError('Chat title is required.');
      return;
    }

    setIsCreatingChat(true);
    setStatus('Creating chat');

    try {
      const createdChat = await createChat(draftTitle.trim(), session.accessToken);
      const nextChats = [createdChat, ...chats];
      setChats(nextChats);
      setSelectedChatId(createdChat.id);
      setMessages([]);
      setDraftTitle('New conversation');
      setError(null);
      setStatus('Chat created');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setStatus('Chat creation failed');
    } finally {
      setIsCreatingChat(false);
    }
  }

  async function handleSelectChat(chatId: string) {
    if (!session) {
      return;
    }

    setSelectedChatId(chatId);
    setStatus('Loading messages');

    try {
      setMessages(await listMessages(session.accessToken, chatId));
      setError(null);
      setStatus('Messages loaded');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setStatus('Unable to load messages');
    }
  }

  async function handleSendMessage() {
    if (!session) {
      return;
    }

    if (!selectedChatId) {
      setError('Select a chat before sending a message.');
      return;
    }

    if (!draftMessage.trim()) {
      setError('Message text is required.');
      return;
    }

    setIsSendingMessage(true);
    setStatus('Waiting for assistant');

    try {
      const exchange = await sendMessage(selectedChatId, draftMessage.trim(), session.accessToken);
      setMessages((currentMessages) => {
        const nextMessages = [...currentMessages, exchange.userMessage];

        if (exchange.assistantMessage) {
          nextMessages.push(exchange.assistantMessage);
        }

        return nextMessages;
      });
      setDraftMessage('');
      setError(null);
      setStatus('Assistant replied');
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      setStatus('Message send failed');
    } finally {
      setIsSendingMessage(false);
    }
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setChats([]);
    setMessages([]);
    setSelectedChatId(null);
    setStatus('Logged out');
    setError(null);
  }

  if (!session) {
    return (
      <LoginScreen
        email={email}
        error={error}
        isSubmitting={isSubmittingLogin}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <ChatWorkspace
      chats={chats}
      draftMessage={draftMessage}
      draftTitle={draftTitle}
      error={error}
      isCreatingChat={isCreatingChat}
      isSendingMessage={isSendingMessage}
      messages={messages}
      selectedChatId={selectedChatId}
      session={session}
      status={status}
      onCreateChat={handleCreateChat}
      onDraftMessageChange={setDraftMessage}
      onDraftTitleChange={setDraftTitle}
      onLogout={handleLogout}
      onSelectChat={(chatId) => {
        void handleSelectChat(chatId);
      }}
      onSendMessage={() => {
        void handleSendMessage();
      }}
    />
  );
}

function getErrorMessage(caughtError: unknown) {
  if (caughtError instanceof Error) {
    return caughtError.message;
  }

  return 'Something went wrong.';
}
