import NewsResource from "../news/resource";
class Resource {
  static async toJson(bookmark: any, language: string) {
    return {
      id: bookmark?.id,
      newsId: bookmark?.newsId,
      sessionId: bookmark?.sessionId,
      news: await NewsResource.toJson(bookmark?.news, language),
      createdAt: bookmark?.news?.createdAt,
    };
  }
  static async collection(bookmarks: any, language: string) {
    return await Promise.all(
      bookmarks.map((bookmark: any) => this.toJson(bookmark, language))
    );
  }
}

export default Resource;
