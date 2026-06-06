const express = require("express");
const rentalController = require("../controller/rental");
const stkPushController = require("../controller/stkPush");
const { auth, requireAdmin, requireUser } = require("../middleware/auth");

const rentalRouter = express.Router();

rentalRouter.get("/overview", auth, requireAdmin, rentalController.getOverview);
rentalRouter.get("/me/portal", auth, requireUser, rentalController.getResidentPortal);
rentalRouter.post("/me/payments", auth, requireUser, rentalController.createResidentPayment);

rentalRouter
  .route("/tenants")
  .get(auth, requireAdmin, rentalController.getTenants)
  .post(auth, requireAdmin, rentalController.createTenant);

rentalRouter
  .route("/tenants/:id")
  .patch(auth, requireAdmin, rentalController.updateTenant)
  .delete(auth, requireAdmin, rentalController.deleteTenant);

rentalRouter
  .route("/bookings")
  .get(auth, requireAdmin, rentalController.getBookings)
  .post(auth, requireUser, rentalController.createBooking);

rentalRouter
  .route("/bookings/:id")
  .patch(auth, requireAdmin, rentalController.updateBooking);

rentalRouter
  .route("/payments")
  .get(auth, requireAdmin, rentalController.getPayments)
  .post(auth, requireAdmin, rentalController.createPayment);

rentalRouter
  .route("/payments/:id")
  .patch(auth, requireAdmin, rentalController.updatePayment);

rentalRouter.post(
  "/payments/stk-push",
  auth,
  requireAdmin,
  stkPushController.adminInitiateSTKPush
);

rentalRouter.post(
  "/me/stk-push",
  auth,
  requireUser,
  stkPushController.residentInitiateSTKPush
);

rentalRouter.post("/mpesa/callback", stkPushController.mpesaCallback);

rentalRouter
  .route("/complaints")
  .get(auth, requireAdmin, rentalController.getComplaints)
  .post(auth, requireUser, rentalController.createComplaint);

rentalRouter
  .route("/complaints/:id")
  .patch(auth, requireAdmin, rentalController.updateComplaint);

exports.rentalRouter = rentalRouter;