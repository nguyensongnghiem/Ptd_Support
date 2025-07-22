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
    category: "Hỗ trợ",
    aliases: ["về_chúng_tôi", "thông_tin"],
    usage: "/about",
    internal: true, // Lệnh này sẽ được xử lý nội bộ
  },
  // ... thêm các lệnh khác của bạn
];

export default commands;