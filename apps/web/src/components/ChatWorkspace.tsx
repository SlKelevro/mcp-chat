import { Chat, Message, Session } from '../lib/types';

type ChatWorkspaceProps = {
  session: Session;
  chats: Chat[];
  messages: Message[];
  selectedChatId: string | null;
  draftTitle: string;
  draftMessage: string;
  isCreatingChat: boolean;
  isSendingMessage: boolean;
  status: string;
  error: string | null;
  onDraftTitleChange(title: string): void;
  onCreateChat(): void;
  onSelectChat(chatId: string): void;
  onDraftMessageChange(message: string): void;
  onSendMessage(): void;
  onLogout(): void;
};

export function ChatWorkspace({
  session,
  chats,
  messages,
  selectedChatId,
  draftTitle,
  draftMessage,
  isCreatingChat,
  isSendingMessage,
  status,
  error,
  onDraftTitleChange,
  onCreateChat,
  onSelectChat,
  onDraftMessageChange,
  onSendMessage,
  onLogout,
}: ChatWorkspaceProps) {
  const selectedChat = chats.find((chat) => chat.id === selectedChatId) ?? null;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <p className="eyebrow">Signed in as</p>
            <h2>{session.email}</h2>
          </div>
          <button className="ghost-button" onClick={onLogout} type="button">
            Log out
          </button>
        </div>

        <div className="new-chat-card">
          <label>
            <span>New chat title</span>
            <input
              placeholder="Product ideas, roadmap, debugging..."
              value={draftTitle}
              onChange={(event) => onDraftTitleChange(event.target.value)}
            />
          </label>
          <button className="primary-button" disabled={isCreatingChat} onClick={onCreateChat} type="button">
            {isCreatingChat ? 'Creating...' : 'Create chat'}
          </button>
        </div>

        <div className="chat-list">
          {chats.length === 0 ? <p className="empty-copy">No chats yet. Create one to start the conversation.</p> : null}

          {chats.map((chat) => (
            <button
              key={chat.id}
              className={`chat-list-item${chat.id === selectedChatId ? ' is-active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
              type="button"
            >
              <strong>{chat.title}</strong>
              <span>{chat.id.slice(0, 8)}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="conversation-panel">
        <header className="conversation-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>{selectedChat ? selectedChat.title : 'Select or create a chat'}</h1>
          </div>
          <p className="status-chip">{status}</p>
        </header>

        <section className="message-list">
          {!selectedChat ? (
            <div className="empty-state">
              <h3>Your chat canvas is ready.</h3>
              <p>Create a chat on the left, then send a message to trigger the configured LLM handler.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <h3>No messages yet.</h3>
              <p>Send the opening prompt and the assistant reply will be stored back into this chat.</p>
            </div>
          ) : (
            messages.map((message) => (
              <article key={message.id} className={`message-bubble role-${message.role}`}>
                <p className="message-role">{message.role}</p>
                <p>{message.content}</p>
              </article>
            ))
          )}
        </section>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            onSendMessage();
          }}
        >
          <textarea
            disabled={!selectedChat || isSendingMessage}
            placeholder={selectedChat ? 'Ask anything...' : 'Choose a chat first'}
            rows={4}
            value={draftMessage}
            onChange={(event) => onDraftMessageChange(event.target.value)}
          />
          <div className="composer-footer">
            {error ? <p className="form-error">{error}</p> : <p className="helper-copy">Messages are sent to the API and the selected LLM handler.</p>}
            <button
              className="primary-button"
              disabled={!selectedChat || isSendingMessage}
              type="submit"
            >
              {isSendingMessage ? 'Sending...' : 'Send message'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
