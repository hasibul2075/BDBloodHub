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
// Returns the logged-in user when the request carries a valid Supabase
// login token, otherwise null. Used to decide who may see donor phone numbers.
async function getLoggedInUser(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!token) return null;

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data || !data.user) return null;

    return data.user;
  } catch {
    return null;
  }
}

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
 

// Check if donor profile already exists
if (userError || !user) {
  return res.status(401).json({
    success: false,
    message: "Invalid or expired login session.",
  });
}
const {
  data: existingDonors,
  error: existingDonorError,
} = await userSupabase
  .from("donors")
  .select("id")
  .eq("user_id", user.id)
  .limit(1);

if (existingDonorError) {
  console.error(
    "EXISTING DONOR CHECK ERROR:",
    existingDonorError
  );

  return res.status(500).json({
    success: false,
    message: "Failed to check existing donor profile.",
  });
}

if (existingDonors && existingDonors.length > 0) {
  return res.status(409).json({
    success: false,
    message:
      "You already have a donor profile. Please update your profile instead.",
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
    { name,
      email,
      phone, 
      blood_group, 
      district, 
      upazila, 
      last_donation_date: last_donation_date || null, 
      available: available ?? true, 
      user_id: user.id, }, ])
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

    // Phone numbers are shown to logged-in users only (keeps donors safe from spam)
    const loggedInUser = await getLoggedInUser(req);

        // Donors rest after giving blood (change 120 to 90 for 3 months)
    const REST_DAYS = 120;

    const restCutoff = new Date(
      Date.now() - REST_DAYS * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 10);

    let query = supabase
      .from("donors")
      .select("id, name, blood_group, district, upazila, available, phone")
      .eq("available", true)
      .or(
        `last_donation_date.is.null,last_donation_date.lte.${restCutoff}`
      );

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

    // Remove the phone number before sending unless the visitor is logged in.
    // (Email, user_id and last donation date are never sent here.)
    const donors = data.map(({ phone, ...rest }) =>
      loggedInUser ? { ...rest, phone } : rest
    );

    res.json({
      success: true,
      count: donors.length,
      logged_in: Boolean(loggedInUser),
      donors,
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
// STATS
// ===============================


app.get("/api/stats", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("donors")
      .select("*", { count: "exact", head: true });

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to load stats",
        error: error.message,
      });
    }

    res.json({
      success: true,
      donors: count || 0,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
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