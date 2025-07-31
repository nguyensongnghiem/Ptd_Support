import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";
import { FaPaperPlane, FaRobot, FaUserCircle } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { Switch, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import commands from "../commands/commands.js";

// Lấy URL từ biến môi trường
const GENERAL_CHAT_WEBHOOK_URL = import.meta.env.VITE_GENERAL_CHAT_WEBHOOK_URL;
const COMMAND_WEBHOOK_URL = import.meta.env.VITE_COMMAND_WEBHOOK_URL;

// Hàm tạo Session ID duy nhất
function generateSessionId() {
  return uuidv4();
}

function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingOutput, setTypingOutput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [commandSuggestions, setCommandSuggestions] = useState({});
  const [isCommandMode, setIsCommandMode] = useState(false);
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] =
    useState(-1);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  // THAY ĐỔI LỚN: Sử dụng Map để lưu trữ refs của từng mục gợi ý
  const suggestionItemRefs = useRef(new Map());

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

  // Tự động focus vào input sau khi isLoading chuyển từ true về false
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, messages]);

  // THÊM MỚI: Cuộn gợi ý đang được highlight vào tầm nhìn
  useEffect(() => {
    if (highlightedSuggestionIndex !== -1 && suggestionItemRefs.current.size > 0) {
      const highlightedElement = suggestionItemRefs.current.get(
        highlightedSuggestionIndex
      );
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedSuggestionIndex]);

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
                `- **/${cmd.name}**${cmd.usage ? ` \`${cmd.usage}\`` : ""}: ${
                  cmd.description
                }`
              );
              return acc;
            }, {})
          )
            .map(
              ([category, cmdList]) => `**${category}**\n` + cmdList.join("\n")
            )
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
        setTypingOutput(
          `Lệnh "${input}" không hợp lệ. Vui lòng gõ \`/help\` để xem các lệnh có sẵn.`
        );
        setIsLoading(false);
        return;
      }

      // --- BẮT ĐẦU LOGIC XÁC THỰC THAM SỐ TRƯỚC KHI GỬI ---
      let validationError = null;
      if (foundCommand.params) {
        const requiredParams = foundCommand.params.filter((p) => p.required);
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
              if (
                paramDef.type === "string" &&
                paramDef.minLength &&
                argValue.length < paramDef.minLength
              ) {
                validationError = `Tham số "${paramDef.name}" phải có ít nhất ${paramDef.minLength} ký tự.`;
                break;
              }
              if (
                paramDef.options &&
                !paramDef.options.includes(argValue.toLowerCase())
              ) {
                validationError = `Tham số "${paramDef.name}" không hợp lệ. Chỉ chấp nhận: ${paramDef.options.join(
                  ", "
                )}.`;
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
        const response = await handleInternalCommand(
          foundCommand.name,
          fullArgs
        );
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
              name: paramDef.name.toLowerCase().replace(/\s/g, "_"), // Chuyển tên tham số thành snake_case
              value: argValue,
            });
          }
        });
      }
      // --- KẾT THÚC LOGIC TẠO MẢNG OPTIONS TINH GỌN ---

      payload = {
        action: "sendCommand", // Action để n8n phân loại
        sessionId,
        data: {
          // Cấu trúc data theo yêu cầu (bỏ id và type)
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
        case "get-fo":
          immediateBotResponse = `Đang lấy thông tin quang trạm **${fullArgs}**...`;
          break;
        case "get-hardware":
          immediateBotResponse = `Đang tra cứu thông tin phần cứng router **${fullArgs}**...`;
          break;
        case "get-alarm":
          immediateBotResponse = `Đang tra cứu thông tin cảnh báo router **${fullArgs}**...`;
          break;
        case "ping":
          immediateBotResponse = `Đang ping đến thiết bị **${fullArgs}**...`;
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
      const botText =
        data?.output || "⚠️ Không nhận được phản hồi hợp lệ từ dịch vụ.";
      console.log("Bot response:", botText);
      if (payload.action === "sendCommand") {
        // Nếu là lệnh, chỉ cập nhật phản hồi cuối cùng từ webhook
        setTypingOutput(botText.full_data); // Cập nhật phản hồi cuối cùng từ webhook
      } else setTypingOutput(botText);
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu đến webhook:", err);
      setTypingOutput("❌ Có lỗi xảy ra khi kết nối. Hãy thử lại sau.");
    } finally {
      setIsLoading(false);
      // Dòng focus đã được chuyển sang useEffect riêng biệt.
    }
  };

  // Xử lý phím (Enter, Tab, Up/Down)
  const handleKeyDown = (e) => {
    const allSuggestions = Object.values(commandSuggestions).flat();

    // Biến để lưu trữ index mới sau khi xử lý ArrowUp/ArrowDown
    let newHighlightedIndex = highlightedSuggestionIndex;

    if (e.key === "Enter") {
      sendMessage();
    } else if (e.key === "Tab" && isCommandMode && allSuggestions.length > 0) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của Tab
      newHighlightedIndex =
        highlightedSuggestionIndex < allSuggestions.length - 1
          ? highlightedSuggestionIndex + 1
          : 0;
      setHighlightedSuggestionIndex(newHighlightedIndex);
      setInput(`/${allSuggestions[newHighlightedIndex].name} `); // Cập nhật input với lệnh được highlight
    } else if (
      e.key === "ArrowUp" &&
      isCommandMode &&
      allSuggestions.length > 0
    ) {
      e.preventDefault();
      newHighlightedIndex =
        highlightedSuggestionIndex > 0
          ? highlightedSuggestionIndex - 1
          : allSuggestions.length - 1;
      setHighlightedSuggestionIndex(newHighlightedIndex);
      setInput(`/${allSuggestions[newHighlightedIndex].name} `);
    } else if (
      e.key === "ArrowDown" &&
      isCommandMode &&
      allSuggestions.length > 0
    ) {
      e.preventDefault();
      newHighlightedIndex =
        highlightedSuggestionIndex < allSuggestions.length - 1
          ? highlightedSuggestionIndex + 1
          : 0;
      setHighlightedSuggestionIndex(newHighlightedIndex);
      setInput(`/${allSuggestions[newHighlightedIndex].name} `);
    }
    // Logic cuộn sẽ được xử lý trong useEffect khi `highlightedSuggestionIndex` thay đổi
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
        botBubble: "bg-gray-200 text-secondary-gray border border-gray-300",
        userBubble:
          "bg-gradient-to-br from-light-bg-begin to-light-bg-end text-white",
        header: "bg-white border-gray-200 text-cyan-600",
      };

  return (
    <div className="flex flex-col h-screen">
      <Header /> {/* Component Header của bạn */}
      <div
        className={`flex flex-grow items-center justify-center ${themeClasses.bg}
                   h-[calc(100vh-57px)]`}
      >
        <div
          className={`w-full h-full flex flex-col overflow-hidden border
                     ${themeClasses.card}
                     rounded-none shadow-none`}
        >
          {/* Header của Chatbot Card */}
          <div
            className={`flex items-center justify-between px-6 py-4 ${themeClasses.header} md:border-b md:border-gray-200`}
          >
            <div className="flex flex-row text-xl items-center gap-2 w-full justify-between">
              <Typography className="font-bold text-2xl text-secondary-gray">
                Trợ lý AI - Hỗ trợ kỹ thuật
              </Typography>
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
                      src="/images/ptd_ai2.png" // Đảm bảo đường dẫn logo bot đúng
                      className="h-5 w-5 object-cover object-center rounded-full flex-shrink-0"
                      alt="Bot Logo"
                    />
                  )}
                  {msg.sender === "user" && (
                    <FaUserCircle className="text-xl text-gray-400 flex-shrink-0" />
                  )}
                  <div
                    className={`w-full max-w-full px-4 py-2 rounded-xl text-md leading-relaxed shadow prose ${
                      msg.sender === "user"
                        ? `${themeClasses.userBubble} rounded-br-none`
                        : `${themeClasses.botBubble} rounded-bl-none`
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {/* Hiệu ứng "Đang suy nghĩ..." khi bot loading */}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-md animate-pulse ">
                <img
                  src="/images/ptd_ai2.png" // Đảm bảo đường dẫn logo bot đúng
                  className="h-5 w-5 object-cover object-center rounded-full flex-shrink-0"
                  alt="Bot Logo"
                />
                <span>
                  <Typewriter
                    words={["Đang suy nghĩ..."]}
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
          <div className={`px-4 py-3 ${themeClasses.header} relative `}>
            {/* Vùng hiển thị gợi ý lệnh */}
            {isCommandMode && Object.keys(commandSuggestions).length > 0 && (
              <div
                className={`absolute bottom-full left-0 right-0 mb-2 p-3 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 ${themeClasses.card}`}
              >
                {Object.entries(commandSuggestions).map(([category, cmds]) => (
                  <div key={category} className="mb-2">
                    <h4 className="text-sm font-semibold text-secondary-gray mb-1">
                      {category}
                    </h4>
                    {cmds.map((cmd, cmdIdx) => {
                      // Tính toán index tổng thể để tô sáng đúng khi dùng phím
                      const allFlatSuggestions =
                        Object.values(commandSuggestions).flat();
                      const overallIndex = allFlatSuggestions.findIndex(
                        (s) => s.name === cmd.name
                      );

                      return (
                        <div
                          key={cmd.name}
                          // THAY ĐỔI LỚN: Gắn ref vào từng mục gợi ý
                          ref={(el) => {
                            if (el) {
                              suggestionItemRefs.current.set(overallIndex, el);
                            } else {
                              suggestionItemRefs.current.delete(overallIndex);
                            }
                          }}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                          } ${
                            highlightedSuggestionIndex === overallIndex
                              ? darkMode
                                ? "bg-gray-700"
                                : "bg-gray-200"
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
                          <span className="font-mono font-semibold text-gray-600">
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
                className={`flex-1 px-4 py-2 pr-12 rounded-lg ${themeClasses.input} focus:outline-none focus:ring-2 focus:ring-light-bg-end text-md border border-gray-100 shadow-md transition-all duration-200 ease-in-out`}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className={`absolute right-2 top-1/2 -translate-y-1/2
                               flex items-center justify-center h-8 w-8 rounded-full
                               bg-gradient-to-r from-light-bg-begin to-light-bg-end text-white
                               hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 ease-in-out
                               shadow-md
                               ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FaPaperPlane className="text-md " />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;