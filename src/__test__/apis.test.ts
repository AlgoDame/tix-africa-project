import request from "supertest";
import { app } from "../index";
import assert from "assert";
import { connectToDB } from "../db/dbConnection";



beforeAll(async () => {
    let connection = await connectToDB();
    let clearTicketsTable = `DELETE FROM tickets`;
    let clearEventsTable = `DELETE FROM events`;
    let clearUsersTable = `DELETE FROM users`;

    let [ticketRows] = await connection.query(clearTicketsTable);
    let [eventRows] = await connection.query(clearEventsTable);
    let [userRows] = await connection.query(clearUsersTable);

});

let token = "";
let userId = "";
let eventId = "";

describe("Sign Up and Login Test", () => {
    it("should register the user", async () => {
        const res = await request(app)
            .post("/v1/api/users/register")
            .send({
                first_name: "Mark",
                last_name: "Andrew",
                email: "markandrew@gmail.com",
                password: "1234#"
            })
        userId = res.body.data[0].user_id;
        assert.equal(res.status, 201);
        assert.equal(res.body.status, "Success");
    });

    it("should login the user", async () => {
        const res = await request(app)
            .post("/v1/api/users/login")
            .send({
                email: "markandrew@gmail.com",
                password: "1234#"
            })

        token = res.body.data.token;
        assert.equal(res.status, 200);
        assert.equal(res.body.status, "Success");
        assert.equal(typeof res.body.data.token, "string");
    });

});

describe("Event Tests", () => {
    it("should create an event", async () => {
        const res = await request(app)
            .post("/v1/api/event")
            .set('authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                event_name: "Food club beach hangout",
                event_description: "Treat yourself to exquisite delicacies",
                event_type: "free",
                start_date: "2022-10-01",
                end_date: "2022-10-03"
            })
        eventId = res.body.data[0].event_id;
        assert.equal(res.status, 201);
        assert.equal(res.body.status, "Success");

    });

    it("should update an event", async () => {
        const res = await request(app)
            .put(`/v1/api/event/${eventId}`)
            .set('authorization', `Bearer ${token}`)
            .send({
                event_type: "paid",
            })
        assert.equal(res.status, 200);
        assert.equal(res.body.status, "Success");
        assert.equal(res.body.data[0].event_type, "paid");

    });

    it("should fetch a user's events", async () => {
        const res = await request(app)
            .get(`/v1/api/event/${userId}`)
            .set('authorization', `Bearer ${token}`)

        assert.equal(res.status, 200);
        assert.equal(res.body.status, "Success");

    });

    it("should fetch all events", async () => {
        const res = await request(app)
            .get("/v1/api/event")
            .set('authorization', `Bearer ${token}`)

        assert.equal(res.status, 200);
        assert.equal(res.body.status, "Success");

    });

});

describe("Ticket Tests", () => {
    it("should create a paid ticket", async () => {
        const res = await request(app)
            .post("/v1/api/ticket")
            .set('authorization', `Bearer ${token}`)
            .send({
                event_id: eventId,
                ticket_description: "Food club chow pass",
                ticket_type: "paid",
                ticket_price: 3000
            })

        assert.equal(res.status, 201);
        assert.equal(res.body.status, "Success");

    });

});


