
const api_key = 'AIzaSyATeS6iVDMlemxXwMOUHrwvvGPGaWJEn_E';
const base_url = 'https://www.googleapis.com/youtube/v3';

console.log(base_url);

async function getChannelIdByUsername(username) {
  const url = `${base_url}/search?part=snippet&type=channel&q=${username}&key=${api_key}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items[0].id.channelId;
}

export async function fetchChannelDetails(channelId) {
  const url = `${base_url}/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${api_key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const channel = data.items[0];

    return {
      id: channel.id,
      title: channel.snippet.title,
      // description: channel.snippet.description,
      country: channel.snippet.country || "Not specified",
      publishedAt: channel.snippet.publishedAt,
      subscribers: channel.statistics.subscriberCount,
      totalViews: channel.statistics.viewCount,
      totalVideos: channel.statistics.videoCount,
      bannerImage: channel.brandingSettings.image?.bannerExternalUrl || null,
      keywords: channel.brandingSettings.channel?.keywords || "N/A"
    };
  } catch (error) {
    console.error("Error fetching channel details:", error);
    throw error;
  }
}
