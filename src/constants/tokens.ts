export const TYPES = {
  EmailManager: Symbol.for("EmailManager"),
  RefreshTokenValidityMiddleware: Symbol.for("RefreshTokenValidityMiddleware"),
  RateLimiterMiddleware: Symbol.for("RateLimiterMiddleware"),
  ForbiddenResponseMiddleware: Symbol.for("ForbiddenResponseMiddleware"),
  UserModel: Symbol.for("UserModel"),
  BlogModel: Symbol.for("BlogModel"),
  PostModel: Symbol.for("PostModel"),
  ApiCallModel: Symbol.for("ApiCallModel"),
  BlacklistedRefreshTokenModel: Symbol.for("BlacklistedRefreshTokenModel"),
  SecurityDeviceModel: Symbol.for("SecurityDeviceModel"),
  CommentModel: Symbol.for("CommentModel"),
  LikeDislikeModel: Symbol.for("LikeDislikeModel"),
};
