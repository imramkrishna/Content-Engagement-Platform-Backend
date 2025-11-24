class Resource {
  static async toJson(user: any) {
    return {
      id: user?.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNo: user.phoneNo,
      email: user.email,
      isActive: user.isActive,
      image: user.image,
      language: user.language,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      streak: user.streak
        ? {
            id: user.streak.id,
            day: user.streak.day,
            streakCount: user.streak.streakCount,
            todayScrolls: user.streak.todayScrolls,
            lastUpdatedDate: user.streak.lastUpdatedDate,
            streakAwardedToday: user.streak.streakAwardedToday,
            createdAt: user.streak.createdAt,
            updatedAt: user.streak.updatedAt,
          }
        : null,
      preferences: user.preferences
        ? user.preferences.map((pref: any) => ({
            id: pref.id,
            categoryId: pref.categoryId,
            category: pref.category
              ? {
                  id: pref.category.id,
                  name: pref.category.name,
                }
              : null,
          }))
        : [],
    };
  }

  static async collection(users: any) {
    return await Promise.all(users.map((user: any) => this.toJson(user)));
  }

  static async toJsonWithToken(user: any, token?: string) {
    return {
      id: user?.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNo: user.phoneNo,
      email: user.email,
      isActive: user.isActive,
      token: token,
      image: user.image,
      language: user.language,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      streak: user.streak
        ? {
            id: user.streak.id,
            streakCount: user.streak.streakCount,
            todayScrolls: user.streak.todayScrolls,
            lastUpdatedDate: user.streak.lastUpdatedDate,
            streakAwardedToday: user.streak.streakAwardedToday,
            createdAt: user.streak.createdAt,
            updatedAt: user.streak.updatedAt,
          }
        : null,
      preferences: user.preferences
        ? user.preferences.map((pref: any) => ({
            id: pref.id,
            categoryId: pref.categoryId,
            category: pref.category
              ? {
                  id: pref.category.id,
                  name: pref.category.name, // if multilingual adjust here
                }
              : null,
          }))
        : [],
    };
  }
}

export default Resource;
