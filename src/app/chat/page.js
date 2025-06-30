"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCw, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIChatHomepage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
    kbIds: process.env.NEXT_PUBLIC_KB_IDS?.split(',') || [],
    model: 'QAnything-4o-mini',
    maxToken: 512,
    hybridSearch: false,
    networking: true,
    sourceNeeded: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  // 打字效果
  useEffect(() => {
    if (isTyping && typingText) {
      let index = 0;
      
      // 清除之前的定时器
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      
      typingIntervalRef.current = setInterval(() => {
        if (index <= typingText.length) {
          // 更新最后一条消息的内容
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === 'ai') {
              newMessages[newMessages.length - 1].content = typingText.substring(0, index);
            }
            return newMessages;
          });
          index++;
          scrollToBottom();
        } else {
          clearInterval(typingIntervalRef.current);
          setIsTyping(false);
        }
      }, 20); // 调整这个值可以改变打字速度
    }
  }, [typingText, isTyping]);

  const getHistory = () => {
    const recentMessages = messages.slice(-4); // 最多2轮对话
    const history = [];
  
    for (let i = 0; i < recentMessages.length; i += 2) {
      const question = recentMessages[i]?.content;
      const response = recentMessages[i + 1]?.content;
  
      if (question && response) {
        history.push({ question, response });
      }
    }
  
    // 如果没有有效问答对，返回空数组
    return history.length > 0 ? history : [];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    if (!settings.apiKey.trim()) {
      alert('请先在设置中填入API Key');
      setShowSettings(true);
      return;
    }

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);
    setTypingText('');
    setIsTyping(false);

    // 预先添加AI回复占位消息
    const aiPlaceholderMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: '',
      sources: [],
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiPlaceholderMessage]);

    // 创建AbortController用于取消请求
    abortControllerRef.current = new AbortController();

    try {
      const requestBody = {
        question: newMessage.content,
        kbIds: settings.kbIds,
        prompt: "",
        history: getHistory(),
        model: settings.model,
        maxToken: settings.maxToken,
        hybridSearch: settings.hybridSearch,
        networking: settings.networking,
        sourceNeeded: settings.sourceNeeded
      };

      // 通过Next.js API路由代理请求以避免CORS问题
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestBody,
          apiKey: settings.apiKey
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let sources = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim()) {
            // 处理 "data: " 开头的行
            if (line.startsWith('data:')) {
              // 去掉前缀 data: 并解析 JSON
              const jsonStr = line.startsWith('data:') ? line.slice(5).trim() : line;
              let responseText = '';
              try {
                const data = JSON.parse(jsonStr);
                responseText = data?.result?.response || '';
                fullResponse += responseText;
                setTypingText(fullResponse);
                setIsTyping(true);
              } catch (e) {
                console.error('JSON解析失败:', e);
              }
            } else if (line.startsWith('{')) {
              let responseText = '';
              try {
                const data = JSON.parse(line);
                responseText = data?.result?.response || '';
                fullResponse += responseText;
                setTypingText(fullResponse);
                setIsTyping(true);
              } catch (e) {
                console.error('解析失败:', e);
              }
            }
          }
        }
      }

      // 更新最后一条AI消息的内容
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === 'ai') {
          newMessages[newMessages.length - 1].content = fullResponse || '抱歉，没有收到完整的回复。';
          newMessages[newMessages.length - 1].sources = sources;
        }
        return newMessages;
      });

      setTypingText('');
      setIsTyping(false);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('请求被取消');
        
        // 如果被取消，更新最后一条AI消息的内容为已收到的部分
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === 'ai') {
            newMessages[newMessages.length - 1].content = typingText || '生成已取消';
          }
          return newMessages;
        });
      } else {
        console.error('发送消息失败:', error);
        // 更新最后一条AI消息的内容为错误信息
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === 'ai') {
            newMessages[newMessages.length - 1].content = '抱歉，发生了错误，请稍后重试。';
          }
          return newMessages;
        });
      }
      setTypingText('');
      setIsTyping(false);
    } finally {
      setIsLoading(false);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setTypingText('');
    setIsTyping(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
    setTypingText('');
    setIsTyping(false);
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI智能助手</h1>
              <p className="text-sm text-gray-500">基于QAnything的智能问答系统</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="设置"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="清空对话"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b px-6 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">设置</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入您的API Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">模型</label>
                <select
                  value={settings.model}
                  onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="QAnything 4o mini">QAnything 4o mini</option>
                  <option value="QAnything 4o">QAnything 4o</option>
                  <option value="deepseek-pro">deepseek-pro</option>
                  <option value="deepseek-lite">deepseek-lite</option>
                  <option value="deepseek-chat">deepseek-chat</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最大Token数</label>
                <input
                  type="number"
                  value={settings.maxToken}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxToken: parseInt(e.target.value) || 512 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="512"
                  max="4096"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.networking}
                    onChange={(e) => setSettings(prev => ({ ...prev, networking: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">联网检索</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.sourceNeeded}
                    onChange={(e) => setSettings(prev => ({ ...prev, sourceNeeded: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">显示来源</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col px-6 py-6">
        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">欢迎使用AI智能助手</h3>
              <p className="text-gray-500">开始对话，我将为您提供智能问答服务</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl flex ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-500 ml-3' 
                    : 'bg-gray-500 mr-3'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border'
                }`}>
                  <div className="prose max-w-full">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  
                  {/* 显示信息来源 */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600 font-medium mb-2">信息来源：</div>
                      {message.sources.map((source, index) => (
                        <div key={index} className="text-xs text-gray-500 mb-1 p-2 bg-gray-50 rounded">
                          <div className="font-medium">{source.fileName}</div>
                          <div className="mt-1">{source.content}</div>
                          <div className="mt-1 text-gray-400">可信度: {parseFloat(source.score).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                  {isLoading && message.type === 'ai' && message.id === messages[messages.length - 1]?.id && (
                    <div className="flex items-center mt-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      <span className="text-xs text-gray-400 ml-2">AI正在思考...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg border p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              {isLoading ? (
                <button
                  onClick={stopGeneration}
                  className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                  title="停止生成"
                >
                  <div className="w-5 h-5 border-2 border-white"></div>
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="发送消息"
                >
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div>
              按 Enter 发送消息，Shift + Enter 换行
            </div>
            <div>
              {inputValue.length}/200
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatHomepage;