// How many days a donor rests after giving blood before they can donate again.
// (4 months. Change to 90 for 3 months. Keep it the same in backend/server.js)
export const REST_DAYS = 120;

function parseDay(iso) {
  return new Date(`${iso}T00:00:00`);
}

// Today's date as YYYY-MM-DD in local time
export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${d.getFullYear()}-${m}-${day}`;
}

// Is this donor still in the resting period after their last donation?
export function getRestInfo(lastDonationDate) {
  if (!lastDonationDate) {
    return { resting: false, until: null, daysLeft: 0 };
  }

  const until = parseDay(lastDonationDate);
  until.setDate(until.getDate() + REST_DAYS);

  const daysLeft = Math.ceil(
    (until - parseDay(todayISO())) / 86400000
  );

  return {
    resting: daysLeft > 0,
    until,
    daysLeft: Math.max(daysLeft, 0),
  };
}

// Badge shown on the profile, based on the number of donations
export function getBadge(donationCount) {
  const n = Number(donationCount) || 0;

  if (n >= 10) return { label: "Life Saver" };
  if (n >= 5) return { label: "Blood Hero" };
  if (n >= 3) return { label: "Regular Donor" };
  if (n >= 1) return { label: "Donor" };

  return { label: "New Donor" };
}