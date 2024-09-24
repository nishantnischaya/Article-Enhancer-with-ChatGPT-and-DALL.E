document
  .getElementById("enhance-btn")
  .addEventListener("click", async function () {
    const article = document.getElementById("article-input").value;
    if (!article) {
      alert("Please paste an article.");
      return;
    }

    // Call ChatGPT to enhance the article
    const enhancedText = await enhanceArticleWithChatGPT(article);

    // Call DALL.E to generate images
    const images = await generateImagesWithDALLE(enhancedText);

    // Display enhanced article with images
    displayEnhancedArticle(enhancedText, images);
  });

async function enhanceArticleWithChatGPT(article) {
  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer YOUR_OPEN_AI_KEY`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      prompt: `Please make this article more user-friendly and engaging to read:\n\n${article}`,
      max_tokens: 1000,
    }),
  });
  const data = await response.json();
  return data.choices[0].text;
}

async function generateImagesWithDALLE(article) {
  // Extract main ideas from the enhanced article
  const mainIdeas = extractMainIdeas(article);

  // For each idea, generate an image using DALL.E
  const images = [];
  for (const idea of mainIdeas) {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPEN_AI_KEY`,
        },
        body: JSON.stringify({
          prompt: idea,
          n: 1,
          size: "1024x1024",
        }),
      }
    );
    const data = await response.json();
    images.push(data.data[0].url);
  }
  return images;
}

function extractMainIdeas(text) {
  // A simple extraction of main ideas, e.g., first sentence of each paragraph
  return text.split(".").slice(0, 3); // Modify this as needed for better idea extraction
}

function displayEnhancedArticle(text, images) {
  const enhancedArticleDiv = document.getElementById("enhanced-article");
  enhancedArticleDiv.innerHTML = `<p>${text}</p>`;

  images.forEach((imageUrl) => {
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    enhancedArticleDiv.appendChild(imgElement);
  });
}
