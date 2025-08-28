import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  User, 
  Bot,
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  RefreshCw,
  Paperclip,
  Image,
  Globe
} from 'lucide-react';

const SocialMediaAnalyticsChat = ({ userName = "" }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage) => {
    const responses = {
      'trending': 'Here are the current trending topics among your tracked influencers:\n\n🔥 **AI & Machine Learning** - 1,250 mentions (+15% growth)\n📈 **Cryptocurrency** - 980 mentions (-5% growth)\n🌱 **Climate Change** - 750 mentions (+8% growth)\n💡 **Tech Innovation** - 650 mentions (+22% growth)\n🏠 **Remote Work** - 420 mentions (+12% growth)\n\nWould you like me to dive deeper into any specific topic?',
      'sentiment': 'Based on the latest sentiment analysis:\n\n😊 **Positive**: 45% (↑ 3% from last week)\n😐 **Neutral**: 35% (↓ 1% from last week)\n😔 **Negative**: 20% (↓ 2% from last week)\n\n**Key Insights:**\n• Overall sentiment is improving across all platforms\n• Tech and innovation posts show highest positivity\n• Climate discussions tend toward negative sentiment\n• Engagement is 23% higher on positive posts',
      'engagement': 'Here\'s your engagement summary for this week:\n\n📊 **Average Engagement Rate**: 4.2% (↑ 0.3%)\n❤️ **Total Likes**: 284K (↑ 15%)\n🔄 **Total Shares**: 89K (↑ 22%)\n💬 **Total Comments**: 45K (↑ 8%)\n\n**Top Performing Content:**\n1. @elonmusk\'s AI post - 12.3% engagement\n2. @naval\'s philosophy thread - 8.7% engagement\n3. @garyvee\'s business tips - 7.2% engagement\n\nYour content is performing 18% better than industry average!',
      'compare': 'Here\'s a performance comparison of your top influencers:\n\n🥇 **@elonmusk**\n• Avg Engagement: 8.2%\n• Sentiment: 52% Positive\n• Growth: +2.1M followers\n\n🥈 **@naval**\n• Avg Engagement: 6.8%\n• Sentiment: 67% Positive\n• Growth: +180K followers\n\n🥉 **@garyvee**\n• Avg Engagement: 5.9%\n• Sentiment: 71% Positive\n• Growth: +95K followers\n\n**Insight**: @naval has the highest positive sentiment despite lower reach.'
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('trend') || lowerMessage.includes('topic')) {
      return responses.trending;
    } else if (lowerMessage.includes('sentiment')) {
      return responses.sentiment;
    } else if (lowerMessage.includes('engagement')) {
      return responses.engagement;
    } else if (lowerMessage.includes('compare') || lowerMessage.includes('influencer')) {
      return responses.compare;
    }
    //--------------------------------------
    //n8n webhook (POST)
    async function postToWebhook(webhookURL, data) {
      try {
        const response = await fetch(webhookURL, {
          method: 'POST', // Specify the method
          headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
          },
          body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response.status);
        if (response.status === 200) {
          const text = await response.text();
          console.log('Success! Webhook acknowledged the request with no content.');
          return text;
        }

        // Optionally, you can process the response from the webhook
        const responseData = await response.json();
        return responseData;
        
      } catch (error) {
        console.error('Error posting to webhook:', error);
      }
    }
    //test and then production webhook
    //const myWebhookURL = 'https://princeofj.app.n8n.cloud/webhook-test/887441b1-2306-485e-8d87-9115c9e563d6';
    const myWebhookURL = 'https://princeofj.app.n8n.cloud/webhook/887441b1-2306-485e-8d87-9115c9e563d6';
    
    const messageData = {
      username: "jacks",
      content: lowerMessage,
      sessionID: "123123",
      timestamp: new Date().toISOString()
    };
    async function getResponseFromWebhook() {
      const result = await postToWebhook(myWebhookURL, messageData);
      return result;
    }
    const gaming = await getResponseFromWebhook();
    return JSON.parse(gaming.toString()).output;
    //old return statement
    //return 'I can help you analyze your social media data! I specialize in:\n\n• **Trending topics** and hashtag analysis\n• **Sentiment analysis** of posts and comments\n• **Engagement metrics** and performance tracking\n• **Influencer comparisons** and benchmarking\n• **Content recommendations** based on data\n\nWhat would you like to explore first?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    setTimeout( async () => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: await generateResponse(messageToSend),
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt) => {
    setInputMessage(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const prompts = [
    {
      title: "Write a to-do list for a personal project or task",
      icon: User
    },
    {
      title: "Generate an email to reply to a job offer",
      icon: Send
    },
    {
      title: "Summarise this article or text for me in one paragraph",
      icon: BarChart3
    },
    {
      title: "How does AI work in a technical capacity",
      icon: TrendingUp
    }
  ];

  // Show welcome screen if no messages
  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-12 sm:w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer">
            <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 text-sm sm:text-base">+</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-12 sm:ml-16 flex flex-col items-center justify-center min-h-screen px-4 sm:px-8">
          <div className="max-w-xl w-full text-center mb-8">
            <h1 className="text-xl sm:text-2xl font-normal mb-2">
              <span className="text-gray-900">Hi there, </span>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{userName}</span>
            </h1>
            <h2 className="text-xl sm:text-2xl font-normal mb-4">
              <span className="text-gray-900">What would </span>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">you </span>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">like to know?</span>
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Use one of the most common prompts<br />
              below or use your own to begin
            </p>
          </div>



          {/* Input Area */}
          <div className="w-full max-w-sm sm:max-w-2xl">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-2 sm:p-3">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask whatever you want..."
                  className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base leading-relaxed"
                  rows="1"
                  style={{ minHeight: '20px', maxHeight: '120px' }}
                />
              </div>
              <div className="flex items-center justify-between px-2 sm:px-3 pb-2 sm:pb-3">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button className="hidden sm:flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-xs">Add Attachment</span>
                  </button>
                  <button className="hidden sm:flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                    <Image className="h-4 w-4" />
                    <span className="text-xs">Use Image</span>
                  </button>
                  <button className="sm:hidden p-1 text-gray-500 hover:text-gray-700">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="sm:hidden p-1 text-gray-500 hover:text-gray-700">
                    <Image className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="hidden sm:flex items-center space-x-1">
                    <Globe className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">All Web</span>
                  </div>
                  <span className="text-xs text-gray-400">{inputMessage.length}/1000</span>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    <Send className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Avatar */}
        <div className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // Chat interface when there are messages
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-12 sm:w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <button 
          onClick={() => setMessages([])}
          className="w-6 h-6 sm:w-8 sm:h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 text-sm sm:text-base">+</div>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="ml-12 sm:ml-16 max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <div className="space-y-8">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs sm:max-w-3xl ${message.type === 'user' ? 'bg-gray-100' : 'bg-white border border-gray-200'} rounded-2xl p-4 sm:p-6`}>
                <div className="whitespace-pre-line text-gray-900 leading-relaxed text-sm sm:text-base">
                  {message.content.split('\n').map((line, index) => (
                    <p key={index} className={`${index === 0 ? 'mt-0' : 'mt-2'} mb-2 last:mb-0`}>
                      {line.includes('**') ? (
                        <span dangerouslySetInnerHTML={{
                          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }} />
                      ) : line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="fixed bottom-4 sm:bottom-8 left-16 sm:left-24 right-4 sm:right-8 max-w-sm sm:max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
            <div className="p-2 sm:p-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask whatever you want..."
                className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base leading-relaxed"
                rows="1"
                style={{ minHeight: '20px', maxHeight: '120px' }}
              />
            </div>
            <div className="flex items-center justify-between px-2 sm:px-3 pb-2 sm:pb-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="hidden sm:flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                  <Paperclip className="h-4 w-4" />
                  <span className="text-xs">Add Attachment</span>
                </button>
                <button className="hidden sm:flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                  <Image className="h-4 w-4" />
                  <span className="text-xs">Use Image</span>
                </button>
                <button className="sm:hidden p-1 text-gray-500 hover:text-gray-700">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="sm:hidden p-1 text-gray-500 hover:text-gray-700">
                  <Image className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="hidden sm:flex items-center space-x-1">
                  <Globe className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">All Web</span>
                </div>
                <span className="text-xs text-gray-400">{inputMessage.length}/1000</span>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                  <Send className="h-3 w-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Left Avatar */}
      <div className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAnalyticsChat;