const express = require("express");
const router = express.Router();
const URL = require("../models/URL");
const axios = require("axios");

const CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const ROOT_DOMAIN = process.env.ROOT_DOMAIN;

// Generate a random shortcode
const generateShortCode = () => Math.random().toString(36).substring(2, 8);

// Create DNS record in Cloudflare
const createDNSRecord = async (shortCode) => {
    const subdomain = `${shortCode}.${ROOT_DOMAIN}`;
    const CNAME_TARGET = process.env.CNAME_TARGET; // Read from .env
    if (!CNAME_TARGET) {
        console.error("CNAME_TARGET is not set in the environment variables.");
        return null;
    }

    try {
        const response = await axios.post(
            `${CLOUDFLARE_API_BASE}/zones/${CLOUDFLARE_ZONE_ID}/dns_records`,
            {
                type: "CNAME",
                name: subdomain,
                content: CNAME_TARGET, // Use environment variable
                ttl: 1,
                proxied: true,
            },
            {
                headers: {
                    Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.success ? subdomain : null;
    } catch (error) {
        console.error("Error creating DNS record:", error.response.data);
        return null;
    }
};

// Render homepage
router.get("/", (req, res) => {
    res.render("index", { message: null });
});

// Handle URL shortening
router.post("/shorten", async (req, res) => {
    const { originalURL } = req.body;
    try {
        const shortCode = generateShortCode();
        const subdomain = await createDNSRecord(shortCode);
        if (!subdomain) throw new Error("Failed to create DNS record.");

        const newURL = await URL.create({ originalURL, shortCode });

        res.render("index", { message: `Short URL: https://${subdomain}` });
    } catch (error) {
        res.render("index", { message: "An error occurred. Please try again." });
    }
});

// Redirect to original URL
router.get("/:shortCode", async (req, res) => {
    try {
        const { shortCode } = req.params;
        const urlEntry = await URL.findOne({ where: { shortCode } });
        if (urlEntry) {
            res.redirect(urlEntry.originalURL);
        } else {
            res.render("error", { message: "Short URL not found." });
        }
    } catch (error) {
        res.render("error", { message: "An error occurred. Please try again." });
    }
});

module.exports = router;
