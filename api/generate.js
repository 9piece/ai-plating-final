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
        model: "ep-20250603185353-xr5tb",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    const imageContent = data.choices?.[0]?.message?.content;
    const imageUrl = imageContent?.find?.(item => item.type === "image_url")?.image_url?.url;

    if (imageUrl) {
      res.status(200).json({ image: imageUrl });
    } else {
      res.status(500).json({ error: "生成失败：未返回图像链接", detail: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
