"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videos = void 0;
let db = {
    videos: [
        {
            id: 2,
            title: "Lions",
            author: "Mark Gregor",
            availableResolutions: ["P144", "P2160"],
            canBeDownloaded: true,
            minAgeRestriction: 12,
            publicationDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        },
        {
            id: 12,
            title: "Lions",
            author: "Mark Gregor",
            availableResolutions: ["P1440"],
            canBeDownloaded: true,
            minAgeRestriction: 12,
            publicationDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        },
    ],
};
exports.videos = db.videos;
//# sourceMappingURL=videos-db.js.map