// AI News Recommendations Controller
// Uses NewsAPI.org to fetch latest education/academic news
// This file is isolated — delete it to remove the AI feature

const https = require("https");

const NEWS_API_KEY = "2f6e770dd61c4679bfac6f12b237236c";
const NEWS_API_URL = "https://newsapi.org/v2/everything";

const fetchFromNewsAPI = (query) => {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams({
            q: query,
            language: "en",
            sortBy: "publishedAt",
            pageSize: "10",
            apiKey: NEWS_API_KEY,
        });

        const url = new URL(`${NEWS_API_URL}?${params.toString()}`);

        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            headers: {
                "User-Agent": "AcademicResourceSharingSystem/1.0",
            },
        };

        https.get(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (err) {
                    reject(err);
                }
            });
        }).on("error", reject);
    });
};

exports.getNewsRecommendations = async (req, res) => {
    try {
        const query = req.query.q || "education university academic";
        const result = await fetchFromNewsAPI(query);

        if (result.status !== "ok") {
            return res.status(400).json({ error: result.message || "Failed to fetch news" });
        }

        const articles = (result.articles || [])
            .filter((a) => a.title && a.title !== "[Removed]")
            .map((a) => ({
                title: a.title,
                description: a.description,
                source: a.url,
                sourceName: a.source?.name || "",
                publishedAt: a.publishedAt,
                imageUrl: a.urlToImage,
            }));

        res.json({ articles });
    } catch (err) {
        console.error("AI News fetch error:", err);
        res.status(500).json({ error: "Failed to fetch news recommendations" });
    }
};
