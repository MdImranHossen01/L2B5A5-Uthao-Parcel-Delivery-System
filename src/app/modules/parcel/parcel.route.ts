import express from 'express';
import { auth } from '../../middlewares/auth';
import { ParcelControllers } from './parcel.controller';

const router = express.Router();

// Sender routes
router.post('/', auth('sender'), ParcelControllers.createParcel);
router.get('/my-parcels', auth('sender'), ParcelControllers.getMyParcels);
router.patch('/:id/cancel', auth('sender'), ParcelControllers.cancelParcel);

// Receiver routes
router.get('/incoming', auth('receiver'), ParcelControllers.getIncomingParcels);
router.patch('/:id/confirm-delivery', auth('receiver'), ParcelControllers.confirmDeliveryByReceiver);

// Admin routes
router.get('/', auth('admin'), ParcelControllers.getAllParcels);
router.patch('/:id/status', auth('admin'), ParcelControllers.updateParcelStatusByAdmin);


export const ParcelRoutes = router;