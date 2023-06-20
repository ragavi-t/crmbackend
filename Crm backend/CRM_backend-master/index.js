import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { MongoClient } from "mongodb";
import CORS from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { managerAuth } from "./auth middleware/managerAuth.js";
import nodeMailer from "nodemailer";

const app = express();

const PORT = 4000;
const MONGO_URL = process.env.MONGO_URL;
console.log(MONGO_URL);
const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Mongo is connected");

app.use(express.json());
app.use(CORS());
//post admin data
app.post("/CRM/addadmin", async function (request, response) {
  const { name, email, department } = request.body;
  const adminData = await client
    .db("CRM")
    .collection("adminData")
    .findOne({ email: email });
  if (adminData) {
    response.status(401).send({ message: "User already exists" });
  } else {
    const result = await client.db("CRM").collection("adminData").insertOne({
      name: name,
      email: email,
      department: department,
    });
    response.send(result);
  }
});

//get admin data
app.get("/CRM/showAdmin", managerAuth, async function (request, response) {
  const getData = await client
    .db("CRM")
    .collection("adminData")
    .find({})
    .toArray();
  response.send(getData);
});

//update admin data
app.put("/CRM/:_id", express.json(), async function (request, response) {
  const { _id } = request.params;
  const { name, email,department } = await request.body;
  const result = await client
    .db("CRM")
    .collection("Manager Sign Up")
    .updateOne({ id: _id }, { $set: { name: name,email:email,department:department } });
  response.send(result);
});

//post team lead data
app.post("/CRM/addTeamLead", async function (request, response) {
  const { name, email, department } = request.body;
  const teamLeadData = await client
    .db("CRM")
    .collection("teamLeadData")
    .findOne({ email: email });
  if (teamLeadData) {
    response.status(401).send({ message: "User already exists" });
  } else {
    const result = await client.db("CRM").collection("teamLeadData").insertOne({
      name: name,
      email: email,
      department: department,
    });
    response.send(result);
  }
});

//get team lead data
app.get("/CRM/showTeamLead", managerAuth, async function (request, response) {
  const getData = await client
    .db("CRM")
    .collection("teamLeadData")
    .find({})
    .toArray();
  response.send(getData);
});

//post service advisor data
app.post("/CRM/addServiceAdvisor", async function (request, response) {
  const { name, email, department } = request.body;
  const serviceAdvisorData = await client
    .db("CRM")
    .collection("serviceAdvisorData")
    .findOne({ email: email });
  if (serviceAdvisorData) {
    response.status(401).send({ message: "User already exists" });
  } else {
    const result = await client
      .db("CRM")
      .collection("serviceAdvisorData")
      .insertOne({
        name: name,
        email: email,
        department: department,
      });
    response.send(result);
  }
});

//get service advisor data
app.get(
  "/CRM/showServiceAdvisor",
  managerAuth,
  async function (request, response) {
    const getData = await client
      .db("CRM")
      .collection("serviceAdvisorData")
      .find({})
      .toArray();
    response.send(getData);
  }
);

//post technicians data
app.post("/CRM/addTechnicians", async function (request, response) {
  const { name, email, department } = request.body;
  const techniciansData = await client
    .db("CRM")
    .collection("techniciansData")
    .findOne({ email: email });
  if (techniciansData) {
    response.status(401).send({ message: "User already exists" });
  } else {
    const result = await client
      .db("CRM")
      .collection("techniciansData")
      .insertOne({
        name: name,
        email: email,
        department: department,
      });
    response.send(result);
  }
});

//get technicians data
app.get(
  "/CRM/showTechnicians",
  managerAuth,
  async function (request, response) {
    const getData = await client
      .db("CRM")
      .collection("techniciansData")
      .find({})
      .toArray();
    response.send(getData);
  }
);

//post service request data
app.post("/CRM/addServiceRequests", async function (request, response) {
  const { name, email, vehiclebrand, vehiclevin, status } = request.body;
  const serviceRequestData = await client
    .db("CRM")
    .collection("serviceLeads")
    .findOne({ vehiclevin: vehiclevin });
  if (serviceRequestData) {
    response.status(401).send({
      message: "Vehicle already exists",
      status: serviceRequestData.status,
    });
  } else {
    const result = await client.db("CRM").collection("serviceLeads").insertOne({
      name: name,
      email: email,
      vehiclebrand: vehiclebrand,
      vehiclevin: vehiclevin,
      status: status,
    });
    response.send(result);
  }
});

//get service request data
app.get(
  "/CRM/showServiceRequests",
  managerAuth,
  async function (request, response) {
    const getData = await client
      .db("CRM")
      .collection("serviceLeads")
      .find({})
      .toArray();
    response.send(getData);
  }
);

//post leads
app.post("/CRM/addLeads", async function (request, response) {
  const { name, email, vehiclebrand, vehiclevin, status } = request.body;
  const serviceRequestData = await client
    .db("CRM")
    .collection("Leads")
    .findOne({ vehiclevin: vehiclevin });
  if (serviceRequestData) {
    response.status(401).send({
      message: "Vehicle already exists",
      status: serviceRequestData.status,
    });
  } else {
    const result = await client.db("CRM").collection("Leads").insertOne({
      name: name,
      email: email,
      vehiclebrand: vehiclebrand,
      vehiclevin: vehiclevin,
      status: status,
    });
    response.send(result);
  }
});

//get lead data
app.get("/CRM/showLeads", managerAuth, async function (request, response) {
  const getData = await client.db("CRM").collection("Leads").find({}).toArray();
  response.send(getData);
});

//bcrypt password
async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  // console.log(salt);
  // console.log(hashedPassword);
  return hashedPassword;
}

//sign up manager
app.post("/CRM/signUpManager", async function (request, response) {
  const { name, email, password } = request.body;

  const serviceRequestData = await client
    .db("CRM")
    .collection("Manager Sign Up")
    .findOne({ email: email });
  if (serviceRequestData) {
    response.status(401).send({
      message: "User already exists",
    });
  } else {
    const hashedPassword = await generateHashedPassword(password);
    const result = await client
      .db("CRM")
      .collection("Manager Sign Up")
      .insertOne({
        name: name,
        email: email,
        password: hashedPassword,
      });
    response.send({ password: hashedPassword });
  }
});

//logIn manager
app.post("/CRM/logInManager", async function (request, response) {
  const { email, password } = await request.body;
  const userData = await client
    .db("CRM")
    .collection("Manager Sign Up")
    .findOne({ email: email });
  if (!userData) {
    response.status(401).send({
      message: "Invalid Credentials",
    });
  } else {
    const storedPassword = userData.password;
    const passwordCheck = await bcrypt.compare(password, storedPassword);
    if (passwordCheck == true) {
      const token = jwt.sign({ id: userData._id }, process.env.SECRET_KEY);
      response.status(200).send({
        message: "Logged in Successfully",
        token: token,
      });
    } else {
      response.status(401).send({ message: "Invalid Credentials" });
    }
  }
});

//forgot password and send otp
app.post(
  "/CRM/forgotPassword",
  express.json(),
  async function (request, response) {
    const { username, email, password } = await request.body;
    const userFromDB = await client
      .db("CRM")
      .collection("Manager Sign Up")
      .findOne({ email: email });
    console.log(userFromDB);
    if (userFromDB) {
      const number = Math.random();
      const otp = (number * 10000).toFixed(0);
      const result = await client.db("CRM").collection("OTP").insertOne({
        email: email,
        otp: otp,
      });

      let transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: "selvamyoor@gmail.com",
          pass: process.env.APP_PASSWORD,
        },
      });

      let info = {
        from: "selvamyoor@gmail.com",
        to: email,
        subject: "Reset the password",
        text: "Your one time password is " + otp,
      };
      transporter.sendMail(info, (err) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log("email sent successfully");
        }
      });

      setTimeout(async () => {
        const deleteOTP = await client.db("CRM").collection("OTP").deleteOne({
          email: email,
          otp: otp,
        });
      }, 20000);

      response.send({ result });
    } else {
      response.status(401).send({ message: "invalid credentials" });
    }
  }
);

//verify OTP
app.post("/CRM/OTP", express.json(), async function (request, response) {
  const { email, otp } = await request.body;
  const validUser = await client
    .db("CRM")
    .collection("OTP")
    .findOne({ otp: otp });
  if (!validUser) {
    response.status(401).send({ message: "otp does not match" });
  } else {
    const token = jwt.sign({ otp: validUser.otp }, process.env.OTP_SECRET_KEY);
    response.status(200).send({
      message: "Logged in successfully",
      token: token,
    });
  }
});

//update password
app.put("/CRM/:email", express.json(), async function (request, response) {
  const { email } = request.params;
  const { newpassword, password } = await request.body;
  const hashedPassword = await generateHashedPassword(password);
  const result = await client
    .db("CRM")
    .collection("Manager Sign Up")
    .updateOne({ email: email }, { $set: { password: hashedPassword } });
  response.send(result);
});
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
