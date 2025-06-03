export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  try {
    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 0bce1539-21ee-486d-acdd-95ecc559e984"
      },
      body: JSON.stringify({
        model: "doubao-1.5-thinking-pro",
        messages: [
          {
            role: "system",
            content: "你是一名高级食物摆盘创意师，请将用户输入的菜名和风格描述扩写为英文高质量图像生成描述，描述应包括菜品特色、摆盘风格、餐具元素、灯光和构图风格等。"
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (content) {
      res.status(200).json({ prompt: content });
    } else {
      res.status(500).json({ error: "未获取到扩写结果", detail: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
