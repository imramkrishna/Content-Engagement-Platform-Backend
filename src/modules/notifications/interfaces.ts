export interface IParams {
  page: number;
  limit: number;
  type?: string;
}

export interface IAppParams {
  receiverId: number;
  image?: string;
  status: string;
  title: string;
  type: string;
  additionalData?: any;
  isRead: boolean;
}

export interface INotificationType {
  type: string;
  status?: string;
  additionalData?: any;
}
