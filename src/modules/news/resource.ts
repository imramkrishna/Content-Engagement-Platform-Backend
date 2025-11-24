class Resource {
  static async toJson(news: any, language: string, userId?: any) {
    const likes = Array.isArray(news?.likes) ? news.likes : [];
    const categories = Array.isArray(news?.categories) ? news.categories : [];
    const images = Array.isArray(news?.images) ? news.images : [];
    const poll = news?.polls || null;

    // Compute isLikedByMe
    const isLikedByMe = userId
      ? likes.some((like: any) => Number(like.senderId) === userId)
      : false;

    return {
      id: news?.id || null,
      title: news?.title?.[language] || "",
      status: news?.status || "",
      content: news?.content?.[language] || "",
      category: news?.category
        ? {
            id: news.category.id || null,
            name: news.category.name?.[language] || "",
          }
        : null,
      image: news?.image || "",
      categories: categories.map((category: any) => ({
        id: category?.id || null,
        name: category?.name?.[language] || "",
      })),
      images: images,
      infos: {
        scheduleDate: news?.infos?.scheduleDate || "",
        newsSource: news?.infos?.newsSource?.[language] || "",
        newsSourceLink: news?.infos?.newsSourceLink || "",
        newsExpiry: news?.infos?.newsExpiry || "",
        imageSource: news?.infos?.imageSource?.[language] || "",
        author: news?.infos?.author?.[language] || "",
        date: news?.infos?.date || "",
      },
      slug: news?.slug || "",
      createdAt: news?.createdAt || "",
      isActive: news?.isActive || false,
      isTrending: news?.isTrending || false,
      poll: poll
        ? (() => {
            const answerBy = Array.isArray(poll.answerBy) ? poll.answerBy : [];
            const totalResponses = answerBy.length;

            // Check if current user answered
            const myAnswer = userId
              ? answerBy.find(
                  (resp: any) => Number(resp.userId) === Number(userId)
                )
              : null;

            const isAnsweredByMe = !!myAnswer;

            // Count answers per option
            const answers = Array.isArray(poll.answers)
              ? poll.answers.map((a: any, index: number) => {
                  const answerText =
                    typeof a === "object" ? a?.[language] || "" : a || "";

                  const count = answerBy.filter(
                    (resp: any) => Number(resp.answerIndex) === index
                  ).length;

                  return {
                    id: index + 1,
                    answer: answerText,
                    count, // votes for this option
                  };
                })
              : [];

            // Build summary separately
            const answerStats = answers.reduce(
              (acc: any, ans: any, idx: number) => {
                acc[`option_${idx + 1}`] = ans.count;
                return acc;
              },
              {}
            );

            return {
              id: poll.id || null,
              title:
                typeof poll.title === "object"
                  ? poll.title?.[language] || ""
                  : poll.title || "",
              question:
                typeof poll.question === "object"
                  ? poll.question?.[language] || ""
                  : poll.question || "",
              answers, // detailed array
              answerStats, // simplified counts
              totalResponses,
              isAnsweredByMe,
              myAnswerIndex: myAnswer ? Number(myAnswer.answerIndex) : null, // ✅ option selected by me
            };
          })()
        : null,
      likesCount: likes.length,
      isLikedByMe,
      // likes array is NOT exposed
    };
  }

  static async collection(newsArray: any[], language: string, userId?: any) {
    return await Promise.all(
      newsArray.map((newsItem: any) => this.toJson(newsItem, language, userId))
    );
  }
}

export default Resource;
