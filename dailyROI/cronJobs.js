const cron = require("node-cron");
const { calculateDailyROI } = require("../utils/calculations");

// Run ROI Calculation every day at midnight (UTC time)
cron.schedule("0 0 * * *", async () => {
    console.log(`[${new Date().toISOString()}] Running Daily ROI Calculation...`);
    
    try {
        await calculateDailyROI();
        console.log("ROI Calculation Completed Successfully.");
    } catch (error) {
        console.error("Error running ROI Calculation:", error);
    }
}, {
    scheduled: true,
    timezone: "UTC" // Ensure correct timezone
});
