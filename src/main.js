const form = document.querySelector("#generator-form");
const productNameInput = document.querySelector("#product-name");
const productDescriptionInput = document.querySelector("#product-description");
const productPriceInput = document.querySelector("#product-price");
const productPromoInput = document.querySelector("#product-promo");
const targetAudienceInput = document.querySelector("#target-audience");
const productVariantInput = document.querySelector("#product-variant");
const productStrengthInput = document.querySelector("#product-strength");
const productLinkInput = document.querySelector("#product-link");
const productCategoryInput = document.querySelector("#product-category");
const campaignPresetInput = document.querySelector("#campaign-preset");
const aiProviderInput = document.querySelector("#ai-provider");
const geminiApiKeyInput = document.querySelector("#gemini-api-key");
const geminiModelInput = document.querySelector("#gemini-model");
const rememberApiKeyInput = document.querySelector("#remember-api-key");
const toneInput = document.querySelector("#tone");
const hashtagCountInput = document.querySelector("#hashtag-count");
const variationCountInput = document.querySelector("#variation-count");
const results = document.querySelector("#results");
const statusText = document.querySelector("#status-text");
const copyAllButton = document.querySelector("#copy-all");
const exportTxtButton = document.querySelector("#export-txt");
const exportCsvButton = document.querySelector("#export-csv");
const historyList = document.querySelector("#history-list");
const clearHistoryButton = document.querySelector("#clear-history");

const historyKey = "descriptionHashtagAgentHistory";
const settingsKey = "descriptionHashtagAgentSettings";
let latestRun = null;
let history = loadHistory();
let settings = loadSettings();

const platformConfig = [
  {
    id: "tiktok",
    label: "TikTok",
    initials: "TT",
    hint: "Hook cepat, santai, cocok untuk caption video pendek.",
    cta: "Cek produknya sekarang dan simpan dulu biar tidak lupa.",
    maxHashtagChars: null
  },
  {
    id: "shopee",
    label: "Shopee",
    initials: "SP",
    hint: "Fokus benefit, keyword produk, dan hashtag maksimal 150 karakter.",
    cta: "Klik beli sekarang sebelum kehabisan.",
    maxHashtagChars: 150
  },
  {
    id: "facebook",
    label: "FB Reels",
    initials: "FB",
    hint: "Caption jelas dengan dorongan komentar dan share.",
    cta: "Tulis di komentar kalau kamu mau rekomendasi pemakaian.",
    maxHashtagChars: null
  },
  {
    id: "threads",
    label: "Threads",
    initials: "TH",
    hint: "Nada conversational, singkat, dan terasa personal.",
    cta: "Bagikan ke teman yang sedang cari produk seperti ini.",
    maxHashtagChars: null
  }
];

const tonePresets = {
  friendly: {
    opener: "Produk ini cocok buat kamu yang ingin pilihan praktis tanpa ribet.",
    style: "natural, ringan, dan mudah dipahami"
  },
  premium: {
    opener: "Pilihan tepat untuk kamu yang mengutamakan kualitas dan detail.",
    style: "rapi, elegan, dan meyakinkan"
  },
  energetic: {
    opener: "Waktunya upgrade kebutuhan harianmu dengan produk yang lebih siap pakai.",
    style: "aktif, catchy, dan penuh dorongan"
  },
  simple: {
    opener: "Solusi simpel untuk kebutuhan harianmu.",
    style: "singkat, jelas, dan langsung ke inti"
  }
};

const categoryPresets = {
  general: {
    label: "Umum",
    angle: "produk pilihan untuk kebutuhan sehari-hari",
    tags: ["ProdukPilihan", "BelanjaOnline", "ProdukTerlaris"]
  },
  skincare: {
    label: "Skincare & beauty",
    angle: "perawatan diri yang nyaman dipakai dan mudah masuk rutinitas",
    tags: ["SkincareRoutine", "BeautyFinds", "KulitSehat", "GlowUp"]
  },
  fashion: {
    label: "Fashion",
    angle: "item penunjang gaya yang mudah dipadukan",
    tags: ["OOTD", "FashionFinds", "StyleHarian", "OutfitIdeas"]
  },
  food: {
    label: "Makanan & minuman",
    angle: "pilihan rasa yang praktis untuk dinikmati kapan saja",
    tags: ["Kuliner", "MakananEnak", "Cemilan", "FoodReview"]
  },
  electronics: {
    label: "Elektronik & gadget",
    angle: "perangkat praktis untuk menunjang aktivitas harian",
    tags: ["GadgetReview", "TechFinds", "Elektronik", "GadgetMurah"]
  },
  home: {
    label: "Rumah tangga",
    angle: "solusi simpel untuk rumah yang lebih rapi dan nyaman",
    tags: ["HomeLiving", "RumahRapi", "PeralatanRumah", "HomeFinds"]
  },
  baby: {
    label: "Bayi & anak",
    angle: "produk yang membantu kebutuhan anak dan keluarga",
    tags: ["PerlengkapanBayi", "ProdukAnak", "MomLife", "BabyNeeds"]
  },
  health: {
    label: "Kesehatan",
    angle: "pendukung kebiasaan sehat yang praktis digunakan",
    tags: ["HidupSehat", "HealthFinds", "Wellness", "SehatHarian"]
  }
};

const campaignPresets = {
  soft: {
    label: "Soft selling",
    hook: "Kalau kamu sedang cari opsi yang praktis, ini bisa masuk list.",
    prompt: "Bangun rasa penasaran tanpa terdengar memaksa.",
    tags: ["RekomendasiProduk", "WajibCoba"]
  },
  hard: {
    label: "Hard selling",
    hook: "Stok terbatas, waktunya checkout sebelum kehabisan.",
    prompt: "Tekankan urgensi, benefit, dan ajakan beli.",
    tags: ["CheckoutSekarang", "BestDeal"]
  },
  viral: {
    label: "Produk viral",
    hook: "Produk ini cocok banget buat konten yang ingin terlihat ramai dan mudah dibagikan.",
    prompt: "Buat terdengar catchy, trend-aware, dan mudah diingat.",
    tags: ["ProdukViral", "ViralFinds", "FYP"]
  },
  affiliate: {
    label: "Affiliate review",
    hook: "Aku pilih produk ini karena poin utamanya gampang dijelaskan ke calon pembeli.",
    prompt: "Nada review jujur, jelas, dan cocok untuk affiliate.",
    tags: ["AffiliateIndonesia", "ReviewJujur", "RacunBelanja"]
  },
  promo: {
    label: "Promo / flash sale",
    hook: "Momen promo seperti ini sayang banget kalau dilewatkan.",
    prompt: "Tonjolkan kesempatan hemat dan dorongan checkout.",
    tags: ["PromoHariIni", "FlashSale", "Diskon"]
  },
  educational: {
    label: "Edukasi produk",
    hook: "Sebelum beli, kenali dulu kenapa produk ini relevan buat kebutuhanmu.",
    prompt: "Beri konteks, manfaat, dan cara memosisikan produk.",
    tags: ["TipsBelanja", "EdukasiProduk", "InfoProduk"]
  }
};

const variationAngles = [
  "benefit-first",
  "problem-solution",
  "social-proof",
  "quick-review",
  "daily-use"
];

hydrateSettings();
renderHistory();
updateProviderUi();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const productName = normalizeText(productNameInput.value);
  const productDescription = normalizeText(productDescriptionInput.value);
  const salesDetails = collectSalesDetails();
  const category = productCategoryInput.value;
  const campaign = campaignPresetInput.value;
  const aiProvider = aiProviderInput.value;
  const geminiApiKey = normalizeText(geminiApiKeyInput.value);
  const geminiModel = normalizeText(geminiModelInput.value) || "gemini-2.0-flash";
  const tone = toneInput.value;
  const hashtagCount = clamp(Number(hashtagCountInput.value) || 10, 4, 18);
  const variationCount = clamp(Number(variationCountInput.value) || 3, 1, 5);

  if (!productName) {
    productNameInput.focus();
    statusText.textContent = "Nama produk wajib diisi.";
    return;
  }

  const options = {
    productName,
    productDescription,
    salesDetails,
    category,
    campaign,
    tone,
    hashtagCount,
    variationCount
  };

  saveSettings();
  statusText.textContent = aiProvider === "gemini" ? "Menghubungi Gemini..." : "Membuat output lokal...";
  form.querySelector(".primary-action").disabled = true;

  try {
    latestRun = aiProvider === "gemini"
      ? await generateGeminiRun({ ...options, geminiApiKey, geminiModel })
      : generateRun(options);
  } catch (error) {
    console.warn(error);
    latestRun = generateRun(options);
    statusText.textContent = "Gemini gagal dipakai, output dibuat dengan generator lokal.";
  } finally {
    form.querySelector(".primary-action").disabled = false;
  }

  renderResults(latestRun);
  saveRunToHistory(latestRun);
  setOutputActionsEnabled(true);
  if (!statusText.textContent.includes("Gemini gagal")) {
    statusText.textContent = `Selesai. ${latestRun.variants.length} variasi konten siap dipakai${latestRun.source === "gemini" ? " dari Gemini" : ""}.`;
  }
});

aiProviderInput.addEventListener("change", updateProviderUi);
rememberApiKeyInput.addEventListener("change", saveSettings);
geminiApiKeyInput.addEventListener("input", () => {
  if (rememberApiKeyInput.checked) saveSettings();
});
geminiModelInput.addEventListener("input", saveSettings);

copyAllButton.addEventListener("click", async () => {
  if (!latestRun) return;
  await copyText(formatRunOutput(latestRun));
  copyAllButton.textContent = "Tersalin";
  setTimeout(() => {
    copyAllButton.textContent = "Copy Semua";
  }, 1400);
});

exportTxtButton.addEventListener("click", () => {
  if (!latestRun) return;
  downloadFile(`${slugify(latestRun.productName)}-copy.txt`, formatRunOutput(latestRun), "text/plain;charset=utf-8");
});

exportCsvButton.addEventListener("click", () => {
  if (!latestRun) return;
  downloadFile(`${slugify(latestRun.productName)}-copy.csv`, formatRunCsv(latestRun), "text/csv;charset=utf-8");
});

clearHistoryButton.addEventListener("click", () => {
  history = [];
  localStorage.removeItem(historyKey);
  renderHistory();
});

function generateRun(options) {
  const createdAt = new Date().toISOString();
  const categoryPreset = categoryPresets[options.category] ?? categoryPresets.general;
  const campaignPreset = campaignPresets[options.campaign] ?? campaignPresets.soft;
  const tonePreset = tonePresets[options.tone] ?? tonePresets.friendly;
  const detailText = buildSalesDetailText(options.salesDetails);
  const benefits = extractBenefits(`${options.productDescription}. ${options.salesDetails?.strength}`);
  const keywords = extractKeywords(`${options.productName} ${options.productDescription} ${detailText} ${categoryPreset.label}`);

  const variants = Array.from({ length: options.variationCount }, (_, index) => {
    const angle = variationAngles[index % variationAngles.length];
    const tags = buildHashtags({
      productName: options.productName,
      keywords,
      categoryPreset,
      campaignPreset,
      count: options.hashtagCount,
      variantIndex: index
    });

    return {
      id: index + 1,
      title: buildVariationTitle(angle, campaignPreset.label),
      platforms: generatePlatformOutput({
        productName: options.productName,
        productDescription: options.productDescription,
        salesDetails: options.salesDetails,
        benefits,
        categoryPreset,
        campaignPreset,
        tonePreset,
        tags,
        angle,
        variantIndex: index
      })
    };
  });

  return {
    createdAt,
    productName: options.productName,
    productDescription: options.productDescription,
    salesDetails: options.salesDetails,
    source: "local",
    category: options.category,
    campaign: options.campaign,
    tone: options.tone,
    hashtagCount: options.hashtagCount,
    variationCount: options.variationCount,
    variants
  };
}

async function generateGeminiRun(options) {
  const localRun = generateRun(options);
  const categoryPreset = categoryPresets[options.category] ?? categoryPresets.general;
  const campaignPreset = campaignPresets[options.campaign] ?? campaignPresets.soft;
  const tonePreset = tonePresets[options.tone] ?? tonePresets.friendly;
  const prompt = buildGeminiPrompt({
    ...options,
    categoryLabel: categoryPreset.label,
    campaignLabel: campaignPreset.label,
    categoryAngle: categoryPreset.angle,
    campaignPrompt: campaignPreset.prompt,
    toneStyle: tonePreset.style
  });
  const modelPath = options.geminiModel.startsWith("models/")
    ? options.geminiModel
    : `models/${options.geminiModel}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": options.geminiApiKey
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  const parsed = parseJsonText(text);
  return normalizeGeminiRun(parsed, localRun);
}

function buildGeminiPrompt(options) {
  return `
Anda adalah AI agent copywriter e-commerce Indonesia.
Buat deskripsi dan hashtag otomatis untuk produk berikut.

Input:
- Nama produk: ${options.productName}
- Deskripsi tambahan: ${options.productDescription || "-"}
- Harga: ${options.salesDetails?.price || "-"}
- Promo: ${options.salesDetails?.promo || "-"}
- Target pembeli: ${options.salesDetails?.targetAudience || "-"}
- Varian / bahan: ${options.salesDetails?.variant || "-"}
- Keunggulan utama: ${options.salesDetails?.strength || "-"}
- Link produk: ${options.salesDetails?.link || "-"}
- Kategori: ${options.categoryLabel}
- Angle kategori: ${options.categoryAngle}
- Campaign: ${options.campaignLabel}
- Arahan campaign: ${options.campaignPrompt}
- Gaya tulisan: ${options.toneStyle}
- Jumlah variasi: ${options.variationCount}
- Jumlah hashtag ideal: ${options.hashtagCount}

Platform wajib:
- tiktok
- shopee
- facebook
- threads

Aturan:
- Tulis dalam bahasa Indonesia.
- Buat caption yang natural, siap pakai, dan tidak terlalu kaku.
- Shopee harus berisi deskripsi yang cocok untuk marketplace.
- Hashtag Shopee jika digabung dengan spasi wajib maksimal 150 karakter.
- Setiap hashtag harus diawali #.
- Jangan memakai emoji.
- Jangan menambahkan teks di luar JSON.

Format JSON persis:
{
  "variants": [
    {
      "title": "Nama variasi singkat",
      "platforms": {
        "tiktok": { "description": "...", "hashtags": ["#Tag"] },
        "shopee": { "description": "...", "hashtags": ["#Tag"] },
        "facebook": { "description": "...", "hashtags": ["#Tag"] },
        "threads": { "description": "...", "hashtags": ["#Tag"] }
      }
    }
  ]
}
`.trim();
}

function normalizeGeminiRun(parsed, fallbackRun) {
  const variants = Array.isArray(parsed?.variants) ? parsed.variants : [];
  const normalizedVariants = fallbackRun.variants.map((fallbackVariant, variantIndex) => {
    const geminiVariant = variants[variantIndex] ?? {};
    const platforms = fallbackVariant.platforms.map((fallbackPlatform) => {
      const geminiPlatform = geminiVariant.platforms?.[fallbackPlatform.id] ?? {};
      const rawTags = Array.isArray(geminiPlatform.hashtags)
        ? geminiPlatform.hashtags
        : String(geminiPlatform.hashtags ?? "").split(/\s+/);
      const tags = rawTags
        .map((tag) => normalizeText(tag))
        .filter(Boolean)
        .map((tag) => tag.startsWith("#") ? tag : `#${hashtagify(tag)}`);
      const platformTags = fallbackPlatform.maxHashtagChars
        ? limitHashtagChars(tags, fallbackPlatform.maxHashtagChars)
        : tags.slice(0, fallbackRun.hashtagCount);
      const finalTags = platformTags.length ? platformTags : fallbackPlatform.hashtags.split(/\s+/);

      return {
        ...fallbackPlatform,
        description: normalizeText(geminiPlatform.description) || fallbackPlatform.description,
        hashtags: finalTags.join(" "),
        hashtagChars: finalTags.join(" ").length
      };
    });

    return {
      ...fallbackVariant,
      title: normalizeText(geminiVariant.title) || fallbackVariant.title,
      platforms
    };
  });

  return {
    ...fallbackRun,
    source: "gemini",
    variants: normalizedVariants
  };
}

function parseJsonText(text) {
  const trimmed = normalizeText(text);
  if (!trimmed) {
    throw new Error("Gemini tidak mengembalikan teks.");
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Output Gemini bukan JSON.");
    }
    return JSON.parse(match[0]);
  }
}

function generatePlatformOutput({ productName, productDescription, salesDetails, benefits, categoryPreset, campaignPreset, tonePreset, tags, angle, variantIndex }) {
  return platformConfig.map((platform) => {
    const description = buildDescription({
      platform: platform.id,
      productName,
      productDescription,
      salesDetails,
      benefits,
      categoryPreset,
      campaignPreset,
      tonePreset,
      cta: platform.cta,
      angle,
      variantIndex
    });

    const platformTags = platform.maxHashtagChars
      ? limitHashtagChars(tags, platform.maxHashtagChars)
      : tags;

    return {
      ...platform,
      description,
      hashtags: platformTags.join(" "),
      hashtagChars: platformTags.join(" ").length
    };
  });
}

function buildDescription({ platform, productName, productDescription, salesDetails, benefits, categoryPreset, campaignPreset, tonePreset, cta, angle, variantIndex }) {
  const detail = productDescription
    ? `Keunggulan yang bisa kamu highlight: ${sentenceCase(productDescription)}.`
    : `${tonePreset.opener} Produk ini cocok diposisikan sebagai ${categoryPreset.angle}.`;
  const sellingLine = buildSellingLine(salesDetails);

  const benefitLine = benefits.length
    ? `Poin utama: ${rotate(benefits, variantIndex).slice(0, 3).join(", ")}.`
    : `Poin utama: praktis, menarik, dan relevan sebagai ${categoryPreset.angle}.`;

  const hook = buildHook(angle, productName, campaignPreset, categoryPreset);

  if (platform === "tiktok") {
    return `${hook}\n\n${detail}\n${benefitLine}${sellingLine}\n\n${campaignPreset.prompt} ${cta}`;
  }

  if (platform === "shopee") {
    return `${productName}\n\n${detail}\n${benefitLine}${sellingLine}\n\nKategori: ${categoryPreset.label}. Cocok untuk pembeli yang ingin informasi jelas sebelum checkout. ${cta}`;
  }

  if (platform === "facebook") {
    return `Kenalan dengan ${productName}.\n\n${hook}\n${detail}\n${benefitLine}${sellingLine}\n\nKalau kamu sedang cari produk dengan gaya ${tonePreset.style}, ini layak masuk list. ${cta}`;
  }

  return `${productName} bisa dibahas secara natural lewat angle ${categoryPreset.angle}.\n\n${hook}\n${detail}\n${benefitLine}${sellingLine}\n\n${cta}`;
}

function buildSellingLine(details = {}) {
  const parts = [
    details.price ? `Harga: ${details.price}` : "",
    details.promo ? `Promo: ${details.promo}` : "",
    details.targetAudience ? `Target: ${details.targetAudience}` : "",
    details.variant ? `Varian/bahan: ${details.variant}` : "",
    details.link ? `Link: ${details.link}` : ""
  ].filter(Boolean);

  return parts.length ? `\nInfo jualan: ${parts.join(" | ")}.` : "";
}

function buildSalesDetailText(details = {}) {
  return Object.values(details).filter(Boolean).join(" ");
}

function buildHook(angle, productName, campaignPreset, categoryPreset) {
  const hooks = {
    "benefit-first": `${productName} menonjol karena manfaatnya mudah dijelaskan ke calon pembeli.`,
    "problem-solution": `Punya kebutuhan seputar ${categoryPreset.angle}? ${productName} bisa jadi jawaban yang praktis.`,
    "social-proof": `${campaignPreset.hook} Cocok juga untuk konten rekomendasi yang terasa dekat.`,
    "quick-review": `Review singkat: ${productName} menarik karena informasinya gampang dibuat jadi caption jualan.`,
    "daily-use": `Untuk kebutuhan harian, ${productName} bisa diposisikan sebagai pilihan yang simpel dan berguna.`
  };

  return hooks[angle] ?? campaignPreset.hook;
}

function buildVariationTitle(angle, campaignLabel) {
  const labels = {
    "benefit-first": "Benefit utama",
    "problem-solution": "Problem-solution",
    "social-proof": "Rasa viral",
    "quick-review": "Review cepat",
    "daily-use": "Pemakaian harian"
  };

  return `${labels[angle] ?? "Variasi"} - ${campaignLabel}`;
}

function buildHashtags({ productName, keywords, categoryPreset, campaignPreset, count, variantIndex }) {
  const productTag = hashtagify(productName);
  const baseTags = [
    productTag,
    ...rotate(campaignPreset.tags, variantIndex),
    ...rotate(categoryPreset.tags, variantIndex),
    "BelanjaOnline",
    "ProdukPilihan",
    "TikTokShop",
    "ShopeeFinds",
    "ReviewProduk",
    "PromoOnline",
    "ProdukTerlaris"
  ];

  const keywordTags = rotate(keywords, variantIndex).map(hashtagify).filter(Boolean);
  return unique([...baseTags, ...keywordTags])
    .slice(0, count)
    .map((tag) => `#${tag}`);
}

function limitHashtagChars(tags, maxChars) {
  const selected = [];

  for (const tag of tags) {
    const candidate = [...selected, tag].join(" ");
    if (candidate.length <= maxChars) {
      selected.push(tag);
    }
  }

  return selected.length ? selected : tags.slice(0, 1);
}

function extractBenefits(text) {
  if (!text) return [];

  return text
    .split(/[,.;\n]+/)
    .map((item) => normalizeText(item))
    .filter((item) => item.length > 2)
    .slice(0, 5);
}

function extractKeywords(text) {
  const stopWords = new Set([
    "dan",
    "yang",
    "untuk",
    "dengan",
    "bisa",
    "cocok",
    "produk",
    "pagi",
    "malam",
    "atau",
    "ini",
    "itu",
    "the",
    "for"
  ]);

  return unique(
    normalizeText(text)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
  ).slice(0, 10);
}

function renderResults(run) {
  results.classList.remove("empty-state");
  results.innerHTML = run.variants.map(renderVariant).join("");

  results.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const variantIndex = Number(button.dataset.variant);
      const platformIndex = Number(button.dataset.copy);
      const item = run.variants[variantIndex].platforms[platformIndex];
      await copyText(formatSingleOutput(item));
      button.textContent = "Tersalin";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 1400);
    });
  });
}

function renderVariant(variant, variantIndex) {
  return `
    <section class="variant-group">
      <div class="variant-title">
        <h3>Variasi ${variant.id}</h3>
        <span>${escapeHtml(variant.title)}</span>
      </div>
      <div class="platform-list">
        ${variant.platforms.map((item, platformIndex) => renderPlatformCard(item, variantIndex, platformIndex)).join("")}
      </div>
    </section>
  `;
}

function renderPlatformCard(item, variantIndex, platformIndex) {
  const shopeeMetric = item.maxHashtagChars
    ? `<div class="metric ${item.hashtagChars > item.maxHashtagChars ? "warning" : ""}">Hashtag: ${item.hashtagChars}/${item.maxHashtagChars} karakter</div>`
    : `<div class="metric">Hashtag: ${item.hashtagChars} karakter</div>`;

  return `
    <article class="platform-card">
      <div class="platform-top">
        <div class="platform-name">
          <span class="badge ${item.id}">${item.initials}</span>
          <div>
            <h3>${escapeHtml(item.label)}</h3>
            <span class="hint">${escapeHtml(item.hint)}</span>
          </div>
        </div>
        <button class="copy-button" type="button" data-variant="${variantIndex}" data-copy="${platformIndex}">Copy</button>
      </div>
      <div class="platform-body">
        <div class="copy-block">
          <strong>Deskripsi</strong>
          <div class="copy-text">${escapeHtml(item.description)}</div>
        </div>
        <div class="copy-block">
          <strong>Hashtag</strong>
          <div class="hashtag-text">${escapeHtml(item.hashtags)}</div>
          ${shopeeMetric}
        </div>
      </div>
    </article>
  `;
}

function saveRunToHistory(run) {
  history = [
    {
      ...run,
      variants: run.variants.slice(0, 2)
    },
    ...history.filter((item) => item.productName !== run.productName || item.createdAt !== run.createdAt)
  ].slice(0, 8);

  localStorage.setItem(historyKey, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (!history.length) {
    historyList.innerHTML = "<p>Belum ada riwayat.</p>";
    return;
  }

  historyList.innerHTML = history.map((item, index) => `
    <button class="history-item" type="button" data-history="${index}">
      <strong>${escapeHtml(item.productName)}</strong>
      <span>${escapeHtml(formatDate(item.createdAt))} - ${escapeHtml(categoryPresets[item.category]?.label ?? "Umum")}</span>
    </button>
  `).join("");

  historyList.querySelectorAll("[data-history]").forEach((button) => {
    button.addEventListener("click", () => {
      latestRun = history[Number(button.dataset.history)];
      renderResults(latestRun);
      setOutputActionsEnabled(true);
      statusText.textContent = `Riwayat "${latestRun.productName}" dimuat kembali.`;
    });
  });
}

function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(historyKey) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatSingleOutput(item) {
  return `${item.label}\n\nDeskripsi:\n${item.description}\n\nHashtag:\n${item.hashtags}`;
}

function formatRunOutput(run) {
  return run.variants
    .map((variant) => `Variasi ${variant.id} - ${variant.title}\n\n${variant.platforms.map(formatSingleOutput).join("\n\n--------------------\n\n")}`)
    .join("\n\n====================\n\n");
}

function formatRunCsv(run) {
  const rows = [["Produk", "Variasi", "Platform", "Deskripsi", "Hashtag", "Jumlah Karakter Hashtag", "Sumber"]];

  run.variants.forEach((variant) => {
    variant.platforms.forEach((platform) => {
      rows.push([
        run.productName,
        `Variasi ${variant.id} - ${variant.title}`,
        platform.label,
        platform.description,
        platform.hashtags,
        String(platform.hashtagChars),
        run.source ?? "local"
      ]);
    });
  });

  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function collectSalesDetails() {
  return {
    price: normalizeText(productPriceInput.value),
    promo: normalizeText(productPromoInput.value),
    targetAudience: normalizeText(targetAudienceInput.value),
    variant: normalizeText(productVariantInput.value),
    strength: normalizeText(productStrengthInput.value),
    link: normalizeText(productLinkInput.value)
  };
}

function setOutputActionsEnabled(enabled) {
  copyAllButton.disabled = !enabled;
  exportTxtButton.disabled = !enabled;
  exportCsvButton.disabled = !enabled;
}

function hydrateSettings() {
  aiProviderInput.value = settings.aiProvider ?? "local";
  geminiModelInput.value = settings.geminiModel ?? "gemini-2.0-flash";
  rememberApiKeyInput.checked = Boolean(settings.rememberApiKey);
  if (settings.rememberApiKey && settings.geminiApiKey) {
    geminiApiKeyInput.value = settings.geminiApiKey;
  }
}

function saveSettings() {
  settings = {
    aiProvider: aiProviderInput.value,
    geminiModel: normalizeText(geminiModelInput.value) || "gemini-2.0-flash",
    rememberApiKey: rememberApiKeyInput.checked,
    geminiApiKey: rememberApiKeyInput.checked ? normalizeText(geminiApiKeyInput.value) : ""
  };
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(settingsKey) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function updateProviderUi() {
  const useGemini = aiProviderInput.value === "gemini";
  geminiApiKeyInput.disabled = !useGemini;
  geminiModelInput.disabled = !useGemini;
  rememberApiKeyInput.disabled = !useGemini;
  saveSettings();
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function rotate(items, amount) {
  if (!items.length) return items;
  const index = amount % items.length;
  return [...items.slice(index), ...items.slice(0, index)];
}

function hashtagify(value) {
  return normalizeText(value)
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function sentenceCase(value) {
  const text = normalizeText(value);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product-copy";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
