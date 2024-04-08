const express = require("express");
const router = express.Router();
const Vehicle = require("../models/vehicles");
const multer = require("multer");
const path = require("path");
const Booking = require("../models/booking");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB file size limit
  },
});

router.post("/addvehicle", upload.array("images", 3), async (req, res) => {
  try {
    const {
      name,
      mobilenumber,
      postedBy,
      mileage,
      rentperday,
      type,
      description,
    } = req.body;

    const imageUrls = req.files.map((file) => file.path);

    const newVehicle = new Vehicle({
      name,
      mobilenumber,
      postedBy,
      mileage,
      rentperday,
      type,
      description,
      imageurls: imageUrls,
    });

    await newVehicle.save();
    res
      .status(201)
      .json({ message: "New vehicle and data added", data: newVehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/gettallvehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.status(200).json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({ message: "Failed to fetch vehicles" });
  }
});

router.post("/gettvehiclesbyeid", async (req, res) => {
  const { vid } = req.body;
  try {
    const vehicle = await Vehicle.findOne({ _id: vid });
    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({ message: "Failed to fetch vehicle" });
  }
});

router.post("/review", async (req, res) => {
  const { vid, actionType } = req.body;

  try {
    const vehicle = await Vehicle.findOne({ _id: vid });

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }

    // Update likes and dislikes based on actionType
    if (actionType === 'like') {
      vehicle.likes = (vehicle.likes || 0) + 1;
    } else if (actionType === 'dislike') {
      vehicle.dislikes = (vehicle.dislikes || 0) + 1;
    }

    await vehicle.save();

    res
      .status(200)
      .json({ message: "Review submitted successfully", data: vehicle });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
}); 

router.get("/getVehicleBookings", async (req, res) => {
  try {
    // Fetch vehicles with bookings
    const vehicles = await Vehicle.find({}).populate({
      path: 'currentbookings',
      select: 'bookingid fromdate todate userid postedBy status', // Select the required fields
    });

    if (!vehicles) {
      return res.status(404).json({ message: "Vehicles not found" });
    }

    // Extract required data and send the response
    const vehiclesWithBookings = vehicles.map((vehicle) => ({
      _id: vehicle._id,
      name: vehicle.name,
      currentbookings: vehicle.currentbookings.map((booking) => ({
        bookingid: booking.bookingid,
        fromdate: booking.fromdate,
        todate: booking.todate,
        userid: booking.userid,
        postedBy: booking.postedBy,
        status: booking.status,
      })),
    }));

    res.status(200).json(vehiclesWithBookings);
  } catch (error) {
    console.error("Error fetching vehicles and bookings:", error);
    res.status(500).json({ message: "Failed to fetch vehicles and bookings" });
  }
});
 
router.post("/interaction", async (req, res) => {
  try {
    const { userId, vid, buserId, bvid } = req.body;

    // Create a new Interaction document
    const interaction = new Interaction({ userId, vid, buserId, bvid });

    // Save the interaction to the database
    await interaction.save();

    res.status(201).json({ message: "Interaction data saved successfully", interaction });
  } catch (error) {
    console.error("Error saving interaction data:", error);
    res.status(500).json({ message: "Failed to save interaction data" });
  }
});

router.get('/review-data', async (req, res) => {
  try {
    // Fetch vehicles to be reviewed from the database
    const vehicles = await Vehicle.find({ toBeReviewed: true });

    // Extract likes and dislikes from each vehicle
    const reviewData = vehicles.map(vehicle => ({
      _id: vehicle._id,
      likes: vehicle.likes,
      dislikes: vehicle.dislikes
    }));

    // Return the likes and dislikes data as a JSON response
    res.status(200).json(reviewData);
  } catch (error) {
    console.error('Error fetching review data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getVehicleName/:vehicleId', async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ name: vehicle.name });
  } catch (error) {
    console.error('Error fetching vehicle name:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/getVehicleNamesByIds', async (req, res) => {
  const { ids } = req.body;
  try {
    const vehicles = await Vehicle.find({ _id: { $in: ids } });
    const vehicleNames = vehicles.map(vehicle => ({ id: vehicle._id, name: vehicle.name }));
    res.status(200).json(vehicleNames);
  } catch (error) {
    console.error('Error fetching vehicle names:', error);
    res.status(500).json({ message: 'Failed to fetch vehicle names' });
  }
});

module.exports = router;
