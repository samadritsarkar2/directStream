import ytdl from "ytdl-core";

const getDateTime = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  return dateTime;
};

export const directStream = async (req, res) => {
  if (!req.query.videoId) {
    res.status(500).send({ err: "param videoId required" });
    return;
  }

  const { videoId } = req.query;

  const stream = ytdl(videoId, {
    filter: "audioonly",
    quality: "highestaudio",
  });

  stream.on("info", (info, format) => {
    res.setHeader("Content-Type", "audio/webm");
    // console.log(info);
    console.log(
      "Title & videoId:- ",
      info.videoDetails.title +
        " " +
        info.videoDetails.videoId +
        " | " +
        getDateTime()
    );

    // console.log("format:- ", format);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Length", format.contentLength);
    // Content-Disposition is to make the browser download the file automatically
    // res.setHeader('Content-Disposition', `attachment; filename="video-${info.player_response.videoDetails.videoId}.${format.container}"`);
    // console.log(info.player_response.videoDetails.videoId);
    stream.pipe(res);
  });

  stream.on("error", (error) => {
    console.error("Error message: ", error.message + " | " + getDateTime());
    res.status(500).send({ err: error.message });
    return;
  });
};

export const checkHealth = async (req, res) => {
  if (req.query.videoId) {
    const videoId = req.query.videoId;
    const metaData = await ytdl.getBasicInfo(videoId);
   


    if (metaData.videoDetails.videoId === videoId) {
      res.status(200).json({
        "success" : true,
        msg: "Working",
        data: metaData.videoDetails.title ,
        currentTime: getDateTime(),
      });
      return;
    } else {
      res
        .status(500)
        .send({
          "success" : false,
          msg: "Response videoId not same as request",
          data: metaData.videoDetails.title,
          currentTime: getDateTime(),
        });
      return;
    }
  }

  res.status(200).json({
    msg: "API working fine! Send videoId as query to check youtube blocked or not",
    data: {},
    currentTime: new Date(),
  });

  return;
};
