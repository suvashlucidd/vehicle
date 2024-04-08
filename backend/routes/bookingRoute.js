const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const Vehicle = require("../models/vehicles");
const stripe = require('stripe')('sk_test_51NkUTJA4TauPDoK9fVcuhuMvLeRUhCdox70C2a1aSAGdfQ1ZISJaGAPoglWDNPyEPXVG5hhHXqKhN6zyTmOMAxjW002vv5A2Tk');

router.post("/book", async (req, res) => {
  const {
    vehicle,
    userid,
    fromdate,
    todate,
    totalamount,
    postedBy,
    likes,
    dislikes,
    
    totaldays,
    token
  } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const payment = await stripe.charges.create({
      amount: totalamount * 100,
      customer: customer.id,
      currency: 'NPR',
      receipt_email: token.email
    }, {
      idempotencyKey: uuidv4()
    });

    if (payment) {
      const newBooking = new Booking({
        vehicle: vehicle.name,
        vehicleid: vehicle._id,
        userid,
        fromdate: moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        todate: moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        totalamount,
        totaldays,
        postedBy:vehicle.postedBy,
        likes:vehicle.likes,
        dislikes:vehicle.dislikes,
        transcationId: "1234",
      });

      const booking = await newBooking.save();

      const vehicleEmp = await Vehicle.findOne({ _id: vehicle._id });

      vehicleEmp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        todate: moment(todate, "DD-MM-YYYY").format("DD-MM-YYYY"),
        userid,
        postedBy:vehicle.postedBy,
        status: booking.status,
      });

      await vehicleEmp.save();
    }

    res.send('Payment Successful, Your Vehicle is Now Booked');
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;

  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, vehicleid } = req.body;
  try {
    const bookingitem = await Booking.findOne({ _id: bookingid })
    bookingitem.status = 'canceled'
    await bookingitem.save()
    const vehicle = await Vehicle.findOne({ _id: vehicleid })
    const bookings = vehicle.currentbookings
    const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid)
    vehicle.currentbookings = temp

    await vehicle.save()
    res.send('Dear User, Your Booking Canceled Successfully')
  } catch (error) {
    res.sendStatus(400).json({ error })
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
    res.send(bookings)
  }
  catch (error) {
    return res.status(400).json({ error });
  }
});
router.get("/getVehicleBookings", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).select("name _id currentbookings");

    if (!vehicles) {
      return res.status(404).json({ message: "Vehicles not found" });
    }

    const vehiclesWithBookings = vehicles.map((vehicle) => ({
      _id: vehicle._id,
      name: vehicle.name,
      currentbookings: vehicle.currentbookings,
    }));

    res.status(200).json(vehiclesWithBookings);
  } catch (error) {
    console.error("Error fetching vehicles and bookings:", error);
    res.status(500).json({ message: "Failed to fetch vehicles and bookings" });
  }
});

module.exports = router;
