import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import { FaPaperPlane, FaRobot, FaUserCircle } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { Switch } from "@material-tailwind/react"; // Component Switch có thể cần cấu hình Material Tailwind
import { Link } from "react-router-dom"; // Giả định bạn có component Link và Header
import Header from "../components/Header"; // Đảm bảo đường dẫn này đúng

// Lấy URL từ biến môi trường
const GENERAL_CHAT_WEBHOOK_URL = import.meta.env.VITE_GENERAL_CHAT_WEBHOOK_URL;
const COMMAND_WEBHOOK_URL = import.meta.env.VITE_COMMAND_WEBHOOK_URL;

// Định nghĩa các lệnh slash command
const commands = [
  {
    name: "help",
    description: "Hiển thị danh sách các lệnh.",
    category: "Chung",
    aliases: ["trợ giúp", "h"],
    usage: "/help",
    internal: true, // Lệnh này sẽ được xử lý nội bộ, không gửi đi webhook
  },
  {
    name: "get-optical",
    description: "Tra cứu mức thu router.",
    category: "Tra cứu thông tin",
    aliases: ["mức thu", "optical"],
    usage: "/get-optical [Tên router]",
    params: [
      { name: "Tên router", required: true, type: "string", minLength: 1 },
    ],
    internal: false, // Lệnh này sẽ gửi đi webhook
  },
  {
    name: "get-interface",
    description: "Tra cứu thông tin interface router.",
    category: "Tra cứu thông tin",
    aliases: ["interface", "port"],
    usage: "/get-interface [Tên router]",
    params: [
      { name: "Tên router", required: true, type: "string", minLength: 1 },
    ],
    internal: false, // Lệnh này sẽ gửi đi webhook
  },
  {
    name: "diagnose",
    description: "Chẩn đoán sự cố cẩu.",
    category: "Sửa chữa cẩu",
    aliases: ["chẩn đoán", "suco"],
    usage: "/diagnose [Mô tả sự cố]",
    params: [
      { name: "Mô tả sự cố", required: true, type: "string", minLength: 5 },
    ],
    internal: false, // Lệnh này sẽ gửi đi webhook
  },
  {
    name: "manual",
    description: "Tìm kiếm hướng dẫn sử dụng cẩu theo model.",
    category: "Sửa chữa cẩu",
    aliases: ["hướng dẫn", "sổ tay", "doc"],
    usage: "/manual [Model cẩu]",
    params: [
      { name: "Model cẩu", required: true, type: "string", minLength: 3 },
    ],
    internal: false, // Lệnh này sẽ gửi đi webhook
  },
  {
    name: "contact",
    description: "Thông tin liên hệ hỗ trợ kỹ thuật.",
    category: "Hỗ trợ",
    aliases: ["liên hệ", "hotline"],
    usage: "/contact",
    internal: true, // Lệnh này sẽ được xử lý nội bộ
  },
  {
    name: "status",
    description: "Kiểm tra trạng thái hệ thống.",
    category: "Hỗ trợ",
    aliases: ["trạng thái", "tinh_trang"],
    usage: "/status",
    internal: true, // Lệnh này sẽ được xử lý nội bộ
  },
  {
    name: "about",
    description: "Thông tin về Bot.",
    category: "Chung",
    aliases: ["về_chúng_tôi", "thông_tin"],
    usage: "/about",
    internal: true, // Lệnh này sẽ được xử lý nội bộ
  },
];

// Hàm tạo Session ID duy nhất
function generateSessionId() {
  return uuidv4();
}

function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingOutput, setTypingOutput] = useState(""); // Dùng cho hiệu ứng gõ chữ
  const [darkMode, setDarkMode] = useState(false); // State cho Dark Mode (có thể uncomment Switch để bật)
  const [commandSuggestions, setCommandSuggestions] = useState({});
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] = useState(-1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Cuộn xuống tin nhắn mới nhất khi có tin nhắn hoặc trạng thái thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, typingOutput]);

  // Khởi tạo sessionId và tin nhắn chào mừng khi component mount
  useEffect(() => {
    let storedId = sessionStorage.getItem("chatbotSessionId");
    if (!storedId) {
      storedId = generateSessionId();
      sessionStorage.setItem("chatbotSessionId", storedId);
    }
    setSessionId(storedId);
    setMessages([
      {
        sender: "bot",
        text: "Xin chào! Tôi là trợ lý AI. Bạn cần tôi hỗ trợ điều gì hôm nay? Gõ `/help` để xem danh sách các lệnh.",
      },
    ]);
  }, []);

  // Cập nhật messages khi typingOutput thay đổi (hoàn thành hiệu ứng gõ chữ)
  useEffect(() => {
    if (!typingOutput) return;
    const botMsg = { sender: "bot", text: typingOutput };
    setMessages((msgs) => [...msgs, botMsg]);
    setTypingOutput(""); // Xóa typing output sau khi thêm vào messages
  }, [typingOutput]);

  // Xử lý thay đổi input và hiển thị gợi ý lệnh
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setHighlightedSuggestionIndex(-1); // Reset highlight khi người dùng gõ

    if (value.startsWith("/")) {
      setIsCommandMode(true);
      const commandText = value.substring(1).toLowerCase().trim();
      const filteredCommands = commands.filter(
        (cmd) =>
          cmd.name.includes(commandText) ||
          cmd.aliases.some((alias) => alias.includes(commandText))
      );

      // Nhóm lệnh theo danh mục để hiển thị gọn gàng hơn
      const categorizedSuggestions = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) {
          acc[cmd.category] = [];
        }
        acc[cmd.category].push(cmd);
        return acc;
      }, {});
      setCommandSuggestions(categorizedSuggestions);
    } else {
      setIsCommandMode(false);
      setCommandSuggestions({}); // Ẩn gợi ý nếu không phải là lệnh
    }
  };

  // Hàm xử lý các lệnh nội bộ (không gửi đi webhook)
  const handleInternalCommand = async (cmdName, args) => {
    switch (cmdName) {
      case "help":
        return (
          "Dưới đây là danh sách các lệnh tôi có thể hỗ trợ:\n\n" +
          Object.entries(
            commands.reduce((acc, cmd) => {
              if (!acc[cmd.category]) acc[cmd.category] = [];
              acc[cmd.category].push(
                `- **/${cmd.name}**${cmd.usage ? ` \`${cmd.usage}\`` : ""}: ${cmd.description}`
              );
              return acc;
            }, {})
          )
            .map(([category, cmdList]) => `**${category}**\n` + cmdList.join("\n"))
            .join("\n\n")
        );
      case "contact":
        return "Bạn có thể liên hệ hỗ trợ kỹ thuật qua hotline: **1900-XXXX** hoặc email: **support@domain.com**. Chúng tôi sẵn lòng hỗ trợ!";
      case "status":
        return "Hệ thống AI Bot đang hoạt động bình thường.";
      case "about":
        return "Tôi là trợ lý AI được phát triển để hỗ trợ bạn với các tác vụ tra cứu thông tin và chẩn đoán.";
      default:
        return "Lỗi: Lệnh nội bộ không xác định."; // Trường hợp này không nên xảy ra nếu logic đúng
    }
  };

  // Xử lý gửi tin nhắn hoặc lệnh
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return; // Không gửi nếu input rỗng hoặc đang loading

    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]); // Thêm tin nhắn người dùng vào lịch sử ngay lập tức
    setInput(""); // Xóa nội dung input
    setIsLoading(true); // Bắt đầu trạng thái loading
    setCommandSuggestions({}); // Xóa gợi ý sau khi gửi
    setIsCommandMode(false); // Thoát khỏi chế độ lệnh

    let targetWebhookUrl;
    let payload;
    let immediateBotResponse = ""; // Phản hồi tức thì cho người dùng

    if (input.startsWith("/")) {
      const parts = input.substring(1).split(" ");
      const commandName = parts[0].toLowerCase();
      const args = parts.slice(1);
      const fullArgs = args.join(" ").trim(); // Chuỗi đầy đủ các tham số (ví dụ: "router_A")

      const foundCommand = commands.find(
        (cmd) => cmd.name === commandName || cmd.aliases.includes(commandName)
      );

      if (!foundCommand) {
        setTypingOutput(`Lệnh "${input}" không hợp lệ. Vui lòng gõ \`/help\` để xem các lệnh có sẵn.`);
        setIsLoading(false);
        return;
      }

      // --- BẮT ĐẦU LOGIC XÁC THỰC THAM SỐ TRƯỚC KHI GỬI ---
      let validationError = null;
      if (foundCommand.params) {
        const requiredParams = foundCommand.params.filter(p => p.required);
        if (args.length < requiredParams.length) {
          validationError = `Thiếu tham số bắt buộc. Cú pháp đúng: \`${foundCommand.usage}\``;
        } else {
          for (let i = 0; i < foundCommand.params.length; i++) {
            const paramDef = foundCommand.params[i];
            const argValue = args[i] ? args[i].trim() : "";

            if (paramDef.required && argValue === "") {
              validationError = `Tham số "${paramDef.name}" là bắt buộc và không được để trống. Cú pháp: \`${foundCommand.usage}\``;
              break;
            }
            if (argValue) {
              if (paramDef.type === "string" && paramDef.minLength && argValue.length < paramDef.minLength) {
                validationError = `Tham số "${paramDef.name}" phải có ít nhất ${paramDef.minLength} ký tự.`;
                break;
              }
              if (paramDef.options && !paramDef.options.includes(argValue.toLowerCase())) {
                  validationError = `Tham số "${paramDef.name}" không hợp lệ. Chỉ chấp nhận: ${paramDef.options.join(", ")}.`;
                  break;
              }
            }
          }
        }
      }

      if (validationError) {
        setTypingOutput(`❌ Lỗi cú pháp lệnh: ${validationError}`);
        setIsLoading(false);
        return; // Dừng hàm, không gửi đi
      }
      // --- KẾT THÚC LOGIC XÁC THỰC THAM SỐ ---

      // Nếu lệnh được đánh dấu là internal, xử lý nội bộ và không gửi đi webhook
      if (foundCommand.internal) {
        const response = await handleInternalCommand(foundCommand.name, fullArgs);
        setTypingOutput(response);
        setIsLoading(false);
        return; // Dừng hàm sau khi xử lý nội bộ
      }

      // Nếu không phải internal, thiết lập payload và URL cho COMMAND_WEBHOOK_URL
      targetWebhookUrl = COMMAND_WEBHOOK_URL;

      // --- BẮT ĐẦU LOGIC TẠO MẢNG OPTIONS TINH GỌN ---
      const commandOptions = [];
      if (foundCommand.params) {
        foundCommand.params.forEach((paramDef, index) => {
          const argValue = args[index] ? args[index].trim() : undefined;

          // Chỉ thêm vào options nếu có giá trị (không thêm tham số trống)
          if (argValue !== undefined && argValue !== "") {
            commandOptions.push({
              name: paramDef.name.toLowerCase().replace(/\s/g, '_'), // Chuyển tên tham số thành snake_case
              value: argValue
            });
          }
        });
      }
      // --- KẾT THÚC LOGIC TẠO MẢNG OPTIONS TINH GỌN ---

      payload = {
        action: "sendCommand", // Action để n8n phân loại
        sessionId,
        data: { // Cấu trúc data theo yêu cầu (bỏ id và type)
          name: foundCommand.name,
          options: commandOptions,
        },
        metadata: { userId: "" },
      };

      // Đặt phản hồi tức thì cho các lệnh gửi đi webhook
      switch (foundCommand.name) {
        case "get-optical":
          immediateBotResponse = `Đang tra cứu mức thu optical cho router **${fullArgs}**...`;
          break;
        case "get-interface":
          immediateBotResponse = `Đang tra cứu thông tin interface cho router **${fullArgs}**...`;
          break;
        case "diagnose":
          immediateBotResponse = `Đang chẩn đoán sự cố: **${fullArgs}**...`;
          break;
        case "manual":
          immediateBotResponse = `Đang tìm kiếm hướng dẫn sử dụng cho cẩu model **${fullArgs}**...`;
          break;
        default:
          immediateBotResponse = `Đang xử lý lệnh /${foundCommand.name} với tham số "${fullArgs}"...`;
          break;
      }
      setTypingOutput(immediateBotResponse); // Hiển thị phản hồi tức thì
    } else {
      // Logic cho tin nhắn thông thường, gửi đến GENERAL_CHAT_WEBHOOK_URL
      targetWebhookUrl = GENERAL_CHAT_WEBHOOK_URL;
      payload = {
        action: "sendMessage", // Action để n8n phân loại
        sessionId,
        route: "general", // Có thể bỏ nếu n8n không cần
        chatInput: userMsg.text,
        metadata: { userId: "" },
      };
    }

    // Gửi request đến webhook tương ứng
    try {
      const res = await fetch(targetWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      const botText = data?.output || "⚠️ Không nhận được phản hồi hợp lệ từ dịch vụ.";
      console.log("Bot response:", botText);
      setTypingOutput("```"+botText.full_data+"```" || botText); // Cập nhật phản hồi cuối cùng từ webhook
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu đến webhook:", err);
      setTypingOutput("❌ Có lỗi xảy ra khi kết nối. Hãy thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý phím (Enter, Tab, Up/Down)
  const handleKeyDown = (e) => {
    const allSuggestions = Object.values(commandSuggestions).flat();

    if (e.key === "Enter") {
      sendMessage();
    } else if (e.key === "Tab" && isCommandMode && allSuggestions.length > 0) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của Tab
      const nextIndex =
        highlightedSuggestionIndex < allSuggestions.length - 1
          ? highlightedSuggestionIndex + 1
          : 0;
      setHighlightedSuggestionIndex(nextIndex);
      const selectedCommand = allSuggestions[nextIndex];
      setInput(`/${selectedCommand.name} `); // Tự động điền lệnh vào input
    } else if (
      e.key === "ArrowUp" &&
      isCommandMode &&
      allSuggestions.length > 0
    ) {
      e.preventDefault();
      const prevIndex =
        highlightedSuggestionIndex > 0
          ? highlightedSuggestionIndex - 1
          : allSuggestions.length - 1;
      setHighlightedSuggestionIndex(prevIndex);
      const selectedCommand = allSuggestions[prevIndex];
      setInput(`/${selectedCommand.name} `);
    } else if (
      e.key === "ArrowDown" &&
      isCommandMode &&
      allSuggestions.length > 0
    ) {
      e.preventDefault();
      const nextIndex =
        highlightedSuggestionIndex < allSuggestions.length - 1
          ? highlightedSuggestionIndex + 1
          : 0;
      setHighlightedSuggestionIndex(nextIndex);
      const selectedCommand = allSuggestions[nextIndex];
      setInput(`/${selectedCommand.name} `);
    }
  };

  // Các class cho theme (Dark/Light Mode)
  const themeClasses = darkMode
    ? {
        bg: "bg-gray-900",
        card: "bg-gray-800 text-white border-gray-700",
        input: "bg-gray-700 text-white border-gray-600 placeholder-gray-400",
        botBubble: "bg-gray-700 text-gray-100 border border-gray-600",
        userBubble: "bg-gradient-to-br from-cyan-500 to-blue-500 text-white",
        header: "bg-gray-850 border-gray-700 text-cyan-400",
      }
    : {
        bg: "bg-gray-100",
        card: "bg-white text-gray-900 border-gray-200",
        input: "bg-white text-gray-800 border-gray-300 placeholder-gray-400",
        botBubble: "bg-gray-200 text-gray-800 border border-gray-300",
        userBubble: "bg-gradient-to-br from-cyan-500 to-blue-500 text-white",
        header: "bg-white border-gray-200 text-cyan-600",
      };

  return (
    <div className="flex flex-col h-screen">
      <Header /> {/* Component Header của bạn */}
      <div
        className={`flex flex-grow items-center justify-center ${themeClasses.bg}
                     h-[calc(100vh-57px)]
                     md:px-4 md:py-6
                     `}
      >
        <div
          className={`w-full h-full flex flex-col overflow-hidden border
                     ${themeClasses.card}
                     md:rounded-xl md:shadow-xl
                     rounded-none shadow-none
                    
                     `}
        >
          {/* Header của Chatbot Card */}
          <div
            className={`flex items-center justify-between px-6 py-4 ${themeClasses.header} md:border-b md:border-gray-200`}
          >
            <div className="flex flex-row text-xl items-center gap-2 w-full justify-between">
              <img
                className="h-8 md:h-11 object-cover object-center"
                src="/images/text_IQ.png" // Đảm bảo đường dẫn logo của bạn đúng
                alt="CraneIQ logo"
              />
              {/* Nút bật/tắt Dark Mode (có thể uncomment nếu muốn dùng) */}
              {/* <Switch
                onClick={() => setDarkMode(!darkMode)}
                ripple={false}
                className="h-full w-full checked:bg-gradient-to-r from-cyan-500 to-blue-500"
                containerProps={{
                  className: "w-11 h-6",
                }}
                circleProps={{
                  className: "before:hidden left-0.5 border-none",
                }}
              /> */}
            </div>
          </div>

          {/* Khu vực hiển thị tin nhắn */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {msg.sender === "bot" && (
                    <img
                      src="/images/logo_IQ.png" // Đảm bảo đường dẫn logo bot đúng
                      className="h-5 w-5 object-cover object-center rounded-full flex-shrink-0"
                      alt="Bot Logo"
                    />
                  )}
                  {msg.sender === "user" && (
                    <FaUserCircle className="text-xl text-gray-400 flex-shrink-0" />
                  )}
                  <div
                    className={`w-full-[80%] max-w-[80%] px-4 py-2 rounded-xl text-md leading-relaxed shadow ${
                      msg.sender === "user"
                        ? `${themeClasses.userBubble} rounded-br-none`
                        : `${themeClasses.botBubble} rounded-bl-none`
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {/* Hiệu ứng "Đang suy nghĩ..." khi bot loading */}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-md animate-pulse ">
                <img
                  src="/images/logo_IQ.png" // Đảm bảo đường dẫn logo bot đúng
                  className="h-5 w-5 object-cover object-center rounded-full flex-shrink-0"
                  alt="Bot Logo"
                />
                <span>
                  <Typewriter
                    words={["Đang suy nghĩ ..."]}
                    loop={1}
                    typeSpeed={80}
                    deleteSpeed={50}
                  />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Dùng để cuộn xuống cuối */}
          </div>

          {/* Input và Gợi ý lệnh */}
          <div className={`px-4 py-3 ${themeClasses.header} relative`}>
            {/* Vùng hiển thị gợi ý lệnh */}
            {isCommandMode && Object.keys(commandSuggestions).length > 0 && (
              <div
                className={`absolute bottom-full left-0 right-0 mb-2 p-3 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 ${themeClasses.card}`}
              >
                {Object.entries(commandSuggestions).map(([category, cmds]) => (
                  <div key={category} className="mb-2">
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">
                      {category}
                    </h4>
                    {cmds.map((cmd, cmdIdx) => {
                      // Tính toán index tổng thể để tô sáng đúng khi dùng phím
                      const allFlatSuggestions = Object.values(
                        commandSuggestions
                      ).flat();
                      const overallIndex = allFlatSuggestions.findIndex(
                        (s) => s.name === cmd.name
                      );

                      return (
                        <div
                          key={cmd.name}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                            darkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-100"
                          } ${
                            highlightedSuggestionIndex === overallIndex
                              ? darkMode
                                ? "bg-gray-700"
                                : "bg-gray-100"
                              : "bg-gray-50" // Màu nền mặc định cho suggestion
                          }`}
                          onClick={() => {
                            setInput(`/${cmd.name} `); // Tự động điền lệnh và thêm khoảng trắng
                            setIsCommandMode(false);
                            setCommandSuggestions({});
                            setHighlightedSuggestionIndex(-1);
                            inputRef.current?.focus(); // Giữ focus vào input
                          }}
                        >
                          <span className="font-mono text-cyan-600">
                            /{cmd.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            - {cmd.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Input field và nút gửi */}
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Nhập tin nhắn hoặc gõ '/' để dùng lệnh..."
                className={`flex-1 px-4 py-2 pr-12 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-cyan-400 text-md border border-gray-100 shadow-md transition-all duration-200 ease-in-out`}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className={`absolute right-2 top-1/2 -translate-y-1/2
                               flex items-center justify-center h-8 w-8 rounded-full
                               bg-gradient-to-r from-cyan-500 to-blue-500 text-white
                               hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 ease-in-out
                               shadow-md
                               ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FaPaperPlane className="text-md" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;