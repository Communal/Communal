// scripts/populateProducts.js
import mongoose from "mongoose";
import Product from "./../db/schema/Product.js"; // adjust path if needed

const MONGO_URI = process.env.MONGO_URI || "";

async function run() {
  await mongoose.connect(MONGO_URI);

//   const products = [
//   // === Group 1: Twitter Names (randomly distributed) ===
//   {
//     name: "USA Twitter Growth Package",
//     price: 45,
//     info: "Boost your Twitter followers organically from the USA audience.",
//     category: "689b60b948235ec884d3a96d",
//     data: "twitter_growth_usa.json",
//     isSold: false
//   },
//   {
//     name: "UK Twitter Engagement Boost",
//     price: 40,
//     info: "Get targeted UK-based Twitter likes, retweets, and comments.",
//     category: "689b60b948235ec884d3a96d",
//     data: "twitter_engagement_uk.json",
//     isSold: false
//   },
//   {
//     name: "Crypto Twitter Targeted List",
//     price: 70,
//     info: "Exclusive Twitter accounts in the crypto niche for marketing.",
//     category: "689b60b948235ec884d3a96d",
//     data: "crypto_twitter_list.csv",
//     isSold: false
//   },
//   {
//     name: "Twitter Sports Fans Audience",
//     price: 55,
//     info: "Target sports enthusiasts on Twitter for campaigns.",
//     category: "689b60b948235ec884d3a96c",
//     data: "twitter_sports_audience.json",
//     isSold: false
//   },
//   {
//     name: "USA Twitter Political Niche",
//     price: 65,
//     info: "Curated Twitter profiles with interest in USA politics.",
//     category: "689b60b948235ec884d3a96c",
//     data: "twitter_politics_usa.json",
//     isSold: false
//   },
//   {
//     name: "Nigeria Twitter Influencers List",
//     price: 50,
//     info: "List of top Nigerian influencers on Twitter.",
//     category: "689b60b948235ec884d3a96c",
//     data: "nigeria_twitter_influencers.json",
//     isSold: false
//   },
//   {
//     name: "Asian Twitter Business Accounts",
//     price: 60,
//     info: "Database of Asian-based Twitter business accounts.",
//     category: "689b60b948235ec884d3a96b",
//     data: "asian_twitter_business.csv",
//     isSold: false
//   },
//   {
//     name: "Twitter Memes Niche Accounts",
//     price: 35,
//     info: "Accounts focused on viral memes on Twitter.",
//     category: "689b60b948235ec884d3a96b",
//     data: "twitter_memes.json",
//     isSold: false
//   },
//   {
//     name: "Global Twitter Verified Accounts",
//     price: 90,
//     info: "List of verified Twitter accounts for networking.",
//     category: "689b60b948235ec884d3a96b",
//     data: "verified_twitter_accounts.csv",
//     isSold: false
//   },
//   {
//     name: "USA Twitter Tech Startups",
//     price: 55,
//     info: "Twitter accounts of USA-based tech startup founders.",
//     category: "689b60b948235ec884d3a96a",
//     data: "twitter_tech_startups_usa.json",
//     isSold: false
//   },

//   // === Group 2: Facebook Names ===
//   {
//     name: "Male USA Facebook Dating (location)",
//     price: 40,
//     info: "Male profiles from USA Facebook dating niche.",
//     category: "689b5f35830581f7b7488505",
//     data: "male_usa_fb_dating.json",
//     isSold: false
//   },
//   {
//     name: "Female USA Facebook Dating (location)",
//     price: 42,
//     info: "Female profiles from USA Facebook dating niche.",
//     category: "689b5f35830581f7b7488505",
//     data: "female_usa_fb_dating.json",
//     isSold: false
//   },
//   {
//     name: "Random Facebook mostly Asian",
//     price: 38,
//     info: "Random Asian profiles from Facebook.",
//     category: "689b5f35830581f7b7488506",
//     data: "random_asian_fb.json",
//     isSold: false
//   },
//   {
//     name: "Normal USA Facebook Non Dating",
//     price: 36,
//     info: "Standard USA Facebook accounts, non-dating.",
//     category: "689b5f35830581f7b7488506",
//     data: "normal_usa_fb.json",
//     isSold: false
//   },
//   {
//     name: "Code 6 USA Facebook Non Dating",
//     price: 34,
//     info: "Special category USA Facebook non-dating profiles.",
//     category: "689b5f35830581f7b7488507",
//     data: "code6_usa_fb.json",
//     isSold: false
//   },
//   {
//     name: "Code 7 USA Facebook Non Dating",
//     price: 34,
//     info: "Special category 7 USA Facebook non-dating profiles.",
//     category: "689b5f35830581f7b7488507",
//     data: "code7_usa_fb.json",
//     isSold: false
//   },
//   {
//     name: "Code 8 USA Facebook Non Dating",
//     price: 34,
//     info: "Special category 8 USA Facebook non-dating profiles.",
//     category: "689b5f35830581f7b7488508",
//     data: "code8_usa_fb.json",
//     isSold: false
//   },
//   {
//     name: "Europe Facebook",
//     price: 37,
//     info: "European-based Facebook accounts.",
//     category: "689b5f35830581f7b7488509",
//     data: "europe_fb.json",
//     isSold: false
//   },
//   {
//     name: "Old Nigeria Facebook",
//     price: 30,
//     info: "Older Nigerian Facebook profiles.",
//     category: "689b5f35830581f7b748850a",
//     data: "old_nigeria_fb.json",
//     isSold: false
//   },
//   {
//     name: "Young Nigeria Facebook",
//     price: 32,
//     info: "Younger Nigerian Facebook profiles.",
//     category: "689b5f35830581f7b748850b",
//     data: "young_nigeria_fb.json",
//     isSold: false
//   },

//   // === Group 3: Instagram (Facebook → Instagram) ===
//   {
//     name: "Male USA Instagram Dating (location)",
//     price: 40,
//     info: "Male profiles from USA Instagram dating niche.",
//     category: "689b5f465e058d5c95ddc7c1",
//     data: "male_usa_ig_dating.json",
//     isSold: false
//   },
//   {
//     name: "Female USA Instagram Dating (location)",
//     price: 42,
//     info: "Female profiles from USA Instagram dating niche.",
//     category: "689b5f465e058d5c95ddc7c2",
//     data: "female_usa_ig_dating.json",
//     isSold: false
//   },
//   {
//     name: "Random Instagram mostly Asian",
//     price: 38,
//     info: "Random Asian profiles from Instagram.",
//     category: "689b5f465e058d5c95ddc7c2",
//     data: "random_asian_ig.json",
//     isSold: false
//   },
//   {
//     name: "Normal USA Instagram Non Dating",
//     price: 36,
//     info: "Standard USA Instagram accounts, non-dating.",
//     category: "689b5f465e058d5c95ddc7c3",
//     data: "normal_usa_ig.json",
//     isSold: false
//   },
//   {
//     name: "Code 6 USA Instagram Non Dating",
//     price: 34,
//     info: "Special category USA Instagram non-dating profiles.",
//     category: "689b5f465e058d5c95ddc7c4",
//     data: "code6_usa_ig.json",
//     isSold: false
//   },
//   {
//     name: "Code 7 USA Instagram Non Dating",
//     price: 34,
//     info: "Special category 7 USA Instagram non-dating profiles.",
//     category: "689b5f465e058d5c95ddc7c5",
//     data: "code7_usa_ig.json",
//     isSold: false
//   },
//   {
//     name: "Code 8 USA Instagram Non Dating",
//     price: 34,
//     info: "Special category 8 USA Instagram non-dating profiles.",
//     category: "689b5f465e058d5c95ddc7c6",
//     data: "code8_usa_ig.json",
//     isSold: false
//   },
//   {
//     name: "Europe Instagram",
//     price: 37,
//     info: "European-based Instagram accounts.",
//     category: "689b5f465e058d5c95ddc7c6",
//     data: "europe_ig.json",
//     isSold: false
//   },
//   {
//     name: "Old Nigeria Instagram",
//     price: 30,
//     info: "Older Nigerian Instagram profiles.",
//     category: "689b5f465e058d5c95ddc7c8",
//     data: "old_nigeria_ig.json",
//     isSold: false
//   },
//   {
//     name: "Young Nigeria Instagram",
//     price: 32,
//     info: "Younger Nigerian Instagram profiles.",
//     category: "689b5f465e058d5c95ddc7c9",
//     data: "young_nigeria_ig.json",
//     isSold: false
//   }
// ];

const products = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Test Product 1",
        price: 19.99,
        category: "689bb8939d07473879ec95c8", // Use real category ID
        info: "Test product description"
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Test Product 2",
        price: 29.99,
        category: "689bb8939d07473879ec95c8", // Use real category ID
        info: "Test product description"
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Test Product 2",
        price: 29.99,
        category: "689bb8939d07473879ec95c9", // Use real category ID
        info: "Test product description"
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Test Product 2",
        price: 29.99,
        category: "689bb8939d07473879ec95c9", // Use real category ID
        info: "Test product description"
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Test Product 2",
        price: 29.99,
        category: "689bb868ee42eb390730378b", // Use real category ID
        info: "Test product description"
      }
    ];

  await Product.insertMany(products);
  console.log("Products populated (category left null).");
  mongoose.connection.close();
}

run().catch((err) => console.error(err));