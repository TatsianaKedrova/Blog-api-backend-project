import { Resolutions, TVideo } from "../dto/data.types";

export const videos: TVideo[] = [
  {
    id: 2,
    title: "Lions", // required, maxLength = 40
    author: "Mark Gregor", //required, maxLength = 20
    availableResolutions: [Resolutions.P240, Resolutions.P360],
    canBeDownloaded: true, //by default = false
    minAgeRestriction: 12, //max=18, min=1
    publicationDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 12,
    title: "Lions", // required, maxLength = 40
    author: "Mark Gregor", //required, maxLength = 20
    availableResolutions: [Resolutions.P240, Resolutions.P360],
    canBeDownloaded: true, //by default = false
    minAgeRestriction: 12, //max=18, min=1
    publicationDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },{
    id: 22,
    title: "Lions", // required, maxLength = 40
    author: "Mark Gregor", //required, maxLength = 20
    availableResolutions: [Resolutions.P240, Resolutions.P360],
    canBeDownloaded: true, //by default = false
    minAgeRestriction: 12, //max=18, min=1
    publicationDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },{
    id: 32,
    title: "Lions", // required, maxLength = 40
    author: "Mark Gregor", //required, maxLength = 20
    availableResolutions: [Resolutions.P240, Resolutions.P360],
    canBeDownloaded: true, //by default = false
    minAgeRestriction: 12, //max=18, min=1
    publicationDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },{
    id: 42,
    title: "Lions", // required, maxLength = 40
    author: "Mark Gregor", //required, maxLength = 20
    availableResolutions: [Resolutions.P240, Resolutions.P360],
    canBeDownloaded: true, //by default = false
    minAgeRestriction: 12, //max=18, min=1
    publicationDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];
