import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { IParcel } from './parcel.interface';
import { Parcel } from './parcel.model';

const generateTrackingId = async (): Promise<string> => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TRK-${year}${month}${day}-${randomPart}`;
};

const createParcel = async (senderId: string, payload: IParcel) => {
  const trackingId = await generateTrackingId();
  payload.sender = new mongoose.Types.ObjectId(senderId);
  payload.trackingId = trackingId;
  payload.status = 'requested';
  payload.statusHistory = [
    {
      status: 'requested',
      updatedBy: new mongoose.Types.ObjectId(senderId),
      remarks: 'Parcel creation request received.',
    },
  ];
  const newParcel = await Parcel.create(payload);
  return newParcel;
};

const updateParcelStatusByAdmin = async (parcelId: string, adminId: string, newStatus: IParcel['status']) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found.');

  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    { status: newStatus, $push: { statusHistory: { status: newStatus, updatedBy: new mongoose.Types.ObjectId(adminId), remarks: `Status updated by admin.` } } },
    { new: true },
  );
  return updatedParcel;
};

const cancelParcel = async (parcelId: string, senderId: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found.');
  if (parcel.sender.toString() !== senderId) throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to cancel this parcel.');
  if (!['requested', 'approved'].includes(parcel.status)) throw new AppError(httpStatus.BAD_REQUEST, `Cannot cancel parcel with status "${parcel.status}".`);

  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    { status: 'cancelled', $push: { statusHistory: { status: 'cancelled', updatedBy: new mongoose.Types.ObjectId(senderId), remarks: 'Cancelled by sender.' } } },
    { new: true },
  );
  return updatedParcel;
};

const confirmDeliveryByReceiver = async (parcelId: string, receiverId: string) => {
  const receiver = await User.findById(receiverId).select('+phone');
  if (!receiver) throw new AppError(httpStatus.NOT_FOUND, 'Receiver user not found.');

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found.');
  if (parcel.receiverPhoneNumber !== receiver.phone) throw new AppError(httpStatus.FORBIDDEN, 'You are not the intended receiver.');
  if (parcel.status === 'delivered') throw new AppError(httpStatus.BAD_REQUEST, 'Parcel already delivered.');

  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    { status: 'delivered', $push: { statusHistory: { status: 'delivered', updatedBy: new mongoose.Types.ObjectId(receiverId), remarks: 'Delivery confirmed by receiver.' } } },
    { new: true },
  );
  return updatedParcel;
};

const getMyParcels = async (senderId: string) => Parcel.find({ sender: senderId }).populate('sender', 'name email');
const getIncomingParcels = async (receiverId: string) => {
  const receiver = await User.findById(receiverId).select('+phone');
  if (!receiver || !receiver.phone) throw new AppError(httpStatus.NOT_FOUND, 'Receiver phone number not found.');
  return Parcel.find({ receiverPhoneNumber: receiver.phone });
};
const getAllParcels = async () => Parcel.find({}).populate('sender', 'name email');

export const ParcelServices = { createParcel, updateParcelStatusByAdmin, cancelParcel, confirmDeliveryByReceiver, getMyParcels, getIncomingParcels, getAllParcels };