class Resource {
  static async toJson(reward: any) {
    return {
      id: reward?.id,
      productName: reward.productName,
      productPrice: reward.productPrice,
      productDescription: reward.productDescription,
      expirationDate: reward.expirationDate,
      image: reward.image,
      status: reward.status,
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt,
    };
  }

  static async collection(rewards: any[]) {
    return await Promise.all(rewards.map((reward: any) => this.toJson(reward)));
  }
}

export default Resource;
