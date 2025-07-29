import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ParcelServices } from './parcel.service';

const createParcel = catchAsync(async (req, res) => {
  const result = await ParcelServices.createParcel(req.user.id, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Parcel created successfully.', data: result });
});

const getMyParcels = catchAsync(async (req, res) => {
  const result = await ParcelServices.getMyParcels(req.user.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Your parcels retrieved successfully.', data: result });
});

const getIncomingParcels = catchAsync(async (req, res) => {
    const result = await ParcelServices.getIncomingParcels(req.user.id);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Incoming parcels retrieved successfully.', data: result });
})

const getAllParcels = catchAsync(async (req, res) => {
  const result = await ParcelServices.getAllParcels();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'All parcels retrieved successfully.', data: result });
});

const updateParcelStatusByAdmin = catchAsync(async (req, res) => {
  const { status } = req.body;
  const result = await ParcelServices.updateParcelStatusByAdmin(req.params.id, req.user.id, status);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Parcel status updated successfully.', data: result });
});

const cancelParcel = catchAsync(async (req, res) => {
  const result = await ParcelServices.cancelParcel(req.params.id, req.user.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Parcel cancelled successfully.', data: result });
});

const confirmDeliveryByReceiver = catchAsync(async (req, res) => {
    const result = await ParcelServices.confirmDeliveryByReceiver(req.params.id, req.user.id);
    sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Parcel delivery confirmed successfully.', data: result });
});


export const ParcelControllers = { createParcel, getMyParcels, getIncomingParcels, getAllParcels, updateParcelStatusByAdmin, cancelParcel, confirmDeliveryByReceiver };