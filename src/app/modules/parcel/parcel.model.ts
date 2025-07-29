import { model, Schema } from 'mongoose';
import { IParcel, TParcelStatus, TStatusLog } from './parcel.interface';

const statusLogSchema = new Schema<TStatusLog>(
  {
    status: {
      type: String,
      enum: [
        'requested',
        'approved',
        'dispatched',
        'in-transit',
        'delivered',
        'cancelled',
        'returned',
      ],
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    remarks: { type: String },
  },
  { timestamps: true, _id: false },
);

const parcelSchema = new Schema<IParcel>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverName: { type: String, required: true },
    receiverPhoneNumber: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    parcelType: { type: String, required: true },
    weight: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    trackingId: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: [
        'requested',
        'approved',
        'dispatched',
        'in-transit',
        'delivered',
        'cancelled',
        'returned',
      ] as TParcelStatus[],
      default: 'requested',
    },
    statusHistory: [statusLogSchema],
  },
  { timestamps: true, versionKey: false },
);

export const Parcel = model<IParcel>('Parcel', parcelSchema);