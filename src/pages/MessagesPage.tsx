import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Send,
  Paperclip,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCheck,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRelativeTime } from '../utils';

export const MessagesPage: React.FC = () => {
  const { conversations, messages, sendMessage, currentUser } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const convParam = searchParams.get('conv');
  const [selectedConvId, setSelectedConvId] = useState<string>(
    convParam || (conversations[0]?.id ?? '')
  );
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (convParam) setSelectedConvId(convParam);
  }, [convParam]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConvId]);

  const activeConv = conversations.find((c) => c.id === selectedConvId);

  // Filter messages for active conversation
  const convMessages = messages.filter((m) => m.conversationId === selectedConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId) return;
    sendMessage(selectedConvId, inputText.trim());
    setInputText('');
  };

  const getOtherParticipantId = (conv: typeof activeConv) => {
    if (!conv) return '';
    return conv.participantIds.find((id) => id !== currentUser.id) || conv.participantIds[0];
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-premium overflow-hidden h-[750px] flex flex-col md:flex-row">
          {/* Conversation Sidebar */}
          <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-200">
              <h2 className="font-extrabold text-slate-900 text-lg">Deal Messages</h2>
              <p className="text-xs text-slate-500">Live communication with brands & creators</p>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No active conversations yet.
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherId = getOtherParticipantId(conv);
                  const name = conv.participantNames[otherId] || 'User';
                  const avatar = conv.participantAvatars[otherId] || '';
                  const role = conv.participantRoles[otherId] || 'creator';
                  const isSelected = conv.id === selectedConvId;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`p-4 flex items-center space-x-3 cursor-pointer transition ${
                        isSelected ? 'bg-indigo-50/80 border-r-4 border-indigo-600' : 'hover:bg-slate-100/60'
                      }`}
                    >
                      <img src={avatar} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-xs shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{name}</h4>
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(conv.lastMessageTime || '')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Conversation Chat Window */}
          {activeConv ? (
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white/95">
                {(() => {
                  const otherId = getOtherParticipantId(activeConv);
                  const name = activeConv.participantNames[otherId] || 'User';
                  const avatar = activeConv.participantAvatars[otherId] || '';
                  const role = activeConv.participantRoles[otherId] || 'creator';

                  return (
                    <div className="flex items-center space-x-3">
                      <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-xs" />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="font-extrabold text-slate-900 text-sm">{name}</h3>
                          <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                            {role}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>Active in Deal Room</span>
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Direct Link to Deal Room if collaborationId exists */}
                {activeConv.collaborationId && (
                  <button
                    onClick={() => navigate(`/collaborations/${activeConv.collaborationId}`)}
                    className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    <span>View Deal Room</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
                {convMessages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMine
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {formatRelativeTime(msg.timestamp)}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message or discuss contract deliverables..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
