import { useState, useMemo, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// ========== API KEY (Vite) ==========
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const AI_PROVIDER = OPENAI_KEY ? "openai" : GEMINI_KEY ? "gemini" : null;

export default function AIHub({ products: productsProp = [] }) {
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      text: "Hello! Welcome to your AI shopping assistant.",
    },
  ]);
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("All");
  const [product1, setProduct1] = useState("");
  const [product2, setProduct2] = useState("");
  const [review, setReview] = useState("");
  const [reviewProduct, setReviewProduct] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Firebase products
  const [products, setProducts] = useState(productsProp);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (productsProp?.length > 0) {
      setProducts(productsProp);
      setProductsLoading(false);
      return;
    }

    async function loadProducts() {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        console.log("AIHub products loaded:", data.length, data);
        setProducts(data);
      } catch (err) {
        console.error("AIHub products error:", err);
        setError("Products load nahi ho sake. Firebase check karo.");
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, [productsProp]);

  // ---------- helpers ----------
  const getId = (p) => {
    const id = p?._id ?? p?.id;
    return id != null && id !== "" ? String(id) : null;
  };
  const getName = (p) => p?.name || p?.title || "Product";
  const getPrice = (p) => Number(p?.price ?? 0) || 0;
  const getCategory = (p) =>
    typeof p?.category === "object"
      ? p.category?.name || "Other"
      : p?.category || "Other";
  const getDescription = (p) => p?.description || "";
  const money = (p) => `Rs. ${getPrice(p).toLocaleString()}`;

  const safeProducts = useMemo(
    () => (Array.isArray(products) ? products.filter(Boolean) : []),
    [products]
  );

  const categories = useMemo(() => {
    const set = new Set(safeProducts.map(getCategory));
    return Array.from(set).sort();
  }, [safeProducts]);

  const first = useMemo(
    () => safeProducts.find((p) => getId(p) === product1),
    [safeProducts, product1]
  );
  const second = useMemo(
    () => safeProducts.find((p) => getId(p) === product2),
    [safeProducts, product2]
  );
  const selectedReview = useMemo(
    () => safeProducts.find((p) => getId(p) === reviewProduct),
    [safeProducts, reviewProduct]
  );

  const searchResults = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return safeProducts;
    return safeProducts.filter((p) =>
      `${getName(p)} ${getCategory(p)} ${getDescription(p)}`
        .toLowerCase()
        .includes(q)
    );
  }, [safeProducts, search]);

  const recommendations = useMemo(() => {
    const maxBudget = budget === "" ? Infinity : Number(budget);
    return safeProducts.filter(
      (p) =>
        getPrice(p) <= maxBudget &&
        (category === "All" || getCategory(p) === category)
    );
  }, [safeProducts, budget, category]);

  // ---------- Smart relevant products (speed boost) ----------
  function getRelevantProducts(query, max = 12) {
    if (!query || !safeProducts.length) return safeProducts.slice(0, max);

    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter((w) => w.length > 2);

    const scored = safeProducts.map((p) => {
      const text = `${getName(p)} ${getCategory(p)} ${getDescription(p)}`.toLowerCase();
      let score = 0;

      if (text.includes(q)) score += 15;
      words.forEach((word) => {
        if (text.includes(word)) score += 4;
      });

      // Category boost
      if (getCategory(p).toLowerCase().includes(q)) score += 8;

      return { p, score };
    });

    const relevant = scored
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, max)
      .map((x) => x.p);

    // Agar kuch relevant nahi mila to top products bhej do
    return relevant.length > 0 ? relevant : safeProducts.slice(0, max);
  }

  // ---------- AI call (optimized) ----------
  async function askAI(task, prompt, forcedProducts = null) {
    if (!AI_PROVIDER) {
      setError(
        "API key missing. .env me VITE_GEMINI_API_KEY daalo aur server restart karo."
      );
      return null;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      let productsToSend = forcedProducts;

      // Smart selection based on task
      if (!productsToSend) {
        if (task === "chat" || task === "search") {
          productsToSend = getRelevantProducts(prompt, 12);
        } else if (task === "recommendations") {
          productsToSend = recommendations.slice(0, 15);
        } else {
          productsToSend = safeProducts.slice(0, 15); // fallback
        }
      }

      const catalogText =
        productsToSend.length === 0
          ? "No products in catalog."
          : productsToSend
              .map(
                (p, i) =>
                  `${i + 1}. ID:${getId(p)} | ${getName(p)} | Rs.${getPrice(p)} | ${getCategory(p)} | ${getDescription(p).slice(0, 100)}`
              )
              .join("\n");

      const systemPrompt = `You are a helpful AI shopping assistant for an online store (prices in Rs.).
Use ONLY the product data below. Do not invent products or prices.
Be concise and useful. Reply in the same language the user uses.

PRODUCT CATALOG:
${catalogText}

Task type: ${task || "general"}`;

      let answer = "";

      if (AI_PROVIDER === "openai") {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt },
            ],
            temperature: 0.6,
            max_tokens: 700,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data?.error?.message || `OpenAI error (HTTP ${res.status})`
          );
        }
        answer = data.choices?.[0]?.message?.content?.trim();
      } else {
        // Gemini
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${systemPrompt}\n\nUser request:\n${prompt}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 700,
              },
            }),
          }
        );

        const data = await res.json();
        console.log("Gemini status:", res.status, data);

        if (!res.ok) {
          throw new Error(
            data?.error?.message || `Gemini error (HTTP ${res.status})`
          );
        }

        answer =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      }

      if (!answer) {
        throw new Error("AI returned empty response.");
      }

      return answer;
    } catch (err) {
      console.error(err);
      setError(err.message || "AI request failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // ---------- actions ----------
  async function sendMessage(e) {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const question = message.trim();
    setChatHistory((old) => [...old, { role: "user", text: question }]);
    setMessage("");

    const answer = await askAI("chat", question);
    if (answer) {
      setChatHistory((old) => [...old, { role: "assistant", text: answer }]);
    } else {
      setChatHistory((old) => [
        ...old,
        {
          role: "assistant",
          text: "Sorry, I couldn't get a response. Check API key / network.",
        },
      ]);
    }
  }

  async function getRecommendations() {
    const prompt = `Recommend suitable products using these preferences:
Maximum budget: ${budget || "No limit"}
Category: ${category}
Explain why they match. Use only the provided product data.`;
    const answer = await askAI("recommendations", prompt);
    if (answer) setResult(answer);
  }

  async function runSmartSearch() {
    if (!search.trim()) {
      setError("Enter a search query first.");
      return;
    }
    const answer = await askAI(
      "search",
      `Find products relevant to: "${search}". Understand intent and synonyms. Only recommend from the catalog and explain matches.`
    );
    if (answer) setResult(answer);
  }

  async function compareProducts() {
    if (!first || !second) {
      setError("Please select both products.");
      return;
    }
    if (product1 === product2) {
      setError("Select two different products.");
      return;
    }

    // Sirf 2 products bhejo → super fast
    const answer = await askAI(
      "comparison",
      `Compare these two products:

Product 1: ${JSON.stringify({
        name: getName(first),
        price: getPrice(first),
        category: getCategory(first),
        description: getDescription(first),
      })}

Product 2: ${JSON.stringify({
        name: getName(second),
        price: getPrice(second),
        category: getCategory(second),
        description: getDescription(second),
      })}

Compare price, features, differences, suitability. Do not invent info.`,
      [first, second] // forced products
    );
    if (answer) setResult(answer);
  }

  async function analyzeReview() {
    if (!selectedReview) {
      setError("Please select a product.");
      return;
    }

    const productReviews = Array.isArray(selectedReview.reviews)
      ? selectedReview.reviews
      : [];

    const reviewText =
      review.trim() ||
      productReviews
        .map((r) =>
          typeof r === "string"
            ? r
            : r?.comment || r?.review || r?.text || ""
        )
        .filter(Boolean)
        .join("\n");

    if (!reviewText) {
      setError("No reviews found. Enter a review to analyze.");
      return;
    }

    const answer = await askAI(
      "review",
      `Analyze these customer reviews for ${getName(selectedReview)}.
Identify overall sentiment, common positives, complaints, and a short summary.
Only use these reviews:

${reviewText}`,
      [selectedReview] // sirf selected product
    );
    if (answer) setResult(answer);
  }

  // ---------- UI ----------
  const tabs = [
    ["chat", "AI Chatbot"],
    ["recommend", "Recommendations"],
    ["search", "Smart Search"],
    ["compare", "Compare Products"],
    ["reviews", "Review Analyzer"],
  ];

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:border-violet-500";
  const buttonClass =
    "rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50";

  function ProductCards({ items }) {
    if (!items?.length) {
      return (
        <p className="mt-5 rounded-xl bg-gray-50 p-5 text-gray-500">
          No products found. Check your product data.
        </p>
      );
    }
    return (
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, index) => {
          const id = getId(p) ?? `item-${index}`;
          return (
            <article
              key={id}
              className="rounded-2xl border border-gray-200 p-5 transition hover:shadow-lg"
            >
              {(p.image || p.imageUrl) && (
                <img
                  src={p.image || p.imageUrl}
                  alt={getName(p)}
                  className="mb-4 h-40 w-full rounded-xl object-contain"
                />
              )}
              <p className="text-xs font-bold uppercase text-violet-600">
                {getCategory(p)}
              </p>
              <h3 className="mt-2 text-lg font-bold">{getName(p)}</h3>
              <p className="mt-2 text-sm text-gray-500">{getDescription(p)}</p>
              <p className="mt-4 font-bold text-violet-700">{money(p)}</p>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
            Smart Shopping
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            AI Shopping Assistant
          </h1>
          <p className="mt-4 text-gray-500">
            Discover products and shop smarter.
          </p>
        </header>

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <nav className="flex gap-2 overflow-x-auto border-b p-3">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
  setActiveTab(id);
  setResult("");
  setError("");
  setLoading(false);
}}
                className={`shrink-0 rounded-xl px-4 py-3 text-sm font-semibold ${
                  activeTab === id
                    ? "bg-violet-600 text-white"
                    : "text-gray-500 hover:bg-violet-50"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="p-5 sm:p-8">
            {!AI_PROVIDER && (
              <div className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                ⚠️ API key nahi mili. <code>.env</code> me{" "}
                <code>VITE_GEMINI_API_KEY</code> daalo aur{" "}
                <strong>dev server restart</strong> karo.
              </div>
            )}

            {productsLoading && (
              <p className="mb-5 rounded-xl bg-gray-50 p-4 text-gray-500">
                Loading products from store...
              </p>
            )}

            {!productsLoading && safeProducts.length > 0 && (
              <p className="mb-5 text-sm text-gray-500">
                {safeProducts.length} products loaded from Firebase
              </p>
            )}

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading && (
              <p className="mb-5 rounded-xl bg-violet-50 p-4 text-violet-700">
                AI is thinking...
              </p>
            )}

            {activeTab === "chat" && (
              <section>
                <h2 className="text-2xl font-bold">AI Chatbot</h2>
                <p className="mt-2 text-gray-500">
                  Ask questions about your store products.
                </p>
                <div className="mt-5 h-80 space-y-4 overflow-y-auto rounded-xl bg-gray-50 p-4">
                  {chatHistory.map((item, index) => (
                    <div
                      key={index}
                      className={`whitespace-pre-line rounded-xl p-4 ${
                        item.role === "user"
                          ? "ml-auto max-w-[90%] bg-violet-600 text-white"
                          : "mr-auto max-w-[90%] bg-white shadow-sm"
                      }`}
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={sendMessage}
                  className="mt-4 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className={inputClass}
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className={buttonClass}
                  >
                    Send
                  </button>
                </form>
              </section>
            )}

            {activeTab === "recommend" && (
              <section>
                <h2 className="text-2xl font-bold">Product Recommendations</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <input
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Maximum budget (Rs.)"
                    className={inputClass}
                  />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  >
                    <option value="All">All categories</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={getRecommendations}
                  className={`mt-4 ${buttonClass}`}
                >
                  Get AI Recommendations
                </button>
                <ProductCards items={recommendations} />
              </section>
            )}

            {activeTab === "search" && (
              <section>
                <h2 className="text-2xl font-bold">Smart Search</h2>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. affordable phone for photography"
                  className={`mt-5 ${inputClass}`}
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={runSmartSearch}
                    className={buttonClass}
                  >
                    Search with AI
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  {searchResults.length} direct text matches
                </p>
                <ProductCards items={searchResults} />
              </section>
            )}

            {activeTab === "compare" && (
              <section>
                <h2 className="text-2xl font-bold">Compare Products</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <select
                    value={product1}
                    onChange={(e) => setProduct1(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select first product</option>
                    {safeProducts.map((p, i) => {
                      const id = getId(p);
                      if (!id) return null;
                      return (
                        <option key={id || i} value={id}>
                          {getName(p)}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    value={product2}
                    onChange={(e) => setProduct2(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select second product</option>
                    {safeProducts.map((p, i) => {
                      const id = getId(p);
                      if (!id) return null;
                      return (
                        <option key={id || i} value={id}>
                          {getName(p)}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {first && second && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[first, second].map((p) => (
                      <article
                        key={getId(p)}
                        className="rounded-xl border p-5"
                      >
                        <h3 className="font-bold">{getName(p)}</h3>
                        <p className="mt-2 text-violet-700">{money(p)}</p>
                        <p className="mt-2 text-sm text-gray-500">
                          {getDescription(p)}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  disabled={loading}
                  onClick={compareProducts}
                  className={`mt-5 ${buttonClass}`}
                >
                  Compare with AI
                </button>
              </section>
            )}

            {activeTab === "reviews" && (
              <section>
                <h2 className="text-2xl font-bold">Review Analyzer</h2>
                <select
                  value={reviewProduct}
                  onChange={(e) => setReviewProduct(e.target.value)}
                  className={`mt-5 ${inputClass}`}
                >
                  <option value="">Select product</option>
                  {safeProducts.map((p, i) => {
                    const id = getId(p);
                    if (!id) return null;
                    return (
                      <option key={id || i} value={id}>
                        {getName(p)}
                      </option>
                    );
                  })}
                </select>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Or paste customer reviews here..."
                  rows={5}
                  className={`mt-4 ${inputClass}`}
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={analyzeReview}
                  className={`mt-4 ${buttonClass}`}
                >
                  Analyze with AI
                </button>
              </section>
            )}

            {result && (
              <section className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-5">
                <h3 className="mb-3 font-bold text-violet-800">AI Result</h3>
                <p className="whitespace-pre-line leading-7 text-gray-700">
                  {result}
                </p>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}