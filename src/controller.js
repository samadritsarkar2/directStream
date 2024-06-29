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
    console.log(
      "Title & videoId:- ",
      info.videoDetails.title +
        " " +
        info.videoDetails.videoId +
        " | " +
        getDateTime()
    );
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
    stream.destroy();
  });

  stream.on("end", () => {
    console.log("Stream end event:--", getDateTime());
    stream.destroy();
  });
};

export const checkHealth = async (req, res) => {
  const results = getIPV6Address();
  console.log(results);
  res.status(200).json({
    msg: "API working fine!",
    data: {},
    currentTime: new Date(),
  });
};

export const checkHealthV2 = async (req, res) => {
  try {
    let isSuccess = false;
    let videoInfo = null;

    const { videoId } = req.query;
    if (!videoId) {
      return res.status(500).send({ err: "videoId query param required" });
    }
    const stream = ytdl(videoId, {
      filter: "audioonly",
      quality: "highestaudio",
    });

    stream.on("info", (info, format) => {
      videoInfo = info;
      if (info.videoDetails.videoId !== videoId) {
        console.error("Blocked Error??", info);
        stream.emit("end");
      } else {
        isSuccess = true;
        stream.emit("end");
      }
    });

    stream.on("error", (error) => {
      console.error("Error message: ", error.message + " | " + getDateTime());
      stream.destroy();
      res.status(400).send({ err: error.message });
    });

    stream.on("end", () => {
      if (isSuccess) {
        res.status(200).json({
          success: true,
          msg: "Working",
          data: videoInfo.videoDetails.title,
          currentTime: getDateTime(),
        });
      } else {
        res.status(500).send({
          success: false,
          msg: "Response videoId not same as request",
          data: videoInfo.videoDetails,
          currentTime: getDateTime(),
        });
      }
      stream.destroy();
      console.log("Health API v2 ends", getDateTime());
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      msg: "Something went wrong",
      data: error.message,
      currentTime: getDateTime(),
    });
  }
};
