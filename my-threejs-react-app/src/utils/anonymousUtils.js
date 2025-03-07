// 生成匿名ID
const generateAnonymousId = () => {
  const prefix = "流浪星";
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}${randomNum}`;
};

// 简单的内容过滤
const filterContent = (content) => {
  // 敏感词列表（示例）
  const sensitiveWords = ["暴力", "色情", "违法", "犯罪", "政治"];
  let filteredContent = content;

  sensitiveWords.forEach((word) => {
    const regex = new RegExp(word, "g");
    filteredContent = filteredContent.replace(regex, "***");
  });

  return filteredContent;
};

// 检查内容是否合适
const isContentAppropriate = (content) => {
  // 简单的内容检查规则（示例）
  const hasInappropriateContent =
    content.length > 5000 || // 内容过长
    /^[\s]*$/.test(content) || // 空白内容
    /(http|https):\/\//.test(content); // 包含链接

  return !hasInappropriateContent;
};

export { generateAnonymousId, filterContent, isContentAppropriate };
