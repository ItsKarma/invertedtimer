import { kv } from "@vercel/kv";

// get all of the keys and values in the KV namespace
export default async function handler(req, res) {
  try {
    const keys = await kv.keys("*");
    // keys is an array of strings
    // loop over the keys array and get the value for each key
    const values = await Promise.all(
      keys.map(async (key) => {
        return { [key]: await kv.get(key) };
      })
    );
    // add up the values of all the keys together and add a new object to the values array called totalRounds
    const totalRounds = values.reduce((acc, obj) => {
      const key = Object.keys(obj)[0];
      return acc + parseInt(obj[key]);
    }, 0);
    values.push({ totalRounds });
    res.status(200).json({ values });
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: "Failed to fetch keys" });
  }
}
