export const STATUS_LABELS = {
  present: "Keldi",
  late: "Kech keldi",
  absent: "Kelmadi",
  excused: "Sababli",
};

export const STATUS_COLORS = {
  present: "bg-green-100 text-green-700 border-green-200",
  late: "bg-yellow-100 text-yellow-700 border-yellow-200",
  absent: "bg-red-100 text-red-700 border-red-200",
  excused: "bg-blue-100 text-blue-700 border-blue-200",
};

export const STATUS_ICON = {
  present: "✓",
  late: "⚠",
  absent: "✗",
  excused: "●",
};

// Tap qilganda qaysi statusga o'tishini belgilaydi
export const STATUS_CYCLE = ["present", "late", "absent", "excused"];
