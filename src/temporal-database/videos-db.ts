import { TResolutions, TDataBase, TVideo } from "../dto/data.types";

let db: TDataBase = {
  videos: [
    {
      id: 2,
      title: "Lions", // required, maxLength = 40
      author: "Mark Gregor", //required, maxLength = 20
      availableResolutions: ["P144", "P2160"],
      canBeDownloaded: true, //by default = false
      minAgeRestriction: 12, //max=18, min=1
      publicationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 12,
      title: "Lions", // required, maxLength = 40
      author: "Mark Gregor", //required, maxLength = 20
      availableResolutions: ["P1440"],
      canBeDownloaded: true, //by default = false
      minAgeRestriction: 12, //max=18, min=1
      publicationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ],
};

export let videos = db.videos;
