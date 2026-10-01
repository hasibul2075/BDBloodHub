const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);
console.log(
  "Supabase URL:",
  process.env.SUPABASE_URL ? "Loaded" : "Missing"
);

console.log(
  "Supabase Publishable Key:",
  process.env.SUPABASE_PUBLISHABLE_KEY ? "Loaded" : "Missing"
);
// Home route
app.get("/", (req, res) => {
  res.json({
    message: "BDBloodHub Backend is running!",
  });
});



// ===============================
// CREATE DONOR
// ===============================
app.post("/api/donors", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userSupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await userSupabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired login session.",
      });
    }

    const {
      name,
      email,
      phone,
      blood_group,
      district,
      upazila,
      last_donation_date,
      available,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !blood_group ||
      !district ||
      !upazila
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required donor information.",
      });
    }

    const { data, error } = await userSupabase
      .from("donors")
      .insert([
        {
          name,
          email,
          phone,
          blood_group,
          district,
          upazila,
          last_donation_date:
            last_donation_date || null,
          available: available ?? true,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("DONOR INSERT ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to create donor.",
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Donor created successfully!",
      donor: data,
    });
  } catch (error) {
    console.error("DONOR SERVER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
});

// ===============================
// SEARCH DONORS
// ===============================
app.get("/api/donors/search", async (req, res) => {
  try {
    const { blood_group, district, upazila } = req.query;

    let query = supabase
      .from("donors")
      .select("*")
      .eq("available", true);

    if (blood_group) {
      query = query.eq("blood_group", blood_group);
    }

    if (district) {
      query = query.ilike("district", `%${district}%`);
    }

    if (upazila) {
      query = query.ilike("upazila", `%${upazila}%`);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to search donors.",
        error: error.message,
      });
    }

    res.json({
      success: true,
      count: data.length,
      donors: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`BDBloodHub server running on port ${PORT}`);
});