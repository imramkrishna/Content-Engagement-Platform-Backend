class PollResource {
  static async toJson(poll: any, language: string = "en") {
    return {
      pollId: poll?.id,

      question: poll?.question || {},

      options: Array.isArray(poll?.options) ? poll.options : [],

      results: Array.isArray(poll?.options)
        ? poll.options.map((opt: any) => {
            const count =
              Array.isArray(poll?.answerBy) &&
              poll.answerBy.filter((a: any) => {
                if (typeof a === "object") {
                  return (
                    JSON.stringify(a) === JSON.stringify(opt) ||
                    a?.[language] === opt?.[language]
                  );
                }
                return false;
              }).length;

            return {
              answer: opt,
              count: count || 0,
            };
          })
        : [],
    };
  }

  static async collection(polls: any[], language: string = "en") {
    return await Promise.all(polls.map((poll) => this.toJson(poll, language)));
  }
}

export default PollResource;
