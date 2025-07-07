// export const api_key = 'AIzaSyATeS6iVDMlemxXwMOUHrwvvGPGaWJEn_E';
export const api_key = 'AIzaSyBltURIVOWgP5lVRIf8aDEWiyD4WlRwShM';
export const base_url = 'https://www.googleapis.com/youtube/v3';

export async function getChannelIdByUsername(username) {
  const url = `${base_url}/search?part=snippet&type=channel&q=${username}&key=${api_key}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items[0]?.id.channelId;
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

export async function getChannelVideoDetails(channelId) {
  const url = `${base_url}/search?key=${api_key}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const videoIds = data.items.map(item => item.id.videoId).join(',');
    console.log(videoIds)
    console.log('\n')

    const detailsUrl = `${base_url}/videos?part=snippet,statistics&id=${videoIds}&key=${api_key}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    const videos = detailsData.items;

    for (const video of videos) {
      console.log("🎬", video.snippet.title);
      console.log("👁️", video.statistics.viewCount, "views");
      console.log("👍", video.statistics.likeCount, "likes");
      console.log("---");
    }

  } catch (error) {
    console.error("Error fetching video details:", error);
    throw error;
  }
}
