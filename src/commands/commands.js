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
    name: "get-hardware",
    description: "Tra cứu thông tin phần cứng router.",
    category: "Tra cứu thông tin",
    aliases: ["hardware", "card"],
    usage: "/get-hardware [Tên router]",
    params: [
      { name: "Tên router", required: true, type: "string", minLength: 1 },
    ],
    internal: false, // Lệnh này sẽ gửi đi webhook
  },
  {
    name: "get-alarm",
    description: "Tra cứu thông tin cảnh báo router.",
    category: "Tra cứu thông tin",
    aliases: ["alarm", "warning"],
    usage: "/get-alarm [Tên router]",
    params: [
      { name: "Tên router", required: true, type: "string", minLength: 1 },
    ],
    internal: false, // Lệnh này sẽ gửi đi webhook
  },
  {
    name: "ping",
    description: "Ping đến thiết bị router từ server.",
    category: "Tra cứu thông tin",
    aliases: ["ping", "trace"],
    usage: "/ping [Tên router]",
    params: [
      { name: "Tên router", required: true, type: "string", minLength: 1 },
    ],
    internal: false, // Lệnh này sẽ gửi đi webhook
  },
  {
    name: "get-fo",
    description: "Tra cứu thông tin tuyến cáp theo Site ID.",
    category: "Tra cứu thông tin",
    aliases: ["fo", "cable"],
    usage: "/get-fo [Site ID]",
    params: [{ name: "Site ID", required: true, type: "string", minLength: 1 }],
    internal: false, // Lệnh này sẽ gửi đi webhook
  },
  {
    name: "get-cpu-usage",
    description: "Tra cứu thông tin tải cpu router.",
    category: "Tra cứu thông tin",
    aliases: ["cpu", "usage"],
    usage: "/get-cpu-usage [Tên router]",
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
