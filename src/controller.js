import ytdl from "ytdl-core";


export const directStream = async (req, res) => {
    const { videoId } = req.query;
  // console.log(videoId);
  
  
    const stream = ytdl(videoId, {
      filter: "audioonly",
      quality: "highestaudio",
    });
  
    stream.on("info", (info, format) => {
      res.setHeader("Content-Type", "audio/webm");
      console.log("Title & videoId:- ", info.videoDetails.title + " " + info.videoDetails.videoId);
  
  
      // console.log("format:- ", format);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Length", format.contentLength);
      // Content-Disposition is to make the browser download the file automatically
      // res.setHeader('Content-Disposition', `attachment; filename="video-${info.player_response.videoDetails.videoId}.${format.container}"`);
      // console.log(info.player_response.videoDetails.videoId);
      stream.pipe(res);
    });
  };
  