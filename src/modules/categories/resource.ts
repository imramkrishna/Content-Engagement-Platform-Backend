class Resource {
  static async toJson(category: any, language: string) {
    return {
      id: category?.id,
      name: category.name[language],
      image: category.image,
      slug: category.slug,
      createdAt: category.createdAt,
      isActive: category.isActive,
    };
  }
  static async collection(categories: any, language: string) {
    return await Promise.all(
      categories.map((category: any) => this.toJson(category, language))
    );
  }
}

export default Resource;
