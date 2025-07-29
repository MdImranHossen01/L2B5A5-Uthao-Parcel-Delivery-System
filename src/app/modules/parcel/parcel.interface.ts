import { Types } from 'mongoose';

export type TParcelStatus =
  | 'requested'
  | 'approved'
  | 'dispatched'
  | 'in-transit'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type TStatusLog = {
  status: TParcelStatus;
  timestamp?: Date;
  updatedBy: Types.ObjectId;
  remarks?: string;
};

export interface IParcel {
  sender: Types.ObjectId;
  receiverName: string;
  receiverPhoneNumber: string;
  deliveryAddress: string;
  parcelType: string;
  weight: number;
  deliveryFee: number;
  trackingId?: string;
  status: TParcelStatus;
  statusHistory: TStatusLog[];
}